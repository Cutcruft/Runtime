import { Ref, Component } from 'vue';

/**
 * @cutcrft/plugin-sdk
 *
 * The official SDK for building CutCruft frontend plugins.
 * Provides type definitions and helper utilities.
 *
 * Usage:
 *   import { definePlugin, useCfg, useData } from '@cutcrft/plugin-sdk'
 */

interface ShortcutEntry {
    id: string;
    keys: string[];
    action: 'navigate' | 'command' | 'event' | 'pageBack' | 'pageForward';
    page?: string;
    command?: string;
    params?: Record<string, unknown>;
    scope?: 'global' | 'page' | 'component';
    label?: string;
}
interface RuntimeEvent {
    kind: string;
    payload?: unknown;
    source?: string;
    ts: number;
}
type PluginEvent = RuntimeEvent;
interface PluginStorage {
    get<T = unknown>(key: string): T | null;
    set<T = unknown>(key: string, value: T): void;
    remove(key: string): void;
    keys(): string[];
    clear(): void;
}
interface EntityStoreConfig {
    entityType: string;
    pageId?: string;
    transform?: (item: any) => any;
    subscribe?: (ids: string[]) => void;
}
interface EntityStoreApi {
    items: Ref<any[]>;
    loading: Ref<boolean>;
    error: Ref<string | null>;
    load(): Promise<void>;
    create(data: Record<string, unknown>): Promise<any>;
    update(id: string, data: Record<string, unknown>): Promise<any>;
    remove(id: string): Promise<void>;
    invalidate(): void;
    selectedId: Ref<string | null>;
    select(id: string | null): void;
    selected: Ref<any | null>;
}
interface ModalHandle {
    close(): void;
    result: Promise<unknown>;
}
interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
    separator?: boolean;
    action?: () => void;
    children?: MenuItem[];
}
interface ModalApi {
    open(component: Component, props?: Record<string, unknown>): ModalHandle;
    menu(items: MenuItem[], anchor?: {
        x: number;
        y: number;
    }): ModalHandle;
    panel(component: Component, props?: Record<string, unknown>): ModalHandle;
    tooltip(text: string, anchor?: {
        x: number;
        y: number;
    }): ModalHandle;
    closeAll(): void;
}
interface ClipboardApi {
    readText(): Promise<string>;
    writeText(text: string): Promise<void>;
    read(): Promise<{
        type: string;
        data: unknown;
    } | null>;
    write(data: unknown): Promise<void>;
}
interface AnimationApi {
    apply(el: HTMLElement, keyframes: Keyframe[], options?: KeyframeAnimationOptions): Animation | null;
    toggleClass(el: HTMLElement, className: string, duration?: number): void;
    clear(el: HTMLElement): void;
}
interface ThemeApi {
    readonly mode: 'auto' | 'light' | 'dark';
    setMode(mode: 'auto' | 'light' | 'dark'): void;
    cycle(): void;
    getToken(name: string): string | undefined;
    getTokens(): Record<string, string>;
}
interface RouterApi {
    open(pageId: string): void;
    readonly activePageId: string | null;
}
interface PluginManifest {
    id: string;
    name: string;
    version: string;
    description?: string;
    dependencies?: string[];
}
interface PluginSetupContext {
    registerComponent(type: string, component: Component): () => void;
    registerEditor(type: string, loader: () => Promise<{
        default: Component;
    }>): () => void;
    registerShortcut(entry: ShortcutEntry): () => void;
    emit(name: string, payload?: unknown): void;
    on(name: string, handler: (event: PluginEvent) => void): () => void;
    onRuntimeEvent(handler: (event: RuntimeEvent) => void): () => void;
    storage: PluginStorage;
    createEntityStore(config: EntityStoreConfig): EntityStoreApi;
    modal: ModalApi;
    clipboard: ClipboardApi;
    animation: AnimationApi;
    theme: ThemeApi;
    router: RouterApi;
    registerThemeTokens(tokens: Record<string, string>): () => void;
    config: any;
    session: any;
    toasts: any;
}
interface PluginDefinition {
    manifest: PluginManifest;
    setup: (ctx: PluginSetupContext) => void | Promise<void>;
    teardown?: () => void | Promise<void>;
}
/**
 * Define a CutCruft plugin with full type safety.
 *
 * @example
 * ```ts
 * import { definePlugin } from '@cutcrft/plugin-sdk'
 *
 * export default definePlugin({
 *   manifest: { id: 'my-plugin', name: 'My Plugin', version: '1.0.0' },
 *   setup(ctx) {
 *     ctx.registerComponent('MyWidget', MyWidget)
 *   }
 * })
 * ```
 */
declare function definePlugin(definition: PluginDefinition): PluginDefinition;

export { type AnimationApi, type ClipboardApi, type EntityStoreApi, type EntityStoreConfig, type MenuItem, type ModalApi, type ModalHandle, type PluginDefinition, type PluginEvent, type PluginManifest, type PluginSetupContext, type PluginStorage, type RouterApi, type RuntimeEvent, type ShortcutEntry, type ThemeApi, definePlugin };
