#include <webview/webview.h>
#include <stddef.h>

extern unsigned char build_bundle_html[];

int main(void) {
    webview_t w = webview_create(1, NULL);

    webview_set_title(w, "Basic Example");
    void *window = webview_get_window(w); gtk_window_fullscreen(GTK_WINDOW(window));
    webview_set_html(w, (const char *)build_bundle_html);
    webview_run(w);
    webview_destroy(w);
    return 0;
}
