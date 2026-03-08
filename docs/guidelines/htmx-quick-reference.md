# HTMX + Web Components Quick Reference

## HTMX Attributes

### Common Attributes
```html
hx-get="/endpoint"          <!-- GET request -->
hx-post="/endpoint"         <!-- POST request -->
hx-put="/endpoint"          <!-- PUT request -->
hx-delete="/endpoint"       <!-- DELETE request -->

hx-target="#element-id"     <!-- Where to swap content -->
hx-swap="innerHTML"         <!-- How to swap (innerHTML, outerHTML, beforeend, etc) -->
hx-trigger="click"          <!-- What triggers the request -->
hx-indicator="#spinner"     <!-- Loading indicator element -->

hx-push-url="true"          <!-- Update browser URL -->
hx-confirm="Are you sure?"  <!-- Confirmation dialog -->
```

### Swap Strategies
```html
hx-swap="innerHTML"         <!-- Replace inner content (default) -->
hx-swap="outerHTML"         <!-- Replace entire element -->
hx-swap="beforebegin"       <!-- Insert before element -->
hx-swap="afterbegin"        <!-- Insert at start of element -->
hx-swap="beforeend"         <!-- Insert at end of element -->
hx-swap="afterend"          <!-- Insert after element -->
hx-swap="delete"            <!-- Delete element -->
hx-swap="none"              <!-- Don't swap, but trigger events -->
```

### Triggers
```html
hx-trigger="click"                    <!-- On click -->
hx-trigger="load"                     <!-- On load -->
hx-trigger="change"                   <!-- On input change -->
hx-trigger="keyup changed delay:500ms" <!-- Debounced input -->
hx-trigger="every 2s"                 <!-- Polling -->
hx-trigger="click from:button"        <!-- Event delegation -->
hx-trigger="revealed"                 <!-- When scrolled into view -->
```

## Web Component Patterns

### Basic Component
```typescript
import { LitElement, html, css } from 'lit';

export class MyComponent extends LitElement {
  static properties = {
    value: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`<div>${this.value}</div>`;
  }
}

customElements.define('my-component', MyComponent);
```

### Component with Events
```typescript
private handleClick(): void {
  this.dispatchEvent(new CustomEvent('my-event', {
    detail: { data: 'value' },
    bubbles: true,
    composed: true,  // Cross shadow DOM boundary
  }));
}
```

### Using Slots
```typescript
render() {
  return html`
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot></slot>  <!-- Default slot -->
    </div>
  `;
}
```

## Hugo Shortcodes

### Using Components in Markdown
```markdown
{{</* interactive-card title="My Title" expanded="true" */>}}
Content goes here...
{{</* /interactive-card */>}}

{{</* hello-card name="World" */>}}

{{</* htmx-search */>}}
```

### Creating New Shortcodes
```html
<!-- layouts/shortcodes/my-shortcode.html -->
{{- $param := .Get "param" | default "default" -}}
<my-component param="{{ $param }}">
  {{- .Inner | markdownify -}}
</my-component>
```

## HTMX + Components Integration

### Pattern: Component in HTMX Response
```html
<!-- Server returns this HTML fragment -->
<div id="content">
  <interactive-card title="Dynamic Content">
    <p>This component hydrates automatically!</p>
  </interactive-card>
</div>
```

### Pattern: HTMX Trigger from Component
```html
<my-component hx-trigger="custom-event" 
              hx-get="/endpoint"
              hx-target="#result">
</my-component>
```

```typescript
// In component
this.dispatchEvent(new CustomEvent('custom-event'));
```

### Pattern: Update Component from HTMX
```html
<button hx-get="/api/data" 
        hx-on:htmx:afterSwap="updateComponent(event)">
  Fetch Data
</button>

<my-component id="my-comp"></my-component>

<script>
  function updateComponent(event) {
    const data = JSON.parse(event.detail.xhr.response);
    document.getElementById('my-comp').setAttribute('data', data);
  }
</script>
```

## HTMX Events

### Listening to HTMX Events
```javascript
// In your component or page
document.body.addEventListener('htmx:beforeSwap', (e) => {
  console.log('About to swap', e.detail);
});

document.body.addEventListener('htmx:afterSwap', (e) => {
  console.log('Swapped', e.detail);
});

document.body.addEventListener('htmx:load', (e) => {
  console.log('Content loaded', e.detail.elt);
});
```

### Common HTMX Events
- `htmx:beforeRequest` - Before AJAX request
- `htmx:afterRequest` - After AJAX request
- `htmx:beforeSwap` - Before content swap
- `htmx:afterSwap` - After content swap
- `htmx:load` - After content loaded into DOM
- `htmx:responseError` - On response error

## Hugo Partials for HTMX

### Creating Fragment Partials
```html
<!-- layouts/partials/fragments/my-fragment.html -->
<div id="fragment-container">
  {{- range .Items -}}
    <interactive-card title="{{ .Title }}">
      {{ .Content }}
    </interactive-card>
  {{- end -}}
  
  {{- if .HasMore -}}
    <button hx-get="{{ .NextURL }}" 
            hx-target="#fragment-container"
            hx-swap="outerHTML">
      Load More
    </button>
  {{- end -}}
</div>
```

### Using Fragment Partials
```html
<!-- In a layout or page -->
{{ partial "fragments/my-fragment.html" . }}
```

## Common Recipes

### Recipe: Infinite Scroll
```html
<div id="posts">
  {{- range .Paginator.Pages -}}
    <article>{{ .Title }}</article>
  {{- end -}}
  
  {{- if .Paginator.HasNext -}}
    <div hx-get="{{ .Paginator.Next.URL }}"
         hx-trigger="revealed"
         hx-swap="afterend">
      <span class="loading">Loading...</span>
    </div>
  {{- end -}}
</div>
```

### Recipe: Inline Edit
```html
<div id="content-{{ .ID }}">
  <p>{{ .Content }}</p>
  <button hx-get="/edit/{{ .ID }}"
          hx-target="#content-{{ .ID }}"
          hx-swap="outerHTML">
    Edit
  </button>
</div>
```

### Recipe: Form with Validation
```html
<form hx-post="/api/submit"
      hx-target="#form-result"
      hx-swap="innerHTML">
  <input type="text" name="name" required />
  <rich-editor name="content"></rich-editor>
  <button type="submit">Submit</button>
</form>

<div id="form-result"></div>
```

### Recipe: Modal/Dialog
```html
<button hx-get="/modal/content"
        hx-target="#modal-container"
        hx-swap="innerHTML">
  Open Modal
</button>

<dialog-component id="modal-container"></dialog-component>
```

### Recipe: Live Search
```html
<input type="search"
       name="q"
       hx-get="/search"
       hx-trigger="keyup changed delay:500ms"
       hx-target="#search-results"
       hx-indicator="#search-spinner" />

<div id="search-spinner" class="htmx-indicator">🔄</div>
<div id="search-results"></div>
```

## Debugging

### Enable HTMX Logging
```javascript
htmx.logAll(); // In browser console
```

### Check Component Registration
```javascript
console.log(customElements.get('my-component'));
```

### Monitor All Events
```javascript
// HTMX events
document.body.addEventListener('htmx:*', console.log);

// Component events
document.addEventListener('components:initialized', console.log);
```

## TypeScript Types for HTMX (Optional)

```typescript
// Add to your types file
declare global {
  interface Window {
    htmx: {
      logAll(): void;
      ajax(verb: string, path: string, target: string | Element): void;
      find(selector: string): Element | null;
      findAll(selector: string): NodeList;
      trigger(element: Element, name: string, detail?: any): boolean;
    };
  }
}
```

## Performance Tips

✅ Use `hx-boost="true"` on links for progressive enhancement  
✅ Add `hx-indicator` for loading states  
✅ Use `hx-sync` to prevent concurrent requests  
✅ Debounce inputs with `delay:500ms`  
✅ Cache fragments on server side  
✅ Lazy-load components with dynamic imports  
✅ Use `hx-preserve="true"` to keep elements across swaps  

## Resources

- 📚 [Full Architecture Guide](./htmx-web-components-architecture.md)
- 🔗 [HTMX Docs](https://htmx.org/docs/)
- 🔗 [Lit Docs](https://lit.dev/)
- 📁 Example components: `assets/ts/components/`
- 📁 Example fragments: `layouts/partials/fragments/`

