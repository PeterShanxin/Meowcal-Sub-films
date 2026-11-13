"""Serve the local review files with explicit UTF-8 text headers."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class ReviewHandler(SimpleHTTPRequestHandler):
    def guess_type(self, path):
        if Path(path).suffix.lower() in {'.md', '.txt'}:
            return 'text/plain; charset=utf-8'
        mime = super().guess_type(path)
        return mime + '; charset=utf-8' if mime.startswith('text/') else mime


if __name__ == '__main__':
    handler = partial(ReviewHandler, directory=str(Path(__file__).resolve().parent))
    with ThreadingHTTPServer(('127.0.0.1', 3213), handler) as server:
        print('Review: http://127.0.0.1:3213/out/review.html', flush=True)
        server.serve_forever()
