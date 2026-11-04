import re, sys
# Word-style 字数: each CJK char / full-width punct = 1, each Latin/Vietnamese word or number = 1. Markdown symbols ignored.
cjk = re.compile(r'[㐀-鿿豈-﫿]')
fw = re.compile(r'[　-〿＀-￯—…“”‘’·]')
word = re.compile(r'[A-Za-z0-9À-ɏḀ-ỿ]+')
for p in sys.argv[1:]:
    t = open(p, encoding='utf-8').read()
    n_cjk = len(cjk.findall(t)); n_fw = len(fw.findall(t)); n_w = len(word.findall(t))
    print(f"{p.split('/')[-1]}: total={n_cjk+n_fw+n_w}  (cjk={n_cjk}, punct={n_fw}, words={n_w})")
