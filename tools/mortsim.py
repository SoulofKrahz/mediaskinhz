# Intérprete mínimo del subconjunto de MortScript que usa Mediaskinhz, sobre un sistema de archivos simulado.
import re, os, shutil, sys, time
TOK = re.compile(r'\s*(?:(?P<s>"[^"]*")|(?P<n>\d+)|(?P<id>[A-Za-z_]\w*)|(?P<op><>|>=|<=|[()&\\,+\->=<]))')
def lex(t):
    out, i = [], 0
    t = t.rstrip()
    while i < len(t):
        m = TOK.match(t, i)
        if not m or m.end() == i:
            if t[i:].strip() == '': break
            raise SyntaxError('no entiendo: ' + t[i:])
        k = m.lastgroup; v = m.group(k); out.append((k, v)); i = m.end()
    return out
class FS:
    def __init__(s, root, fail=()): s.root = root; s.fail = {f.lower() for f in fail}; s.msgs = []; s.answers = []; s.ran = []
    def real(s, p):
        assert p.startswith('\\'), p
        parts = [x for x in p.split('\\') if x]
        cur = s.root
        for x in parts:  # sin distinguir mayúsculas, como Windows CE
            if os.path.isdir(cur):
                hit = [e for e in os.listdir(cur) if e.lower() == x.lower()]
                cur = os.path.join(cur, hit[0] if hit else x)
            else: cur = os.path.join(cur, x)
        return cur
def pj(a, b): return a.rstrip('\\') + '\\' + b.lstrip('\\')
class Run:
    def __init__(s, fs, script_path): s.fs = fs; s.v = {'ST_MESSAGE': 'ST_MESSAGE', 'ST_LIST': 'ST_LIST', 'ST_HIDDEN': 'ST_HIDDEN'}; s.sp = script_path
    def call(s, f, a):
        f = f.lower(); F = s.fs
        if f == 'systempath': return s.sp
        if f == 'errorlevel': return 0
        if f == 'direxists': return int(os.path.isdir(F.real(a[0])))
        if f == 'fileexists': return int(os.path.isfile(F.real(a[0])))
        if f == 'filesize':
            r = F.real(a[0]); return os.path.getsize(r) if os.path.isfile(r) else -1
        if f == 'mkdir':
            r = F.real(a[0]);
            if os.path.isdir(os.path.dirname(r)) and not os.path.exists(r): os.mkdir(r)
            return 0
        if f == 'copy':
            src, dst = F.real(a[0]), F.real(a[1]); ow = len(a) > 2 and a[2]
            if not os.path.isfile(src) or not os.path.isdir(os.path.dirname(dst)): return 0
            if os.path.exists(dst) and not ow: return 0
            if a[0].lower() in F.fail:  # simula una copia cortada
                open(dst, 'wb').write(open(src, 'rb').read()[:10]); return 0
            shutil.copyfile(src, dst); return 1
        if f == 'delete':
            r = F.real(a[0]);
            if os.path.isfile(r): os.remove(r)
            return 0
        if f == 'writefile':
            r = F.real(a[0]); 
            if not os.path.isdir(os.path.dirname(r)): return 0
            open(r, 'a' if len(a) > 2 and a[2] else 'w', encoding='cp1252').write(a[1].replace('^NL^', '\n')); return 0
        if f == 'formattime': return ''.join(time.strftime({'d':'%d','m':'%m','Y':'%Y','H':'%H','i':'%M','s':'%S'}[c]) if c in 'dmYHis' else c for c in a[0])
        if f == 'message': F.msgs.append(a[0].replace('^NL^', ' | ')); return 0
        if f == 'question':
            assert a[2] == 'YesNo'; F.msgs.append('? ' + a[0].replace('^NL^', ' | ')); return F.answers.pop(0) if F.answers else 1
        if f == 'run': F.ran.append(a[0]); return 0
        if f == 'runwait':  # otro MortScript: se ejecuta el script hijo con su propia carpeta
            F.ran.append(a[0] + (' ' + a[1] if len(a) > 1 else ''))
            if len(a) > 1 and a[1].lower().endswith('.mscr') and os.path.isfile(F.real(a[1])):
                child = Run(F, a[1].rsplit('\\', 1)[0]); child.run(open(F.real(a[1]), encoding='cp1252').read())
            return 0
        if f in ('kill', 'close', 'sleep'): F.ran.append(f + ' ' + (str(a[0]) if a else '')); return 0
        if f == 'activewindow': return 'ventana'
        if f in ('statustype', 'statusinfo'): F.ran.append(f + ' ' + ' | '.join(map(str, a))); return 0
        if f == 'statusmessage': F.status = getattr(F, 'status', []) + [a[0].replace('^NL^', ' ')]; return 0
        if f == 'choice':
            F.msgs.append('[elige] ' + str(a[0]) + ' :: ' + ' / '.join(map(str, a[4:]))); ch = getattr(F, 'choices', None); return ch.pop(0) if ch else 1
        if f == 'readfile':
            r = F.real(a[0]); return open(r, encoding='cp1252').read() if os.path.isfile(r) else ''
        if f == 'xcopy':
            src = a[0]; d = F.real(a[1]); base = src.rsplit('\\', 1)[0]; rec = len(a) > 3 and a[3]; r0 = F.real(base)
            if not os.path.isdir(r0): return 0
            for dp, dn, fn in os.walk(r0):
                rel = os.path.relpath(dp, r0)
                if rel != '.' and not rec: continue
                td = d if rel == '.' else os.path.join(d, rel); os.makedirs(td, exist_ok=True)
                for f2 in fn: shutil.copyfile(os.path.join(dp, f2), os.path.join(td, f2))
            return 1
        if f in ('freediskspace', 'totaldiskspace', 'freememory', 'totalmemory', 'screenwidth', 'screenheight'): return 123456
        if f in ('systemversion', 'platform', 'getversion'): return 'CE6'
        if f == 'regreadstring': return ''
        if f == 'bigmessage': F.msgs.append('[grande] ' + a[0].replace('^NL^', ' | ')); return 0
        raise NameError('función desconocida ' + f)
    # expresiones: or > and > not > comparación > + - & \ > átomo
    def expr(s, t):
        s.t, s.i = t, 0; v = s.or_()
        assert s.i == len(t), ('sobra', t[s.i:]); return v
    def or_(s):
        a = s.and_()
        while s.pk()[0] == 'id' and s.pk()[1].lower() == 'or': s.nx(); b = s.and_(); a = int(bool(a) or bool(b))
        return a
    def and_(s):
        a = s.cmp_()
        while s.pk()[0] == 'id' and s.pk()[1].lower() == 'and': s.nx(); b = s.cmp_(); a = int(bool(a) and bool(b))
        return a
    def pk(s): return s.t[s.i] if s.i < len(s.t) else (None, None)
    def nx(s): x = s.t[s.i]; s.i += 1; return x
    def cmp_(s):
        if s.pk() == ('id', 'not') or s.pk()[1] and s.pk()[1].lower() == 'not' and s.pk()[0] == 'id':
            s.nx(); return int(not s.cmp_())
        a = s.add()
        k, v = s.pk()
        if v in ('<>', '>', '<', '=', '>=', '<='):
            s.nx(); b = s.add()
            return int({'<>': a != b, '>': a > b, '<': a < b, '=': a == b, '>=': a >= b, '<=': a <= b}[v])
        return a
    def add(s):
        a = s.atom()
        while s.pk()[1] in ('+', '-', '&', '\\'):
            op = s.nx()[1]; b = s.atom()
            a = a + b if op == '+' else a - b if op == '-' else (str(a) + str(b)) if op == '&' else pj(str(a), str(b))
        return a
    def atom(s):
        k, v = s.nx()
        if k == 's': return v[1:-1]
        if k == 'n': return int(v)
        if v == '(':
            x = s.or_(); assert s.nx()[1] == ')'; return x
        if k == 'id':
            if s.pk()[1] == '(':
                s.nx(); args = []
                if s.pk()[1] != ')':
                    while True:
                        args.append(s.or_())
                        if s.pk()[1] == ',': s.nx(); continue
                        break
                assert s.nx()[1] == ')', 'falta )'
                return s.call(v, args)
            if v not in s.v: raise NameError('variable sin valor: ' + v)
            return s.v[v]
        raise SyntaxError('inesperado ' + v)
    def run(s, text):
        L = [l.strip() for l in text.splitlines()]
        # bloques: If/Else/EndIf y While/EndWhile, emparejados de antemano
        st, match, els = [], {}, {}
        for n, l in enumerate(L):
            w = l.split('(')[0].split(' ')[0].lower() if l else ''
            if w in ('if', 'while'): st.append((w, n))
            elif w == 'else': els[st[-1][1]] = n
            elif w in ('endif', 'endwhile'):
                k, o = st.pop(); assert (k == 'if') == (w == 'endif'), 'bloques cruzados en ' + str(n); match[o] = n; match[n] = o
        assert not st, 'bloques sin cerrar'
        pc, guard = 0, 0
        while pc < len(L):
            guard += 1; assert guard < 200000, 'bucle infinito'
            l = L[pc]; low = l.lower()
            if not l or l.startswith('#'): pc += 1; continue
            m = re.match(r'(?i)(if|while)\s*\((.*)\)\s*$', l)
            if m:
                c = bool(s.expr(lex(m.group(2))))
                if c: pc += 1
                elif m.group(1).lower() == 'if' and pc in els: pc = els[pc] + 1
                else: pc = match[pc] + 1
                continue
            if low == 'else':  # fin de la rama verdadera: saltar al EndIf
                o = [k for k, v in els.items() if v == pc][0]; pc = match[o] + 1; continue
            if low == 'endif': pc += 1; continue
            if low == 'endwhile': pc = match[pc]; continue
            if low == 'exit': return 'exit'
            m = re.match(r'([A-Za-z_]\w*)\s*=\s*(.*)$', l)
            if m and not low.startswith(('if', 'copy', 'message')) and '(' not in m.group(1):
                s.v[m.group(1)] = s.expr(lex(m.group(2))); pc += 1; continue
            s.expr(lex(l)); pc += 1
        return 'fin'
