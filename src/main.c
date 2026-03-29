#include <webview/webview.h>
#include <stddef.h>

extern unsigned char build_bundle_html[];

static void wasik_exit(const char *a, const char *b, void *data) {
    (void)a; (void)b;   
    webview_terminate((webview_t)data);
}

int main(void) {
    webview_t w = webview_create(1, NULL);

    webview_set_title(w, "Wasik");
    void *window = webview_get_window(w); gtk_window_fullscreen(GTK_WINDOW(window));
    webview_bind(w, "exit", wasik_exit, w);
    webview_set_html(w, (const char *)build_bundle_html);

    webview_run(w);
    webview_destroy(w);
    return 0;
}
