.PHONY: frontend backend sdk module modules plugin plugins build dev clean

FRONTEND_DIR := runtime/frontend
BACKEND_STATIC := runtime/src/main/resources/static
SDK_POM := sdk/pom.xml
RUNTIME_POM := runtime/pom.xml
MODULES_DIR := modules
PLUGINS_DIR := tmp/plugins
DEMO_PLUGIN_PROJECT := demo/demo-plugin
DEMO_PLUGIN_DIR := tmp/plugins/demo
STORAGE_PLUGIN_PROJECT := demo/demo-storage-plugin
STORAGE_PLUGIN_DIR := tmp/plugins/demo-storage
RUNTIME_CONFIG := $(CURDIR)/demo/config/application.yaml

frontend:
	cd $(FRONTEND_DIR) && (npm ci || npm install) && npm run build
	cd sdk/frontend && (npm ci || npm install) && npm run build
	cp sdk/frontend/dist/pluginSdk/pluginSdk.js $(FRONTEND_DIR)/dist/pluginSdk.js
	cp sdk/frontend/dist/pluginSdk/pluginSdk.css $(FRONTEND_DIR)/dist/pluginSdk.css

sdk:
	mvn -q -N install -DskipTests
	mvn -f $(SDK_POM) install -DskipTests

backend:
	mvn package -DskipTests

module: sdk
	@for d in $$(ls $(MODULES_DIR)); do \
		pom="$(MODULES_DIR)/$$d/pom.xml"; \
		if [ -f "$$pom" ]; then \
			if [ -f "$(MODULES_DIR)/$$d/frontend/package.json" ]; then \
				echo "Building frontend $$d..."; \
				(cd "$(MODULES_DIR)/$$d/frontend" && (npm ci --no-audit --no-fund || npm install --no-audit --no-fund) && npm run build 2>/dev/null); \
			fi; \
			echo "Building module $$d..."; \
			mvn -f "$$pom" -q package -DskipTests 2>/dev/null; \
			mkdir -p "$(PLUGINS_DIR)/$$d"; \
			jar=$$(ls "$(MODULES_DIR)/$$d/target/"*.jar 2>/dev/null | head -1); \
			if [ -n "$$jar" ]; then \
				cp "$$jar" "$(PLUGINS_DIR)/$$d/$$(basename $$jar)"; \
				[ -f "$(MODULES_DIR)/$$d/config.yaml" ] && cp "$(MODULES_DIR)/$$d/config.yaml" "$(PLUGINS_DIR)/$$d/" || true; \
				echo "  -> installed $$(basename $$jar)"; \
			fi; \
		fi; \
	done

modules: sdk module

plugin: sdk
	mvn -f $(DEMO_PLUGIN_PROJECT)/pom.xml package
	mkdir -p $(DEMO_PLUGIN_DIR)
	cp $(DEMO_PLUGIN_PROJECT)/config.yaml $(DEMO_PLUGIN_DIR)/
	cp $(DEMO_PLUGIN_PROJECT)/target/demo.jar $(DEMO_PLUGIN_DIR)/
	mvn -f $(STORAGE_PLUGIN_PROJECT)/pom.xml package
	mkdir -p $(STORAGE_PLUGIN_DIR)
	cp $(STORAGE_PLUGIN_PROJECT)/config.yaml $(STORAGE_PLUGIN_DIR)/
	cp $(STORAGE_PLUGIN_PROJECT)/target/demo-storage.jar $(STORAGE_PLUGIN_DIR)/

plugins: sdk plugin modules

build: frontend plugins
	mkdir -p $(BACKEND_STATIC)
	cp -r $(FRONTEND_DIR)/dist/* $(BACKEND_STATIC)/
	mvn package -DskipTests

native: frontend plugins
	mkdir -p $(BACKEND_STATIC)
	cp -r $(FRONTEND_DIR)/dist/* $(BACKEND_STATIC)/
	mvn package -DskipTests -Pnative
	@echo "Native image: runtime/target/cutcruft"

dev:
	mkdir -p $(BACKEND_STATIC)
	cp -r $(FRONTEND_DIR)/dist/* $(BACKEND_STATIC)/ 2>/dev/null || true
	$(MAKE) plugins
	mvn -q install -DskipTests
	RUNTIME_CONFIG=$(RUNTIME_CONFIG) mvn -f $(RUNTIME_POM) exec:java -Dexec.mainClass=runtime.MainKt -Dexec.classpathScope=runtime

clean:
	mvn clean
	mvn -f $(DEMO_PLUGIN_PROJECT)/pom.xml clean
	mvn -f $(STORAGE_PLUGIN_PROJECT)/pom.xml clean
	rm -rf $(PLUGINS_DIR)
	rm -rf $(BACKEND_STATIC)/*
	cd $(FRONTEND_DIR) && rm -rf node_modules dist
