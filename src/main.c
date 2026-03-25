#include <webview/webview.h>
#include <stddef.h>
#include "bundle.h"

int main(void) {
    webview_t w = webview_create(1, NULL);

    webview_set_title(w, "Basic Example");
    webview_set_size(w, 800, 600, WEBVIEW_HINT_NONE);
    webview_set_html(w, html);

    webview_run(w);
    webview_destroy(w);
    return 0;
}
