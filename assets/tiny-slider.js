/* eslint-disable */
// prettier-ignore
var tns = (function () {
  Object.keys ||
    (Object.keys = function (t) {
      var e = [];
      for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.push(n);
      return e;
    }),
    "remove" in Element.prototype ||
      (Element.prototype.remove = function () {
        this.parentNode && this.parentNode.removeChild(this);
      });
  var t = window,
    Oi =
      t.requestAnimationFrame ||
      t.webkitRequestAnimationFrame ||
      t.mozRequestAnimationFrame ||
      t.msRequestAnimationFrame ||
      function (t) {
        return setTimeout(t, 16);
      },
    e = window,
    Di =
      e.cancelAnimationFrame ||
      e.mozCancelAnimationFrame ||
      function (t) {
        clearTimeout(t);
      };
  function Hi() {
    for (
      var t, e, n, i = arguments[0] || {}, a = 1, r = arguments.length;
      a < r;
      a++
    )
      if (null !== (t = arguments[a]))
        for (e in t) i !== (n = t[e]) && void 0 !== n && (i[e] = n);
    return i;
  }
  function ki(t) {
    return 0 <= ["true", "false"].indexOf(t) ? JSON.parse(t) : t;
  }
  function Ri(t, e, n, i) {
    if (i)
      try {
        t.setItem(e, n);
      } catch (t) {}
    return n;
  }
  function Ii() {
    var t = document,
      e = t.body;
    return e || ((e = t.createElement("body")).fake = !0), e;
  }
  var n = document.documentElement;
  function Pi(t) {
    var e = "";
    return (
      t.fake &&
        ((e = n.style.overflow),
        (t.style.background = ""),
        (t.style.overflow = n.style.overflow = "hidden"),
        n.appendChild(t)),
      e
    );
  }
  function zi(t, e) {
    t.fake && (t.remove(), (n.style.overflow = e), n.offsetHeight);
  }
  function Wi(t, e, n, i) {
    "insertRule" in t ? t.insertRule(e + "{" + n + "}", i) : t.addRule(e, n, i);
  }
  function Fi(t) {
    return ("insertRule" in t ? t.cssRules : t.rules).length;
  }
  function qi(t, e, n) {
    for (var i = 0, a = t.length; i < a; i++) e.call(n, t[i], i);
  }
  var i = "classList" in document.createElement("_"),
    ji = i
      ? function (t, e) {
          return t.classList.contains(e);
        }
      : function (t, e) {
          return 0 <= t.className.indexOf(e);
        },
    Vi = i
      ? function (t, e) {
          ji(t, e) || t.classList.add(e);
        }
      : function (t, e) {
          ji(t, e) || (t.className += " " + e);
        },
    Gi = i
      ? function (t, e) {
          ji(t, e) && t.classList.remove(e);
        }
      : function (t, e) {
          ji(t, e) && (t.className = t.className.replace(e, ""));
        };
  function Qi(t, e) {
    return t.hasAttribute(e);
  }
  function Xi(t, e) {
    return t.getAttribute(e);
  }
  function r(t) {
    return void 0 !== t.item;
  }
  function Yi(t, e) {
    if (
      ((t = r(t) || t instanceof Array ? t : [t]),
      "[object Object]" === Object.prototype.toString.call(e))
    )
      for (var n = t.length; n--; ) for (var i in e) t[n].setAttribute(i, e[i]);
  }
  function Ki(t, e) {
    t = r(t) || t instanceof Array ? t : [t];
    for (var n = (e = e instanceof Array ? e : [e]).length, i = t.length; i--; )
      for (var a = n; a--; ) t[i].removeAttribute(e[a]);
  }
  function Ji(t) {
    for (var e = [], n = 0, i = t.length; n < i; n++) e.push(t[n]);
    return e;
  }
  function Ui(t, e) {
    "none" !== t.style.display && (t.style.display = "none");
  }
  function _i(t, e) {
    "none" === t.style.display && (t.style.display = "");
  }
  function Zi(t) {
    return "none" !== window.getComputedStyle(t).display;
  }
  function $i(e) {
    if ("string" == typeof e) {
      var n = [e],
        i = e.charAt(0).toUpperCase() + e.substr(1);
      ["Webkit", "Moz", "ms", "O"].forEach(function (t) {
        ("ms" === t && "transform" !== e) || n.push(t + i);
      }),
        (e = n);
    }
    for (
      var t = document.createElement("fakeelement"), a = (e.length, 0);
      a < e.length;
      a++
    ) {
      var r = e[a];
      if (void 0 !== t.style[r]) return r;
    }
    return !1;
  }
  function ta(t, e) {
    var n = !1;
    return (
      /^Webkit/.test(t)
        ? (n = "webkit" + e + "End")
        : /^O/.test(t)
        ? (n = "o" + e + "End")
        : t && (n = e.toLowerCase() + "end"),
      n
    );
  }
  var a = !1;
  try {
    var o = Object.defineProperty({}, "passive", {
      get: function () {
        a = !0;
      },
    });
    window.addEventListener("test", null, o);
  } catch (t) {}
  var u = !!a && { passive: !0 };
  function ea(t, e, n) {
    for (var i in e) {
      var a = 0 <= ["touchstart", "touchmove"].indexOf(i) && !n && u;
      t.addEventListener(i, e[i], a);
    }
  }
  function na(t, e) {
    for (var n in e) {
      var i = 0 <= ["touchstart", "touchmove"].indexOf(n) && u;
      t.removeEventListener(n, e[n], i);
    }
  }
  function ia() {
    return {
      topics: {},
      on: function (t, e) {
        (this.topics[t] = this.topics[t] || []), this.topics[t].push(e);
      },
      off: function (t, e) {
        if (this.topics[t])
          for (var n = 0; n < this.topics[t].length; n++)
            if (this.topics[t][n] === e) {
              this.topics[t].splice(n, 1);
              break;
            }
      },
      emit: function (e, n) {
        (n.type = e),
          this.topics[e] &&
            this.topics[e].forEach(function (t) {
              t(n, e);
            });
      },
    };
  }
  var aa = function (O) {
    O = Hi(
      {
        container: ".slider",
        mode: "carousel",
        axis: "horizontal",
        items: 1,
        gutter: 0,
        edgePadding: 0,
        fixedWidth: !1,
        autoWidth: !1,
        viewportMax: !1,
        slideBy: 1,
        center: !1,
        controls: !0,
        controlsPosition: "top",
        controlsText: ["prev", "next"],
        controlsContainer: !1,
        prevButton: !1,
        nextButton: !1,
        nav: !0,
        navPosition: "top",
        navContainer: !1,
        navAsThumbnails: !1,
        arrowKeys: !1,
        speed: 300,
        autoplay: !1,
        autoplayPosition: "top",
        autoplayTimeout: 5e3,
        autoplayDirection: "forward",
        autoplayText: ["start", "stop"],
        autoplayHoverPause: !1,
        autoplayButton: !1,
        autoplayButtonOutput: !0,
        autoplayResetOnVisibility: !0,
        animateIn: "tns-fadeIn",
        animateOut: "tns-fadeOut",
        animateNormal: "tns-normal",
        animateDelay: !1,
        loop: !0,
        rewind: !1,
        autoHeight: !1,
        responsive: !1,
        lazyload: !1,
        lazyloadSelector: ".tns-lazy-img",
        touch: !0,
        mouseDrag: !1,
        swipeAngle: 15,
        nested: !1,
        preventActionWhenRunning: !1,
        preventScrollOnTouch: !1,
        freezable: !0,
        onInit: !1,
        useLocalStorage: !0,
      },
      O || {}
    );
    var D = document,
      h = window,
      a = { ENTER: 13, SPACE: 32, LEFT: 37, RIGHT: 39 },
      e = {},
      n = O.useLocalStorage;
    if (n) {
      var t = navigator.userAgent,
        i = new Date();
      try {
        (e = h.localStorage)
          ? (e.setItem(i, i), (n = e.getItem(i) == i), e.removeItem(i))
          : (n = !1),
          n || (e = {});
      } catch (t) {
        n = !1;
      }
      n &&
        (e.tnsApp &&
          e.tnsApp !== t &&
          [
            "tC",
            "tPL",
            "tMQ",
            "tTf",
            "t3D",
            "tTDu",
            "tTDe",
            "tADu",
            "tADe",
            "tTE",
            "tAE",
          ].forEach(function (t) {
            e.removeItem(t);
          }),
        (localStorage.tnsApp = t));
    }
    var r,
      o,
      u,
      l,
      s,
      c,
      f,
      y = e.tC
        ? ki(e.tC)
        : Ri(
            e,
            "tC",
            (function () {
              var t = document,
                e = Ii(),
                n = Pi(e),
                i = t.createElement("div"),
                a = !1;
              e.appendChild(i);
              try {
                for (
                  var r,
                    o = "(10px * 10)",
                    u = ["calc" + o, "-moz-calc" + o, "-webkit-calc" + o],
                    l = 0;
                  l < 3;
                  l++
                )
                  if (
                    ((r = u[l]), (i.style.width = r), 100 === i.offsetWidth)
                  ) {
                    a = r.replace(o, "");
                    break;
                  }
              } catch (t) {}
              return e.fake ? zi(e, n) : i.remove(), a;
            })(),
            n
          ),
      g = e.tPL
        ? ki(e.tPL)
        : Ri(
            e,
            "tPL",
            (function () {
              var t,
                e = document,
                n = Ii(),
                i = Pi(n),
                a = e.createElement("div"),
                r = e.createElement("div"),
                o = "";
              (a.className = "tns-t-subp2"), (r.className = "tns-t-ct");
              for (var u = 0; u < 70; u++) o += "<div></div>";
              return (
                (r.innerHTML = o),
                a.appendChild(r),
                n.appendChild(a),
                (t =
                  Math.abs(
                    a.getBoundingClientRect().left -
                      r.children[67].getBoundingClientRect().left
                  ) < 2),
                n.fake ? zi(n, i) : a.remove(),
                t
              );
            })(),
            n
          ),
      H = e.tMQ
        ? ki(e.tMQ)
        : Ri(
            e,
            "tMQ",
            ((o = document),
            (u = Ii()),
            (l = Pi(u)),
            (s = o.createElement("div")),
            (c = o.createElement("style")),
            (f =
              "@media all and (min-width:1px){.tns-mq-test{position:absolute}}"),
            (c.type = "text/css"),
            (s.className = "tns-mq-test"),
            u.appendChild(c),
            u.appendChild(s),
            c.styleSheet
              ? (c.styleSheet.cssText = f)
              : c.appendChild(o.createTextNode(f)),
            (r = window.getComputedStyle
              ? window.getComputedStyle(s).position
              : s.currentStyle.position),
            u.fake ? zi(u, l) : s.remove(),
            "absolute" === r),
            n
          ),
      d = e.tTf ? ki(e.tTf) : Ri(e, "tTf", $i("transform"), n),
      v = e.t3D
        ? ki(e.t3D)
        : Ri(
            e,
            "t3D",
            (function (t) {
              if (!t) return !1;
              if (!window.getComputedStyle) return !1;
              var e,
                n = document,
                i = Ii(),
                a = Pi(i),
                r = n.createElement("p"),
                o =
                  9 < t.length ? "-" + t.slice(0, -9).toLowerCase() + "-" : "";
              return (
                (o += "transform"),
                i.insertBefore(r, null),
                (r.style[t] = "translate3d(1px,1px,1px)"),
                (e = window.getComputedStyle(r).getPropertyValue(o)),
                i.fake ? zi(i, a) : r.remove(),
                void 0 !== e && 0 < e.length && "none" !== e
              );
            })(d),
            n
          ),
      x = e.tTDu ? ki(e.tTDu) : Ri(e, "tTDu", $i("transitionDuration"), n),
      p = e.tTDe ? ki(e.tTDe) : Ri(e, "tTDe", $i("transitionDelay"), n),
      b = e.tADu ? ki(e.tADu) : Ri(e, "tADu", $i("animationDuration"), n),
      m = e.tADe ? ki(e.tADe) : Ri(e, "tADe", $i("animationDelay"), n),
      C = e.tTE ? ki(e.tTE) : Ri(e, "tTE", ta(x, "Transition"), n),
      w = e.tAE ? ki(e.tAE) : Ri(e, "tAE", ta(b, "Animation"), n),
      M = h.console && "function" == typeof h.console.warn,
      T = [
        "container",
        "controlsContainer",
        "prevButton",
        "nextButton",
        "navContainer",
        "autoplayButton",
      ],
      E = {};
    if (
      (T.forEach(function (t) {
        if ("string" == typeof O[t]) {
          var e = O[t],
            n = D.querySelector(e);
          if (((E[t] = e), !n || !n.nodeName))
            return void (M && console.warn("Can't find", O[t]));
          O[t] = n;
        }
      }),
      !(O.container.children.length < 1))
    ) {
      var k = O.responsive,
        R = O.nested,
        I = "carousel" === O.mode;
      if (k) {
        0 in k && ((O = Hi(O, k[0])), delete k[0]);
        var A = {};
        for (var N in k) {
          var L = k[N];
          (L = "number" == typeof L ? { items: L } : L), (A[N] = L);
        }
        (k = A), (A = null);
      }
      if (
        (I ||
          (function t(e) {
            for (var n in e)
              I ||
                ("slideBy" === n && (e[n] = "page"),
                "edgePadding" === n && (e[n] = !1),
                "autoHeight" === n && (e[n] = !1)),
                "responsive" === n && t(e[n]);
          })(O),
        !I)
      ) {
        (O.axis = "horizontal"), (O.slideBy = "page"), (O.edgePadding = !1);
        var P = O.animateIn,
          z = O.animateOut,
          B = O.animateDelay,
          W = O.animateNormal;
      }
      var S,
        F,
        q = "horizontal" === O.axis,
        j = D.createElement("div"),
        V = D.createElement("div"),
        G = O.container,
        Q = G.parentNode,
        X = G.outerHTML,
        Y = G.children,
        K = Y.length,
        J = sn(),
        U = !1;
      k && Bn(), I && (G.className += " tns-vpfix");
      var _,
        Z,
        $,
        tt,
        et,
        nt,
        it,
        at,
        rt = O.autoWidth,
        ot = vn("fixedWidth"),
        ut = vn("edgePadding"),
        lt = vn("gutter"),
        st = fn(),
        ct = vn("center"),
        ft = rt ? 1 : Math.floor(vn("items")),
        dt = vn("slideBy"),
        vt = O.viewportMax || O.fixedWidthViewportWidth,
        pt = vn("arrowKeys"),
        mt = vn("speed"),
        ht = O.rewind,
        yt = !ht && O.loop,
        gt = vn("autoHeight"),
        xt = vn("controls"),
        bt = vn("controlsText"),
        Ct = vn("nav"),
        wt = vn("touch"),
        Mt = vn("mouseDrag"),
        Tt = vn("autoplay"),
        Et = vn("autoplayTimeout"),
        At = vn("autoplayText"),
        Nt = vn("autoplayHoverPause"),
        Lt = vn("autoplayResetOnVisibility"),
        Bt =
          ((at = document.createElement("style")),
          it && at.setAttribute("media", it),
          document.querySelector("head").appendChild(at),
          at.sheet ? at.sheet : at.styleSheet),
        St = O.lazyload,
        Ot = (O.lazyloadSelector, []),
        Dt = yt
          ? ((et = (function () {
              {
                if (rt || (ot && !vt)) return K - 1;
                var t = ot ? "fixedWidth" : "items",
                  e = [];
                if (((ot || O[t] < K) && e.push(O[t]), k))
                  for (var n in k) {
                    var i = k[n][t];
                    i && (ot || i < K) && e.push(i);
                  }
                return (
                  e.length || e.push(0),
                  Math.ceil(
                    ot ? vt / Math.min.apply(null, e) : Math.max.apply(null, e)
                  )
                );
              }
            })()),
            (nt = I ? Math.ceil((5 * et - K) / 2) : 4 * et - K),
            (nt = Math.max(et, nt)),
            dn("edgePadding") ? nt + 1 : nt)
          : 0,
        Ht = I ? K + 2 * Dt : K + Dt,
        kt = !((!ot && !rt) || yt),
        Rt = ot ? ni() : null,
        It = !I || !yt,
        Pt = q ? "left" : "top",
        zt = "",
        Wt = "",
        Ft = ot
          ? function () {
              return ct && !yt ? K - 1 : Math.ceil(-Rt / (ot + lt));
            }
          : rt
          ? function () {
              for (var t = Ht; t--; ) if (_[t] >= -Rt) return t;
            }
          : function () {
              return ct && I && !yt
                ? K - 1
                : yt || I
                ? Math.max(0, Ht - Math.ceil(ft))
                : Ht - 1;
            },
        qt = on(vn("startIndex")),
        jt = qt,
        Vt = (rn(), 0),
        Gt = rt ? null : Ft(),
        Qt = O.preventActionWhenRunning,
        Xt = O.swipeAngle,
        Yt = !Xt || "?",
        Kt = !1,
        Jt = O.onInit,
        Ut = new ia(),
        _t = " tns-slider tns-" + O.mode,
        Zt =
          G.id ||
          ((tt = window.tnsId),
          (window.tnsId = tt ? tt + 1 : 1),
          "tns" + window.tnsId),
        $t = vn("disable"),
        te = !1,
        ee = O.freezable,
        ne = !(!ee || rt) && Ln(),
        ie = !1,
        ae = {
          click: fi,
          keydown: function (t) {
            t = xi(t);
            var e = [a.LEFT, a.RIGHT].indexOf(t.keyCode);
            0 <= e &&
              (0 === e ? Ee.disabled || fi(t, -1) : Ae.disabled || fi(t, 1));
          },
        },
        re = {
          click: function (t) {
            if (Kt) {
              if (Qt) return;
              si();
            }
            var e = bi((t = xi(t)));
            for (; e !== Se && !Qi(e, "data-nav"); ) e = e.parentNode;
            if (Qi(e, "data-nav")) {
              var n = (ke = Number(Xi(e, "data-nav"))),
                i = ot || rt ? (n * K) / De : n * ft,
                a = ve ? n : Math.min(Math.ceil(i), K - 1);
              ci(a, t), Re === n && (qe && hi(), (ke = -1));
            }
          },
          keydown: function (t) {
            t = xi(t);
            var e = D.activeElement;
            if (!Qi(e, "data-nav")) return;
            var n = [a.LEFT, a.RIGHT, a.ENTER, a.SPACE].indexOf(t.keyCode),
              i = Number(Xi(e, "data-nav"));
            0 <= n &&
              (0 === n
                ? 0 < i && gi(Be[i - 1])
                : 1 === n
                ? i < De - 1 && gi(Be[i + 1])
                : ci((ke = i), t));
          },
        },
        oe = {
          mouseover: function () {
            qe && (vi(), (je = !0));
          },
          mouseout: function () {
            je && (di(), (je = !1));
          },
        },
        ue = {
          visibilitychange: function () {
            D.hidden ? qe && (vi(), (Ge = !0)) : Ge && (di(), (Ge = !1));
          },
        },
        le = {
          keydown: function (t) {
            t = xi(t);
            var e = [a.LEFT, a.RIGHT].indexOf(t.keyCode);
            0 <= e && fi(t, 0 === e ? -1 : 1);
          },
        },
        se = { touchstart: Ti, touchmove: Ei, touchend: Ai, touchcancel: Ai },
        ce = { mousedown: Ti, mousemove: Ei, mouseup: Ai, mouseleave: Ai },
        fe = dn("controls"),
        de = dn("nav"),
        ve = !!rt || O.navAsThumbnails,
        pe = dn("autoplay"),
        me = dn("touch"),
        he = dn("mouseDrag"),
        ye = "tns-slide-active",
        ge = "tns-complete",
        xe = {
          load: function (t) {
            zn(bi(t));
          },
          error: function (t) {
            (e = bi(t)), Vi(e, "failed"), Wn(e);
            var e;
          },
        },
        be = "force" === O.preventScrollOnTouch;
      if (fe)
        var Ce,
          we,
          Me = O.controlsContainer,
          Te = O.controlsContainer ? O.controlsContainer.outerHTML : "",
          Ee = O.prevButton,
          Ae = O.nextButton,
          Ne = O.prevButton ? O.prevButton.outerHTML : "",
          Le = O.nextButton ? O.nextButton.outerHTML : "";
      if (de)
        var Be,
          Se = O.navContainer,
          Oe = O.navContainer ? O.navContainer.outerHTML : "",
          De = rt ? K : Li(),
          He = 0,
          ke = -1,
          Re = ln(),
          Ie = Re,
          Pe = "tns-nav-active",
          ze = "Carousel Page ",
          We = " (Current Slide)";
      if (pe)
        var Fe,
          qe,
          je,
          Ve,
          Ge,
          Qe = "forward" === O.autoplayDirection ? 1 : -1,
          Xe = O.autoplayButton,
          Ye = O.autoplayButton ? O.autoplayButton.outerHTML : "",
          Ke = ["<span class='tns-visually-hidden'>", " animation</span>"];
      if (me || he)
        var Je,
          Ue,
          _e = {},
          Ze = {},
          $e = !1,
          tn = q
            ? function (t, e) {
                return t.x - e.x;
              }
            : function (t, e) {
                return t.y - e.y;
              };
      rt || an($t || ne),
        d &&
          ((Pt = d),
          (zt = "translate"),
          v
            ? ((zt += q ? "3d(" : "3d(0px, "),
              (Wt = q ? ", 0px, 0px)" : ", 0px)"))
            : ((zt += q ? "X(" : "Y("), (Wt = ")"))),
        I && (G.className = G.className.replace("tns-vpfix", "")),
        (function () {
          dn("gutter");
          (j.className = "tns-outer"),
            (V.className = "tns-inner"),
            (j.id = Zt + "-ow"),
            (V.id = Zt + "-iw"),
            "" === G.id && (G.id = Zt);
          (_t += g || rt ? " tns-subpixel" : " tns-no-subpixel"),
            (_t += y ? " tns-calc" : " tns-no-calc"),
            rt && (_t += " tns-autowidth");
          (_t += " tns-" + O.axis),
            (G.className += _t),
            I
              ? (((S = D.createElement("div")).id = Zt + "-mw"),
                (S.className = "tns-ovh"),
                j.appendChild(S),
                S.appendChild(V))
              : j.appendChild(V);
          if (gt) {
            var t = S || V;
            t.className += " tns-ah";
          }
          if (
            (Q.insertBefore(j, G),
            V.appendChild(G),
            qi(Y, function (t, e) {
              Vi(t, "tns-item"),
                t.id || (t.id = Zt + "-item" + e),
                !I && W && Vi(t, W),
                Yi(t, { "aria-hidden": "true", tabindex: "-1" });
            }),
            Dt)
          ) {
            for (
              var e = D.createDocumentFragment(),
                n = D.createDocumentFragment(),
                i = Dt;
              i--;

            ) {
              var a = i % K,
                r = Y[a].cloneNode(!0);
              if ((Ki(r, "id"), n.insertBefore(r, n.firstChild), I)) {
                var o = Y[K - 1 - a].cloneNode(!0);
                Ki(o, "id"), e.appendChild(o);
              }
            }
            G.insertBefore(e, G.firstChild), G.appendChild(n), (Y = G.children);
          }
        })(),
        (function () {
          if (!I)
            for (var t = qt, e = qt + Math.min(K, ft); t < e; t++) {
              var n = Y[t];
              (n.style.left = (100 * (t - qt)) / ft + "%"), Vi(n, P), Gi(n, W);
            }
          q &&
            (g || rt
              ? (Wi(
                  Bt,
                  "#" + Zt + " > .tns-item",
                  "font-size:" + h.getComputedStyle(Y[0]).fontSize + ";",
                  Fi(Bt)
                ),
                Wi(Bt, "#" + Zt, "font-size:0;", Fi(Bt)))
              : I &&
                qi(Y, function (t, e) {
                  var n;
                  t.style.marginLeft =
                    ((n = e),
                    y
                      ? y + "(" + 100 * n + "% / " + Ht + ")"
                      : (100 * n) / Ht + "%");
                }));
          if (H) {
            if (x) {
              var i = S && O.autoHeight ? xn(O.speed) : "";
              Wi(Bt, "#" + Zt + "-mw", i, Fi(Bt));
            }
            (i = pn(
              O.edgePadding,
              O.gutter,
              O.fixedWidth,
              O.speed,
              O.autoHeight
            )),
              Wi(Bt, "#" + Zt + "-iw", i, Fi(Bt)),
              I &&
                ((i =
                  q && !rt
                    ? "width:" + mn(O.fixedWidth, O.gutter, O.items) + ";"
                    : ""),
                x && (i += xn(mt)),
                Wi(Bt, "#" + Zt, i, Fi(Bt))),
              (i = q && !rt ? hn(O.fixedWidth, O.gutter, O.items) : ""),
              O.gutter && (i += yn(O.gutter)),
              I || (x && (i += xn(mt)), b && (i += bn(mt))),
              i && Wi(Bt, "#" + Zt + " > .tns-item", i, Fi(Bt));
          } else {
            Gn(),
              (V.style.cssText = pn(ut, lt, ot, gt)),
              I && q && !rt && (G.style.width = mn(ot, lt, ft));
            var i = q && !rt ? hn(ot, lt, ft) : "";
            lt && (i += yn(lt)),
              i && Wi(Bt, "#" + Zt + " > .tns-item", i, Fi(Bt));
          }
          if (k && H)
            for (var a in k) {
              a = parseInt(a);
              var r = k[a],
                i = "",
                o = "",
                u = "",
                l = "",
                s = "",
                c = rt ? null : vn("items", a),
                f = vn("fixedWidth", a),
                d = vn("speed", a),
                v = vn("edgePadding", a),
                p = vn("autoHeight", a),
                m = vn("gutter", a);
              x &&
                S &&
                vn("autoHeight", a) &&
                "speed" in r &&
                (o = "#" + Zt + "-mw{" + xn(d) + "}"),
                ("edgePadding" in r || "gutter" in r) &&
                  (u = "#" + Zt + "-iw{" + pn(v, m, f, d, p) + "}"),
                I &&
                  q &&
                  !rt &&
                  ("fixedWidth" in r ||
                    "items" in r ||
                    (ot && "gutter" in r)) &&
                  (l = "width:" + mn(f, m, c) + ";"),
                x && "speed" in r && (l += xn(d)),
                l && (l = "#" + Zt + "{" + l + "}"),
                ("fixedWidth" in r ||
                  (ot && "gutter" in r) ||
                  (!I && "items" in r)) &&
                  (s += hn(f, m, c)),
                "gutter" in r && (s += yn(m)),
                !I && "speed" in r && (x && (s += xn(d)), b && (s += bn(d))),
                s && (s = "#" + Zt + " > .tns-item{" + s + "}"),
                (i = o + u + l + s) &&
                  Bt.insertRule(
                    "@media (min-width: " + a / 16 + "em) {" + i + "}",
                    Bt.cssRules.length
                  );
            }
        })(),
        Cn();
      var en = yt
          ? I
            ? function () {
                var t = Vt,
                  e = Gt;
                (t += dt),
                  (e -= dt),
                  ut
                    ? ((t += 1), (e -= 1))
                    : ot && (st + lt) % (ot + lt) && (e -= 1),
                  Dt && (e < qt ? (qt -= K) : qt < t && (qt += K));
              }
            : function () {
                if (Gt < qt) for (; Vt + K <= qt; ) qt -= K;
                else if (qt < Vt) for (; qt <= Gt - K; ) qt += K;
              }
          : function () {
              qt = Math.max(Vt, Math.min(Gt, qt));
            },
        nn = I
          ? function () {
              var e, n, i, a, t, r, o, u, l, s, c;
              ti(G, ""),
                x || !mt
                  ? (ri(), (mt && Zi(G)) || si())
                  : ((e = G),
                    (n = Pt),
                    (i = zt),
                    (a = Wt),
                    (t = ii()),
                    (r = mt),
                    (o = si),
                    (u = Math.min(r, 10)),
                    (l = 0 <= t.indexOf("%") ? "%" : "px"),
                    (t = t.replace(l, "")),
                    (s = Number(
                      e.style[n].replace(i, "").replace(a, "").replace(l, "")
                    )),
                    (c = ((t - s) / r) * u),
                    setTimeout(function t() {
                      (r -= u),
                        (s += c),
                        (e.style[n] = i + s + l + a),
                        0 < r ? setTimeout(t, u) : o();
                    }, u)),
                q || Ni();
            }
          : function () {
              Ot = [];
              var t = {};
              (t[C] = t[w] = si),
                na(Y[jt], t),
                ea(Y[qt], t),
                oi(jt, P, z, !0),
                oi(qt, W, P),
                (C && w && mt && Zi(G)) || si();
            };
      return {
        version: "2.9.2",
        getInfo: Si,
        events: Ut,
        goTo: ci,
        play: function () {
          Tt && !qe && (mi(), (Ve = !1));
        },
        pause: function () {
          qe && (hi(), (Ve = !0));
        },
        isOn: U,
        updateSliderHeight: Xn,
        refresh: Cn,
        destroy: function () {
          if (
            ((Bt.disabled = !0),
            Bt.ownerNode && Bt.ownerNode.remove(),
            na(h, { resize: An }),
            pt && na(D, le),
            Me && na(Me, ae),
            Se && na(Se, re),
            na(G, oe),
            na(G, ue),
            Xe && na(Xe, { click: yi }),
            Tt && clearInterval(Fe),
            I && C)
          ) {
            var t = {};
            (t[C] = si), na(G, t);
          }
          wt && na(G, se), Mt && na(G, ce);
          var r = [X, Te, Ne, Le, Oe, Ye];
          for (var e in (T.forEach(function (t, e) {
            var n = "container" === t ? j : O[t];
            if ("object" == typeof n) {
              var i = !!n.previousElementSibling && n.previousElementSibling,
                a = n.parentNode;
              (n.outerHTML = r[e]),
                (O[t] = i ? i.nextElementSibling : a.firstElementChild);
            }
          }),
          (T =
            P =
            z =
            B =
            W =
            q =
            j =
            V =
            G =
            Q =
            X =
            Y =
            K =
            F =
            J =
            rt =
            ot =
            ut =
            lt =
            st =
            ft =
            dt =
            vt =
            pt =
            mt =
            ht =
            yt =
            gt =
            Bt =
            St =
            _ =
            Ot =
            Dt =
            Ht =
            kt =
            Rt =
            It =
            Pt =
            zt =
            Wt =
            Ft =
            qt =
            jt =
            Vt =
            Gt =
            Xt =
            Yt =
            Kt =
            Jt =
            Ut =
            _t =
            Zt =
            $t =
            te =
            ee =
            ne =
            ie =
            ae =
            re =
            oe =
            ue =
            le =
            se =
            ce =
            fe =
            de =
            ve =
            pe =
            me =
            he =
            ye =
            ge =
            xe =
            Z =
            xt =
            bt =
            Me =
            Te =
            Ee =
            Ae =
            Ce =
            we =
            Ct =
            Se =
            Oe =
            Be =
            De =
            He =
            ke =
            Re =
            Ie =
            Pe =
            ze =
            We =
            Tt =
            Et =
            Qe =
            At =
            Nt =
            Xe =
            Ye =
            Lt =
            Ke =
            Fe =
            qe =
            je =
            Ve =
            Ge =
            _e =
            Ze =
            Je =
            $e =
            Ue =
            tn =
            wt =
            Mt =
              null),
          this))
            "rebuild" !== e && (this[e] = null);
          U = !1;
        },
        rebuild: function () {
          return aa(Hi(O, E));
        },
      };
    }
    function an(t) {
      t && (xt = Ct = wt = Mt = pt = Tt = Nt = Lt = !1);
    }
    function rn() {
      for (var t = I ? qt - Dt : qt; t < 0; ) t += K;
      return (t % K) + 1;
    }
    function on(t) {
      return (
        (t = t ? Math.max(0, Math.min(yt ? K - 1 : K - ft, t)) : 0),
        I ? t + Dt : t
      );
    }
    function un(t) {
      for (null == t && (t = qt), I && (t -= Dt); t < 0; ) t += K;
      return Math.floor(t % K);
    }
    function ln() {
      var t,
        e = un();
      return (
        (t = ve
          ? e
          : ot || rt
          ? Math.ceil(((e + 1) * De) / K - 1)
          : Math.floor(e / ft)),
        !yt && I && qt === Gt && (t = De - 1),
        t
      );
    }
    function sn() {
      return (
        h.innerWidth || D.documentElement.clientWidth || D.body.clientWidth
      );
    }
    function cn(t) {
      return "top" === t ? "afterbegin" : "beforeend";
    }
    function fn() {
      var t = ut ? 2 * ut - lt : 0;
      return (
        (function t(e) {
          var n,
            i,
            a = D.createElement("div");
          return (
            e.appendChild(a),
            (i = (n = a.getBoundingClientRect()).right - n.left),
            a.remove(),
            i || t(e.parentNode)
          );
        })(Q) - t
      );
    }
    function dn(t) {
      if (O[t]) return !0;
      if (k) for (var e in k) if (k[e][t]) return !0;
      return !1;
    }
    function vn(t, e) {
      if ((null == e && (e = J), "items" === t && ot))
        return Math.floor((st + lt) / (ot + lt)) || 1;
      var n = O[t];
      if (k) for (var i in k) e >= parseInt(i) && t in k[i] && (n = k[i][t]);
      return (
        "slideBy" === t && "page" === n && (n = vn("items")),
        I || ("slideBy" !== t && "items" !== t) || (n = Math.floor(n)),
        n
      );
    }
    function pn(t, e, n, i, a) {
      var r = "";
      if (void 0 !== t) {
        var o = t;
        e && (o -= e),
          (r = q
            ? "margin: 0 " + o + "px 0 " + t + "px;"
            : "margin: " + t + "px 0 " + o + "px 0;");
      } else if (e && !n) {
        var u = "-" + e + "px";
        r = "margin: 0 " + (q ? u + " 0 0" : "0 " + u + " 0") + ";";
      }
      return !I && a && x && i && (r += xn(i)), r;
    }
    function mn(t, e, n) {
      return t
        ? (t + e) * Ht + "px"
        : y
        ? y + "(" + 100 * Ht + "% / " + n + ")"
        : (100 * Ht) / n + "%";
    }
    function hn(t, e, n) {
      var i;
      if (t) i = t + e + "px";
      else {
        I || (n = Math.floor(n));
        var a = I ? Ht : n;
        i = y ? y + "(100% / " + a + ")" : 100 / a + "%";
      }
      return (i = "width:" + i), "inner" !== R ? i + ";" : i + " !important;";
    }
    function yn(t) {
      var e = "";
      !1 !== t &&
        (e =
          (q ? "padding-" : "margin-") +
          (q ? "right" : "bottom") +
          ": " +
          t +
          "px;");
      return e;
    }
    function gn(t, e) {
      var n = t.substring(0, t.length - e).toLowerCase();
      return n && (n = "-" + n + "-"), n;
    }
    function xn(t) {
      return gn(x, 18) + "transition-duration:" + t / 1e3 + "s;";
    }
    function bn(t) {
      return gn(b, 17) + "animation-duration:" + t / 1e3 + "s;";
    }
    function Cn() {
      if (dn("autoHeight") || rt || !q) {
        var t = G.querySelectorAll("img");
        qi(t, function (t) {
          var e = t.src;
          e && e.indexOf("data:image") < 0
            ? (ea(t, xe), (t.src = ""), (t.src = e), Vi(t, "loading"))
            : St || zn(t);
        }),
          Oi(function () {
            jn(Ji(t), function () {
              Z = !0;
            });
          }),
          !rt && q && (t = Fn(qt, Math.min(qt + ft - 1, Ht - 1))),
          St
            ? wn()
            : Oi(function () {
                jn(Ji(t), wn);
              });
      } else I && ai(), Tn(), En();
    }
    function wn() {
      if (rt) {
        var e = yt ? qt : K - 1;
        !(function t() {
          Y[e - 1].getBoundingClientRect().right.toFixed(2) ===
          Y[e].getBoundingClientRect().left.toFixed(2)
            ? Mn()
            : setTimeout(function () {
                t();
              }, 16);
        })();
      } else Mn();
    }
    function Mn() {
      (q && !rt) ||
        (Yn(),
        rt
          ? ((Rt = ni()), ee && (ne = Ln()), (Gt = Ft()), an($t || ne))
          : Ni()),
        I && ai(),
        Tn(),
        En();
    }
    function Tn() {
      if (
        (Kn(),
        j.insertAdjacentHTML(
          "afterbegin",
          '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' +
            Rn() +
            "</span>  of " +
            K +
            "</div>"
        ),
        ($ = j.querySelector(".tns-liveregion .current")),
        pe)
      ) {
        var t = Tt ? "stop" : "start";
        Xe
          ? Yi(Xe, { "data-action": t })
          : O.autoplayButtonOutput &&
            (j.insertAdjacentHTML(
              cn(O.autoplayPosition),
              '<button data-action="' +
                t +
                '">' +
                Ke[0] +
                t +
                Ke[1] +
                At[0] +
                "</button>"
            ),
            (Xe = j.querySelector("[data-action]"))),
          Xe && ea(Xe, { click: yi }),
          Tt && (mi(), Nt && ea(G, oe), Lt && ea(G, ue));
      }
      if (de) {
        if (Se)
          Yi(Se, { "aria-label": "Carousel Pagination" }),
            qi((Be = Se.children), function (t, e) {
              Yi(t, {
                "data-nav": e,
                tabindex: "-1",
                "aria-label": ze + (e + 1),
                "aria-controls": Zt,
              });
            });
        else {
          for (
            var e = "", n = ve ? "" : 'style="display:none"', i = 0;
            i < K;
            i++
          )
            e +=
              '<button data-nav="' +
              i +
              '" tabindex="-1" aria-controls="' +
              Zt +
              '" ' +
              n +
              ' aria-label="' +
              ze +
              (i + 1) +
              '"></button>';
          (e =
            '<div class="tns-nav" aria-label="Carousel Pagination">' +
            e +
            "</div>"),
            j.insertAdjacentHTML(cn(O.navPosition), e),
            (Se = j.querySelector(".tns-nav")),
            (Be = Se.children);
        }
        if ((Bi(), x)) {
          var a = x.substring(0, x.length - 18).toLowerCase(),
            r = "transition: all " + mt / 1e3 + "s";
          a && (r = "-" + a + "-" + r),
            Wi(Bt, "[aria-controls^=" + Zt + "-item]", r, Fi(Bt));
        }
        Yi(Be[Re], { "aria-label": ze + (Re + 1) + We }),
          Ki(Be[Re], "tabindex"),
          Vi(Be[Re], Pe),
          ea(Se, re);
      }
      fe &&
        (Me ||
          (Ee && Ae) ||
          (j.insertAdjacentHTML(
            cn(O.controlsPosition),
            '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button data-controls="prev" tabindex="-1" aria-controls="' +
              Zt +
              '">' +
              bt[0] +
              '</button><button data-controls="next" tabindex="-1" aria-controls="' +
              Zt +
              '">' +
              bt[1] +
              "</button></div>"
          ),
          (Me = j.querySelector(".tns-controls"))),
        (Ee && Ae) || ((Ee = Me.children[0]), (Ae = Me.children[1])),
        O.controlsContainer &&
          Yi(Me, { "aria-label": "Carousel Navigation", tabindex: "0" }),
        (O.controlsContainer || (O.prevButton && O.nextButton)) &&
          Yi([Ee, Ae], { "aria-controls": Zt, tabindex: "-1" }),
        (O.controlsContainer || (O.prevButton && O.nextButton)) &&
          (Yi(Ee, { "data-controls": "prev" }),
          Yi(Ae, { "data-controls": "next" })),
        (Ce = Un(Ee)),
        (we = Un(Ae)),
        $n(),
        Me ? ea(Me, ae) : (ea(Ee, ae), ea(Ae, ae))),
        Sn();
    }
    function En() {
      if (I && C) {
        var t = {};
        (t[C] = si), ea(G, t);
      }
      wt && ea(G, se, O.preventScrollOnTouch),
        Mt && ea(G, ce),
        pt && ea(D, le),
        "inner" === R
          ? Ut.on("outerResized", function () {
              Nn(), Ut.emit("innerLoaded", Si());
            })
          : (k || ot || rt || gt || !q) && ea(h, { resize: An }),
        gt && ("outer" === R ? Ut.on("innerLoaded", qn) : $t || qn()),
        Pn(),
        $t ? Hn() : ne && Dn(),
        Ut.on("indexChanged", Vn),
        "inner" === R && Ut.emit("innerLoaded", Si()),
        "function" == typeof Jt && Jt(Si()),
        (U = !0);
    }
    function An(t) {
      Oi(function () {
        Nn(xi(t));
      });
    }
    function Nn(t) {
      if (U) {
        "outer" === R && Ut.emit("outerResized", Si(t)), (J = sn());
        var e,
          n = F,
          i = !1;
        k && (Bn(), (e = n !== F) && Ut.emit("newBreakpointStart", Si(t)));
        var a,
          r,
          o,
          u,
          l = ft,
          s = $t,
          c = ne,
          f = pt,
          d = xt,
          v = Ct,
          p = wt,
          m = Mt,
          h = Tt,
          y = Nt,
          g = Lt,
          x = qt;
        if (e) {
          var b = ot,
            C = gt,
            w = bt,
            M = ct,
            T = At;
          if (!H)
            var E = lt,
              A = ut;
        }
        if (
          ((pt = vn("arrowKeys")),
          (xt = vn("controls")),
          (Ct = vn("nav")),
          (wt = vn("touch")),
          (ct = vn("center")),
          (Mt = vn("mouseDrag")),
          (Tt = vn("autoplay")),
          (Nt = vn("autoplayHoverPause")),
          (Lt = vn("autoplayResetOnVisibility")),
          e &&
            (($t = vn("disable")),
            (ot = vn("fixedWidth")),
            (mt = vn("speed")),
            (gt = vn("autoHeight")),
            (bt = vn("controlsText")),
            (At = vn("autoplayText")),
            (Et = vn("autoplayTimeout")),
            H || ((ut = vn("edgePadding")), (lt = vn("gutter")))),
          an($t),
          (st = fn()),
          (q && !rt) || $t || (Yn(), q || (Ni(), (i = !0))),
          (ot || rt) && ((Rt = ni()), (Gt = Ft())),
          (e || ot) &&
            ((ft = vn("items")),
            (dt = vn("slideBy")),
            (r = ft !== l) && (ot || rt || (Gt = Ft()), en())),
          e &&
            $t !== s &&
            ($t
              ? Hn()
              : (function () {
                  if (!te) return;
                  if (((Bt.disabled = !1), (G.className += _t), ai(), yt))
                    for (var t = Dt; t--; ) I && _i(Y[t]), _i(Y[Ht - t - 1]);
                  if (!I)
                    for (var e = qt, n = qt + K; e < n; e++) {
                      var i = Y[e],
                        a = e < qt + ft ? P : W;
                      (i.style.left = (100 * (e - qt)) / ft + "%"), Vi(i, a);
                    }
                  On(), (te = !1);
                })()),
          ee &&
            (e || ot || rt) &&
            (ne = Ln()) !== c &&
            (ne
              ? (ri(ii(on(0))), Dn())
              : (!(function () {
                  if (!ie) return;
                  ut && H && (V.style.margin = "");
                  if (Dt)
                    for (var t = "tns-transparent", e = Dt; e--; )
                      I && Gi(Y[e], t), Gi(Y[Ht - e - 1], t);
                  On(), (ie = !1);
                })(),
                (i = !0))),
          an($t || ne),
          Tt || (Nt = Lt = !1),
          pt !== f && (pt ? ea(D, le) : na(D, le)),
          xt !== d &&
            (xt
              ? Me
                ? _i(Me)
                : (Ee && _i(Ee), Ae && _i(Ae))
              : Me
              ? Ui(Me)
              : (Ee && Ui(Ee), Ae && Ui(Ae))),
          Ct !== v && (Ct ? _i(Se) : Ui(Se)),
          wt !== p && (wt ? ea(G, se, O.preventScrollOnTouch) : na(G, se)),
          Mt !== m && (Mt ? ea(G, ce) : na(G, ce)),
          Tt !== h &&
            (Tt
              ? (Xe && _i(Xe), qe || Ve || mi())
              : (Xe && Ui(Xe), qe && hi())),
          Nt !== y && (Nt ? ea(G, oe) : na(G, oe)),
          Lt !== g && (Lt ? ea(D, ue) : na(D, ue)),
          e)
        ) {
          if (
            ((ot === b && ct === M) || (i = !0),
            gt !== C && (gt || (V.style.height = "")),
            xt && bt !== w && ((Ee.innerHTML = bt[0]), (Ae.innerHTML = bt[1])),
            Xe && At !== T)
          ) {
            var N = Tt ? 1 : 0,
              L = Xe.innerHTML,
              B = L.length - T[N].length;
            L.substring(B) === T[N] &&
              (Xe.innerHTML = L.substring(0, B) + At[N]);
          }
        } else ct && (ot || rt) && (i = !0);
        if (
          ((r || (ot && !rt)) && ((De = Li()), Bi()),
          (a = qt !== x)
            ? (Ut.emit("indexChanged", Si()), (i = !0))
            : r
            ? a || Vn()
            : (ot || rt) && (Pn(), Kn(), kn()),
          r &&
            !I &&
            (function () {
              for (var t = qt + Math.min(K, ft), e = Ht; e--; ) {
                var n = Y[e];
                qt <= e && e < t
                  ? (Vi(n, "tns-moving"),
                    (n.style.left = (100 * (e - qt)) / ft + "%"),
                    Vi(n, P),
                    Gi(n, W))
                  : n.style.left && ((n.style.left = ""), Vi(n, W), Gi(n, P)),
                  Gi(n, z);
              }
              setTimeout(function () {
                qi(Y, function (t) {
                  Gi(t, "tns-moving");
                });
              }, 300);
            })(),
          !$t && !ne)
        ) {
          if (
            e &&
            !H &&
            ((gt === autoheightTem && mt === speedTem) || Gn(),
            (ut === A && lt === E) ||
              (V.style.cssText = pn(ut, lt, ot, mt, gt)),
            q)
          ) {
            I && (G.style.width = mn(ot, lt, ft));
            var S = hn(ot, lt, ft) + yn(lt);
            (u = Fi((o = Bt)) - 1),
              "deleteRule" in o ? o.deleteRule(u) : o.removeRule(u),
              Wi(Bt, "#" + Zt + " > .tns-item", S, Fi(Bt));
          }
          gt && qn(), i && (ai(), (jt = qt));
        }
        e && Ut.emit("newBreakpointEnd", Si(t));
      }
    }
    function Ln() {
      if (!ot && !rt) return K <= (ct ? ft - (ft - 1) / 2 : ft);
      var t = ot ? (ot + lt) * K : _[K],
        e = ut ? st + 2 * ut : st + lt;
      return (
        ct && (e -= ot ? (st - ot) / 2 : (st - (_[qt + 1] - _[qt] - lt)) / 2),
        t <= e
      );
    }
    function Bn() {
      for (var t in ((F = 0), k)) (t = parseInt(t)) <= J && (F = t);
    }
    function Sn() {
      !Tt && Xe && Ui(Xe),
        !Ct && Se && Ui(Se),
        xt || (Me ? Ui(Me) : (Ee && Ui(Ee), Ae && Ui(Ae)));
    }
    function On() {
      Tt && Xe && _i(Xe),
        Ct && Se && _i(Se),
        xt && (Me ? _i(Me) : (Ee && _i(Ee), Ae && _i(Ae)));
    }
    function Dn() {
      if (!ie) {
        if ((ut && (V.style.margin = "0px"), Dt))
          for (var t = "tns-transparent", e = Dt; e--; )
            I && Vi(Y[e], t), Vi(Y[Ht - e - 1], t);
        Sn(), (ie = !0);
      }
    }
    function Hn() {
      if (!te) {
        if (
          ((Bt.disabled = !0),
          (G.className = G.className.replace(_t.substring(1), "")),
          Ki(G, ["style"]),
          yt)
        )
          for (var t = Dt; t--; ) I && Ui(Y[t]), Ui(Y[Ht - t - 1]);
        if (((q && I) || Ki(V, ["style"]), !I))
          for (var e = qt, n = qt + K; e < n; e++) {
            var i = Y[e];
            Ki(i, ["style"]), Gi(i, P), Gi(i, W);
          }
        Sn(), (te = !0);
      }
    }
    function kn() {
      var t = Rn();
      $.innerHTML !== t && ($.innerHTML = t);
    }
    function Rn() {
      var t = In(),
        e = t[0] + 1,
        n = t[1] + 1;
      return e === n ? e + "" : e + " to " + n;
    }
    function In(t) {
      null == t && (t = ii());
      var n,
        i,
        a,
        r = qt;
      if (
        (ct || ut
          ? (rt || ot) && ((i = -(parseFloat(t) + ut)), (a = i + st + 2 * ut))
          : rt && ((i = _[qt]), (a = i + st)),
        rt)
      )
        _.forEach(function (t, e) {
          e < Ht &&
            ((ct || ut) && t <= i + 0.5 && (r = e), 0.5 <= a - t && (n = e));
        });
      else {
        if (ot) {
          var e = ot + lt;
          ct || ut
            ? ((r = Math.floor(i / e)), (n = Math.ceil(a / e - 1)))
            : (n = r + Math.ceil(st / e) - 1);
        } else if (ct || ut) {
          var o = ft - 1;
          if ((ct ? ((r -= o / 2), (n = qt + o / 2)) : (n = qt + o), ut)) {
            var u = (ut * ft) / st;
            (r -= u), (n += u);
          }
          (r = Math.floor(r)), (n = Math.ceil(n));
        } else n = r + ft - 1;
        (r = Math.max(r, 0)), (n = Math.min(n, Ht - 1));
      }
      return [r, n];
    }
    function Pn() {
      St &&
        !$t &&
        Fn.apply(null, In()).forEach(function (t) {
          if (!ji(t, ge)) {
            var e = {};
            (e[C] = function (t) {
              t.stopPropagation();
            }),
              ea(t, e),
              ea(t, xe),
              (t.src = Xi(t, "data-src"));
            var n = Xi(t, "data-srcset");
            n && (t.srcset = n), Vi(t, "loading");
          }
        });
    }
    function zn(t) {
      Vi(t, "loaded"), Wn(t);
    }
    function Wn(t) {
      Vi(t, "tns-complete"), Gi(t, "loading"), na(t, xe);
    }
    function Fn(t, e) {
      for (var n = []; t <= e; )
        qi(Y[t].querySelectorAll("img"), function (t) {
          n.push(t);
        }),
          t++;
      return n;
    }
    function qn() {
      var t = Fn.apply(null, In());
      Oi(function () {
        jn(t, Xn);
      });
    }
    function jn(n, t) {
      return Z
        ? t()
        : (n.forEach(function (t, e) {
            ji(t, ge) && n.splice(e, 1);
          }),
          n.length
            ? void Oi(function () {
                jn(n, t);
              })
            : t());
    }
    function Vn() {
      Pn(),
        Kn(),
        kn(),
        $n(),
        (function () {
          if (Ct && ((Re = 0 <= ke ? ke : ln()), (ke = -1), Re !== Ie)) {
            var t = Be[Ie],
              e = Be[Re];
            Yi(t, { tabindex: "-1", "aria-label": ze + (Ie + 1) }),
              Gi(t, Pe),
              Yi(e, { "aria-label": ze + (Re + 1) + We }),
              Ki(e, "tabindex"),
              Vi(e, Pe),
              (Ie = Re);
          }
        })();
    }
    function Gn() {
      I && gt && (S.style[x] = mt / 1e3 + "s");
    }
    function Qn(t, e) {
      for (var n = [], i = t, a = Math.min(t + e, Ht); i < a; i++)
        n.push(Y[i].offsetHeight);
      return Math.max.apply(null, n);
    }
    function Xn() {
      var t = gt ? Qn(qt, ft) : Qn(Dt, K),
        e = S || V;
      e.style.height !== t && (e.style.height = t + "px");
    }
    function Yn() {
      _ = [0];
      var n = q ? "left" : "top",
        i = q ? "right" : "bottom",
        a = Y[0].getBoundingClientRect()[n];
      qi(Y, function (t, e) {
        e && _.push(t.getBoundingClientRect()[n] - a),
          e === Ht - 1 && _.push(t.getBoundingClientRect()[i] - a);
      });
    }
    function Kn() {
      var t = In(),
        n = t[0],
        i = t[1];
      qi(Y, function (t, e) {
        n <= e && e <= i
          ? Qi(t, "aria-hidden") &&
            (Ki(t, ["aria-hidden", "tabindex"]), Vi(t, ye))
          : Qi(t, "aria-hidden") ||
            (Yi(t, { "aria-hidden": "true", tabindex: "-1" }), Gi(t, ye));
      });
    }
    function Jn(t) {
      return t.nodeName.toLowerCase();
    }
    function Un(t) {
      return "button" === Jn(t);
    }
    function _n(t) {
      return "true" === t.getAttribute("aria-disabled");
    }
    function Zn(t, e, n) {
      t ? (e.disabled = n) : e.setAttribute("aria-disabled", n.toString());
    }
    function $n() {
      if (xt && !ht && !yt) {
        var t = Ce ? Ee.disabled : _n(Ee),
          e = we ? Ae.disabled : _n(Ae),
          n = qt <= Vt,
          i = !ht && Gt <= qt;
        n && !t && Zn(Ce, Ee, !0),
          !n && t && Zn(Ce, Ee, !1),
          i && !e && Zn(we, Ae, !0),
          !i && e && Zn(we, Ae, !1);
      }
    }
    function ti(t, e) {
      x && (t.style[x] = e);
    }
    function ei(t) {
      return (
        null == t && (t = qt),
        rt
          ? (st - (ut ? lt : 0) - (_[t + 1] - _[t] - lt)) / 2
          : ot
          ? (st - ot) / 2
          : (ft - 1) / 2
      );
    }
    function ni() {
      var t = st + (ut ? lt : 0) - (ot ? (ot + lt) * Ht : _[Ht]);
      return (
        ct &&
          !yt &&
          (t = ot ? -(ot + lt) * (Ht - 1) - ei() : ei(Ht - 1) - _[Ht - 1]),
        0 < t && (t = 0),
        t
      );
    }
    function ii(t) {
      var e;
      if ((null == t && (t = qt), q && !rt))
        if (ot) (e = -(ot + lt) * t), ct && (e += ei());
        else {
          var n = d ? Ht : ft;
          ct && (t -= ei()), (e = (100 * -t) / n);
        }
      else (e = -_[t]), ct && rt && (e += ei());
      return kt && (e = Math.max(e, Rt)), (e += !q || rt || ot ? "px" : "%");
    }
    function ai(t) {
      ti(G, "0s"), ri(t);
    }
    function ri(t) {
      null == t && (t = ii()), (G.style[Pt] = zt + t + Wt);
    }
    function oi(t, e, n, i) {
      var a = t + ft;
      yt || (a = Math.min(a, Ht));
      for (var r = t; r < a; r++) {
        var o = Y[r];
        i || (o.style.left = (100 * (r - qt)) / ft + "%"),
          B && p && (o.style[p] = o.style[m] = (B * (r - t)) / 1e3 + "s"),
          Gi(o, e),
          Vi(o, n),
          i && Ot.push(o);
      }
    }
    function ui(t, e) {
      It && en(),
        (qt !== jt || e) &&
          (Ut.emit("indexChanged", Si()),
          Ut.emit("transitionStart", Si()),
          gt && qn(),
          qe && t && 0 <= ["click", "keydown"].indexOf(t.type) && hi(),
          (Kt = !0),
          nn());
    }
    function li(t) {
      return t.toLowerCase().replace(/-/g, "");
    }
    function si(t) {
      if (I || Kt) {
        if ((Ut.emit("transitionEnd", Si(t)), !I && 0 < Ot.length))
          for (var e = 0; e < Ot.length; e++) {
            var n = Ot[e];
            (n.style.left = ""),
              m && p && ((n.style[m] = ""), (n.style[p] = "")),
              Gi(n, z),
              Vi(n, W);
          }
        if (
          !t ||
          (!I && t.target.parentNode === G) ||
          (t.target === G && li(t.propertyName) === li(Pt))
        ) {
          if (!It) {
            var i = qt;
            en(), qt !== i && (Ut.emit("indexChanged", Si()), ai());
          }
          "inner" === R && Ut.emit("innerLoaded", Si()), (Kt = !1), (jt = qt);
        }
      }
    }
    function ci(t, e) {
      if (!ne)
        if ("prev" === t) fi(e, -1);
        else if ("next" === t) fi(e, 1);
        else {
          if (Kt) {
            if (Qt) return;
            si();
          }
          var n = un(),
            i = 0;
          if (
            ("first" === t
              ? (i = -n)
              : "last" === t
              ? (i = I ? K - ft - n : K - 1 - n)
              : ("number" != typeof t && (t = parseInt(t)),
                isNaN(t) ||
                  (e || (t = Math.max(0, Math.min(K - 1, t))), (i = t - n))),
            !I && i && Math.abs(i) < ft)
          ) {
            var a = 0 < i ? 1 : -1;
            i += Vt <= qt + i - K ? K * a : 2 * K * a * -1;
          }
          (qt += i),
            I && yt && (qt < Vt && (qt += K), Gt < qt && (qt -= K)),
            un(qt) !== un(jt) && ui(e);
        }
    }
    function fi(t, e) {
      if (Kt) {
        if (Qt) return;
        si();
      }
      var n;
      if (!e) {
        for (var i = bi((t = xi(t))); i !== Me && [Ee, Ae].indexOf(i) < 0; )
          i = i.parentNode;
        var a = [Ee, Ae].indexOf(i);
        0 <= a && ((n = !0), (e = 0 === a ? -1 : 1));
      }
      if (ht) {
        if (qt === Vt && -1 === e) return void ci("last", t);
        if (qt === Gt && 1 === e) return void ci("first", t);
      }
      e &&
        ((qt += dt * e),
        rt && (qt = Math.floor(qt)),
        ui(n || (t && "keydown" === t.type) ? t : null));
    }
    function di() {
      (Fe = setInterval(function () {
        fi(null, Qe);
      }, Et)),
        (qe = !0);
    }
    function vi() {
      clearInterval(Fe), (qe = !1);
    }
    function pi(t, e) {
      Yi(Xe, { "data-action": t }), (Xe.innerHTML = Ke[0] + t + Ke[1] + e);
    }
    function mi() {
      di(), Xe && pi("stop", At[1]);
    }
    function hi() {
      vi(), Xe && pi("start", At[0]);
    }
    function yi() {
      qe ? (hi(), (Ve = !0)) : (mi(), (Ve = !1));
    }
    function gi(t) {
      t.focus();
    }
    function xi(t) {
      return Ci((t = t || h.event)) ? t.changedTouches[0] : t;
    }
    function bi(t) {
      return t.target || h.event.srcElement;
    }
    function Ci(t) {
      return 0 <= t.type.indexOf("touch");
    }
    function wi(t) {
      t.preventDefault ? t.preventDefault() : (t.returnValue = !1);
    }
    function Mi() {
      return (
        (a = Ze.y - _e.y),
        (r = Ze.x - _e.x),
        (t = Math.atan2(a, r) * (180 / Math.PI)),
        (e = Xt),
        (n = !1),
        (i = Math.abs(90 - Math.abs(t))),
        90 - e <= i ? (n = "horizontal") : i <= e && (n = "vertical"),
        n === O.axis
      );
      var t, e, n, i, a, r;
    }
    function Ti(t) {
      if (Kt) {
        if (Qt) return;
        si();
      }
      Tt && qe && vi(), ($e = !0), Ue && (Di(Ue), (Ue = null));
      var e = xi(t);
      Ut.emit(Ci(t) ? "touchStart" : "dragStart", Si(t)),
        !Ci(t) && 0 <= ["img", "a"].indexOf(Jn(bi(t))) && wi(t),
        (Ze.x = _e.x = e.clientX),
        (Ze.y = _e.y = e.clientY),
        I && ((Je = parseFloat(G.style[Pt].replace(zt, ""))), ti(G, "0s"));
    }
    function Ei(t) {
      if ($e) {
        var e = xi(t);
        (Ze.x = e.clientX),
          (Ze.y = e.clientY),
          I
            ? Ue ||
              (Ue = Oi(function () {
                !(function t(e) {
                  if (!Yt) return void ($e = !1);
                  Di(Ue);
                  $e &&
                    (Ue = Oi(function () {
                      t(e);
                    }));
                  "?" === Yt && (Yt = Mi());
                  if (Yt) {
                    !be && Ci(e) && (be = !0);
                    try {
                      e.type &&
                        Ut.emit(Ci(e) ? "touchMove" : "dragMove", Si(e));
                    } catch (t) {}
                    var n = Je,
                      i = tn(Ze, _e);
                    if (!q || ot || rt) (n += i), (n += "px");
                    else {
                      var a = d
                        ? (i * ft * 100) / ((st + lt) * Ht)
                        : (100 * i) / (st + lt);
                      (n += a), (n += "%");
                    }
                    G.style[Pt] = zt + n + Wt;
                  }
                })(t);
              }))
            : ("?" === Yt && (Yt = Mi()), Yt && (be = !0)),
          be && t.preventDefault();
      }
    }
    function Ai(i) {
      if ($e) {
        Ue && (Di(Ue), (Ue = null)), I && ti(G, ""), ($e = !1);
        var t = xi(i);
        (Ze.x = t.clientX), (Ze.y = t.clientY);
        var a = tn(Ze, _e);
        if (Math.abs(a)) {
          if (!Ci(i)) {
            var n = bi(i);
            ea(n, {
              click: function t(e) {
                wi(e), na(n, { click: t });
              },
            });
          }
          I
            ? (Ue = Oi(function () {
                if (q && !rt) {
                  var t = (-a * ft) / (st + lt);
                  (t = 0 < a ? Math.floor(t) : Math.ceil(t)), (qt += t);
                } else {
                  var e = -(Je + a);
                  if (e <= 0) qt = Vt;
                  else if (e >= _[Ht - 1]) qt = Gt;
                  else
                    for (var n = 0; n < Ht && e >= _[n]; )
                      e > _[(qt = n)] && a < 0 && (qt += 1), n++;
                }
                ui(i, a), Ut.emit(Ci(i) ? "touchEnd" : "dragEnd", Si(i));
              }))
            : Yt && fi(i, 0 < a ? -1 : 1);
        }
      }
      "auto" === O.preventScrollOnTouch && (be = !1),
        Xt && (Yt = "?"),
        Tt && !qe && di();
    }
    function Ni() {
      (S || V).style.height = _[qt + ft] - _[qt] + "px";
    }
    function Li() {
      var t = ot ? ((ot + lt) * K) / st : K / ft;
      return Math.min(Math.ceil(t), K);
    }
    function Bi() {
      if (Ct && !ve && De !== He) {
        var t = He,
          e = De,
          n = _i;
        for (De < He && ((t = De), (e = He), (n = Ui)); t < e; ) n(Be[t]), t++;
        He = De;
      }
    }
    function Si(t) {
      return {
        container: G,
        slideItems: Y,
        navContainer: Se,
        navItems: Be,
        controlsContainer: Me,
        hasControls: fe,
        prevButton: Ee,
        nextButton: Ae,
        items: ft,
        slideBy: dt,
        cloneCount: Dt,
        slideCount: K,
        slideCountNew: Ht,
        index: qt,
        indexCached: jt,
        displayIndex: rn(),
        navCurrentIndex: Re,
        navCurrentIndexCached: Ie,
        pages: De,
        pagesCached: He,
        sheet: Bt,
        isOn: U,
        event: t || {},
      };
    }
    M && console.warn("No slides found in", O.container);
  };
  return aa;
})();
//# sourceMappingURL=../sourcemaps/tiny-slider.js.map
