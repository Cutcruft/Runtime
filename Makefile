.PHONY: frontend backend sdk plugin build dev clean

FRONTEND_DIR := frontend
BACKEND_STATIC := runtime/src/main/resources/static
SDK_POM := sdk/pom.xml
RUNTIME_POM := runtime/pom.xml
PLUGIN_PROJECT := demo-plugin
PLUGIN_DIR := plugins/demo
STORAGE_PROJECT := demo-storage-plugin
STORAGE_DIR := plugins/demo-storage

frontend:
	cd $(FRONTEND_DIR) && (npm ci || npm install) && npm run build

sdk:
	mvn -q -N install -DskipTests
	mvn -f $(SDK_POM) install -DskipTests

backend:
	mvn package -DskipTests

plugin: sdk
	mvn -f $(PLUGIN_PROJECT)/pom.xml package
	mkdir -p $(PLUGIN_DIR)
	cp $(PLUGIN_PROJECT)/config.yaml $(PLUGIN_DIR)/
	cp $(PLUGIN_PROJECT)/target/demo.jar $(PLUGIN_DIR)/
	mvn -f $(STORAGE_PROJECT)/pom.xml package
	mkdir -p $(STORAGE_DIR)
	cp $(STORAGE_PROJECT)/config.yaml $(STORAGE_DIR)/
	cp $(STORAGE_PROJECT)/target/demo-storage.jar $(STORAGE_DIR)/

build: frontend plugin
	mkdir -p $(BACKEND_STATIC)
	cp -r $(FRONTEND_DIR)/dist/* $(BACKEND_STATIC)/
	mvn package -DskipTests

dev:
	mkdir -p $(BACKEND_STATIC)
	cp -r $(FRONTEND_DIR)/dist/* $(BACKEND_STATIC)/ 2>/dev/null || true
	mvn -q install -DskipTests
	mvn -f $(RUNTIME_POM) exec:java -Dexec.mainClass=runtime.MainKt -Dexec.classpathScope=runtime

clean:
	mvn clean
	mvn -f $(PLUGIN_PROJECT)/pom.xml clean
	mvn -f $(STORAGE_PROJECT)/pom.xml clean
	rm -rf $(PLUGIN_DIR) $(STORAGE_DIR)
	rm -rf $(BACKEND_STATIC)/*
	cd $(FRONTEND_DIR) && rm -rf node_modules dist
