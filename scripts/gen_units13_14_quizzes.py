#!/usr/bin/env python3
"""
Generate Unit 13 (Series Solutions) and Unit 14 (Linear Algebra Foundations for
Systems) interactive quizzes in a single batch.

Authors the 18 video micro-practice quizzes (five items each) and the two 30
item unit mastery quizzes as one Python source of truth, then:
  1. Emits JS object literal text and splices it into ode/js/quiz-data.js, into
     the existing micro_practice and unit_mastery objects (append only).
  2. Updates the documentation mirror ode/data/quizzes.json so both stay in sync.

Canonical math strings here use SINGLE backslashes (raw strings). json.dumps
performs the escaping, which is identical for JS source literals and JSON, so
the emitted \\frac in both files evaluates to a single backslash at runtime.

Copy rule: no em dashes, no en dashes, and no ampersands in any user facing
string. The Math Confidence Reset is enforced: incorrect rationales never name
or reveal the correct option, they pose a first-principles guiding question.
Matrices are described by their rows in words (e.g. "rows (2, 1) and (1, 2)")
rather than KaTeX matrix environments, whose & column separator is forbidden.
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS_PATH = os.path.join(ROOT, "app", "js", "quiz-data.js")
JSON_PATH = os.path.join(ROOT, "app", "data", "quizzes.json")

UNIT13_TITLE = "Unit 13: Series Solutions"
UNIT14_TITLE = "Unit 14: Linear Algebra Foundations for Systems"


def C(text, rationale):
    return {"text": text, "correct": True, "rationale": rationale}


def W(text, rationale):
    return {"text": text, "rationale": rationale}


def item(qid, prompt, hint, options):
    return {"id": qid, "prompt": prompt, "hint": hint, "answerOptions": options}


MICRO = []  # list of (video_id, comment_line, [items])


def add_micro(video_id, comment, items):
    MICRO.append((video_id, comment, items))


MASTERY_13 = []
MASTERY_14 = []


def m13(qid, prompt, hint, options):
    MASTERY_13.append(item(qid, prompt, hint, options))


def m14(qid, prompt, hint, options):
    MASTERY_14.append(item(qid, prompt, hint, options))


# ============================================================================
# CONTENT  (inserted above the machinery marker)
# ============================================================================

# ============================================================================
# UNIT 13 MICRO PRACTICE
# ============================================================================

# === 13.1 video 1 ===========================================================
add_micro(
    "ZcvxlNKKY_Q",
    'Unit 13, Module 13.1, video 1\n           "How To Calculate The Taylor Expansion of e^x?"',
    [
        item(
            "mp_ZcvxlNKKY_Q_1",
            r"What is the Maclaurin (Taylor about $0$) series of $e^x$?",
            r"Every derivative of $e^x$ equals $e^x$, which is $1$ at $x = 0$.",
            [
                C(r"$\sum_{n=0}^{\infty} \frac{x^n}{n!}$", r"Yes. Since every derivative of $e^x$ is $1$ at $0$, the coefficient of $x^n$ is $1/n!$."),
                W(r"$\sum_{n=0}^{\infty} \frac{x^n}{n}$", r"The factorial, not $n$, comes from the Taylor coefficient $f^{(n)}(0)/n!$. What goes in the denominator?"),
                W(r"$\sum_{n=0}^{\infty} n!\, x^n$", r"The factorial appears in the denominator, not the numerator. What is $f^{(n)}(0)/n!$ for $e^x$?"),
                W(r"$\sum_{n=0}^{\infty} \frac{x^{2n}}{(2n)!}$", r"Only even powers is the pattern for $\cosh$ or $\cos$. Does $e^x$ skip the odd powers?"),
            ],
        ),
        item(
            "mp_ZcvxlNKKY_Q_2",
            r"In the Maclaurin series of $e^x$, what is the coefficient of $x^4$?",
            r"The coefficient of $x^n$ is $1/n!$.",
            [
                C(r"$\frac{1}{24}$", r"Correct. The coefficient is $1/4! = 1/24$."),
                W(r"$\frac{1}{4}$", r"The denominator is the factorial $4!$, not $4$. What is $4!$?"),
                W(r"$24$", r"The factorial sits in the denominator. What is $1/4!$?"),
                W(r"$\frac{1}{16}$", r"That is $1/4^2$, not $1/4!$. What is the value of $4!$?"),
            ],
        ),
        item(
            "mp_ZcvxlNKKY_Q_3",
            r"The Taylor coefficient of $x^n$ for a function $f$ expanded about $0$ is given by which formula?",
            r"It involves the $n$-th derivative evaluated at the center.",
            [
                C(r"$\frac{f^{(n)}(0)}{n!}$", r"Yes. The $n$-th Taylor coefficient is the $n$-th derivative at the center divided by $n!$."),
                W(r"$\frac{f^{(n)}(0)}{n}$", r"The denominator is a factorial, not $n$. What divides $f^{(n)}(0)$?"),
                W(r"$f^{(n)}(0)$", r"There is a factorial in the denominator. What must $f^{(n)}(0)$ be divided by?"),
                W(r"$\frac{f(0)}{n!}$", r"The numerator uses the $n$-th derivative, not $f$ itself. Which derivative appears?"),
            ],
        ),
        item(
            "mp_ZcvxlNKKY_Q_4",
            r"Why does the Taylor expansion of $e^x$ have the simple coefficients $1/n!$?",
            r"Consider what the $n$-th derivative of $e^x$ equals at $x = 0$.",
            [
                C(r"Every derivative of $e^x$ equals $e^x$, which is $1$ at $x = 0$", r"Yes. Because $f^{(n)}(0) = 1$ for all $n$, the coefficient $f^{(n)}(0)/n!$ reduces to $1/n!$."),
                W(r"Because $e^x$ is a polynomial of finite degree", r"The series has infinitely many terms, so $e^x$ is not a polynomial. What is special about its derivatives at $0$?"),
                W(r"Because the derivatives of $e^x$ grow like $n!$", r"The derivatives of $e^x$ at $0$ are all $1$, not $n!$. What is $f^{(n)}(0)$ here?"),
                W(r"Because $e^x$ is its own integral plus a constant", r"The key fact is about the derivatives at the center. What does $f^{(n)}(0)$ equal for $e^x$?"),
            ],
        ),
        item(
            "mp_ZcvxlNKKY_Q_5",
            r"What is the third-degree Taylor polynomial of $e^x$ about $0$?",
            r"Take the terms of $\sum x^n/n!$ up through $n = 3$.",
            [
                C(r"$1 + x + \frac{x^2}{2} + \frac{x^3}{6}$", r"Correct. The coefficients are $1/0!, 1/1!, 1/2!, 1/3!$, that is $1, 1, 1/2, 1/6$."),
                W(r"$1 + x + x^2 + x^3$", r"Each term is divided by a factorial. What are $1/2!$ and $1/3!$?"),
                W(r"$x + \frac{x^2}{2} + \frac{x^3}{6}$", r"The constant term $1/0!$ is missing. What is the $n = 0$ term?"),
                W(r"$1 + x + \frac{x^2}{2} + \frac{x^3}{3}$", r"The cubic term uses $3! = 6$, not $3$. What is $1/3!$?"),
            ],
        ),
    ],
)

# === 13.1 video 2 ===========================================================
add_micro(
    "ebfOSDj4j3I",
    'Unit 13, Module 13.1, video 2\n           "Taylor Series and Power Series Made Easy, Review of Calculus"',
    [
        item(
            "mp_ebfOSDj4j3I_1",
            r"What is the Taylor series of a function $f$ centered at $x = a$?",
            r"It is a sum of derivative terms weighted by powers of $(x - a)$.",
            [
                C(r"$\sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x - a)^n$", r"Yes. Each term uses the $n$-th derivative at $a$ over $n!$, times $(x - a)^n$."),
                W(r"$\sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}x^n$", r"Centering at $a$ means powers of $(x - a)$, not $x$. What base should be raised to the $n$-th power?"),
                W(r"$\sum_{n=0}^{\infty} f^{(n)}(a)(x - a)^n$", r"Each derivative must be divided by a factorial. What is missing from the coefficient?"),
                W(r"$\sum_{n=0}^{\infty} \frac{f(a)}{n!}(x - a)^n$", r"The numerator uses the $n$-th derivative, not $f(a)$ for every term. Which derivative appears in term $n$?"),
            ],
        ),
        item(
            "mp_ebfOSDj4j3I_2",
            r"A Maclaurin series is a Taylor series centered at which point?",
            r"Maclaurin is the special case with the simplest center.",
            [
                C(r"$x = 0$", r"Yes. A Maclaurin series is just a Taylor series with center $a = 0$."),
                W(r"$x = 1$", r"The Maclaurin center is the origin, not $1$. What value of $a$ gives powers of $x$ alone?"),
                W(r"$x = a$ for any $a$", r"Maclaurin fixes one specific center. Which value makes $(x - a)^n$ become $x^n$?"),
                W(r"the nearest singular point", r"The center is a fixed simple point, not tied to singularities. Which point gives plain powers of $x$?"),
            ],
        ),
        item(
            "mp_ebfOSDj4j3I_3",
            r"The geometric series $\sum_{n=0}^{\infty} x^n$ converges to $\frac{1}{1-x}$ on which interval?",
            r"A geometric series converges exactly when the ratio has magnitude below $1$.",
            [
                C(r"$|x| < 1$", r"Yes. A geometric series converges precisely when the common ratio satisfies $|x| < 1$."),
                W(r"$|x| < \infty$ (all real $x$)", r"Geometric convergence requires the ratio to be small. What bound must $|x|$ satisfy?"),
                W(r"$|x| > 1$", r"Large ratios make the terms grow without bound. For which $|x|$ do the terms shrink?"),
                W(r"$x > 0$ only", r"Convergence depends on magnitude, not sign. What condition on $|x|$ is required?"),
            ],
        ),
        item(
            "mp_ebfOSDj4j3I_4",
            r"Using the ratio test, what is the radius of convergence of $\sum_{n=0}^{\infty} \frac{x^n}{2^n}$?",
            r"The series is geometric with ratio $x/2$; it converges when $|x/2| < 1$.",
            [
                C(r"$R = 2$", r"Correct. The ratio is $x/2$, so $|x/2| < 1$ means $|x| < 2$, giving $R = 2$."),
                W(r"$R = 1$", r"The factor $2^n$ widens the interval. From $|x/2| < 1$, what is the bound on $|x|$?"),
                W(r"$R = \frac{1}{2}$", r"That inverts the bound. Solve $|x/2| < 1$ for $|x|$ to find $R$."),
                W(r"$R = \infty$", r"A geometric series has a finite radius unless the ratio always shrinks. What does $|x/2| < 1$ give?"),
            ],
        ),
        item(
            "mp_ebfOSDj4j3I_5",
            r"What is the Maclaurin series of $\cos x$?",
            r"Cosine is even, so only even powers appear, with alternating signs.",
            [
                C(r"$\sum_{n=0}^{\infty} \frac{(-1)^n x^{2n}}{(2n)!}$", r"Yes. Cosine keeps only even powers with alternating signs and factorial denominators."),
                W(r"$\sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{(2n+1)!}$", r"Odd powers belong to $\sin x$. Which powers does an even function keep?"),
                W(r"$\sum_{n=0}^{\infty} \frac{x^{2n}}{(2n)!}$", r"The signs must alternate for cosine. What factor produces the alternation?"),
                W(r"$\sum_{n=0}^{\infty} \frac{(-1)^n x^n}{n!}$", r"That keeps all powers, but cosine uses only even ones. Which exponent pattern appears?"),
            ],
        ),
    ],
)

# === 13.2 video 1 ===========================================================
add_micro(
    "xeeM3TT4Zgg",
    'Unit 13, Module 13.2, video 1\n           "How to solve ODEs with infinite series, Intro and Easiest Example y prime equals y"',
    [
        item(
            "mp_xeeM3TT4Zgg_1",
            r"To solve an ODE by the power series method, what form do we assume for the solution about $x = 0$?",
            r"We posit an unknown analytic function and solve for its coefficients.",
            [
                C(r"$y = \sum_{n=0}^{\infty} a_n x^n$", r"Yes. We assume a power series with unknown coefficients $a_n$ and determine them from the equation."),
                W(r"$y = e^{rx}$ for a constant $r$", r"The exponential trial is for constant-coefficient equations. What general analytic form has unknown coefficients?"),
                W(r"$y = \sum_{n=0}^{\infty} a_n n!\, x^n$", r"The factorial is not part of the assumed form; it is built into the coefficients we solve for. What is the plain series ansatz?"),
                W(r"$y = a_0 + a_1 x$ (a polynomial)", r"A finite polynomial cannot solve most ODEs. What infinite form do we assume?"),
            ],
        ),
        item(
            "mp_xeeM3TT4Zgg_2",
            r"If $y = \sum_{n=0}^{\infty} a_n x^n$, which series equals $y'$ after re-indexing to powers of $x^n$?",
            r"Differentiate term by term, then shift the index so the power is $x^n$.",
            [
                C(r"$\sum_{n=0}^{\infty} (n+1)a_{n+1} x^n$", r"Yes. Differentiating gives $\sum n a_n x^{n-1}$, and shifting the index produces $(n+1)a_{n+1}x^n$."),
                W(r"$\sum_{n=0}^{\infty} n a_n x^n$", r"Differentiation lowers the exponent by one before re-indexing. What does shifting back to $x^n$ do to the coefficient?"),
                W(r"$\sum_{n=1}^{\infty} a_{n-1} x^n$", r"That omits the factor brought down by differentiation. What multiplies $a_{n+1}$ after the shift?"),
                W(r"$\sum_{n=0}^{\infty} a_{n+1} x^n$", r"Differentiating brings down a power, so a factor is missing. What coefficient multiplies $a_{n+1}$?"),
            ],
        ),
        item(
            "mp_xeeM3TT4Zgg_3",
            r"Substituting the series into $y' = y$ and matching coefficients of $x^n$ gives which recurrence?",
            r"Set $(n+1)a_{n+1} = a_n$ and solve for $a_{n+1}$.",
            [
                C(r"$a_{n+1} = \frac{a_n}{n+1}$", r"Correct. Equating $(n+1)a_{n+1} = a_n$ gives $a_{n+1} = a_n/(n+1)$."),
                W(r"$a_{n+1} = (n+1)a_n$", r"The factor $(n+1)$ divides, it does not multiply. Solve $(n+1)a_{n+1} = a_n$ for $a_{n+1}$."),
                W(r"$a_{n+1} = a_n$", r"The differentiation factor $(n+1)$ cannot just disappear. What divides $a_n$?"),
                W(r"$a_{n+1} = \frac{a_n}{n}$", r"The index shift gives $(n+1)$, not $n$, in the denominator. What is the exact divisor?"),
            ],
        ),
        item(
            "mp_xeeM3TT4Zgg_4",
            r"Using $a_{n+1} = a_n/(n+1)$ with $a_0 = 1$, what is $a_2$?",
            r"Compute $a_1$ first, then $a_2$.",
            [
                C(r"$a_2 = \frac{1}{2}$", r"Correct. $a_1 = a_0/1 = 1$, then $a_2 = a_1/2 = 1/2$."),
                W(r"$a_2 = 1$", r"Apply the recurrence twice. After $a_1 = 1$, what is $a_1/2$?"),
                W(r"$a_2 = 2$", r"The recurrence divides rather than multiplies. What is $a_1/2$?"),
                W(r"$a_2 = \frac{1}{3}$", r"The step from $a_1$ to $a_2$ divides by $2$, not $3$. What is $a_1/(1+1)$?"),
            ],
        ),
        item(
            "mp_xeeM3TT4Zgg_5",
            r"With $a_0 = 1$ the recurrence $a_{n+1} = a_n/(n+1)$ produces $a_n = 1/n!$. Which known function is the series solution?",
            r"The coefficients $1/n!$ are the Maclaurin coefficients of a familiar function.",
            [
                C(r"$y = e^x$", r"Yes. The coefficients $1/n!$ reconstruct $\sum x^n/n! = e^x$, as expected for $y' = y$."),
                W(r"$y = \cos x$", r"Cosine has alternating signs and only even powers. Do the coefficients $1/n!$ alternate?"),
                W(r"$y = \ln(1+x)$", r"That series does not have $1/n!$ coefficients. Which function has Maclaurin coefficients $1/n!$?"),
                W(r"$y = \frac{1}{1-x}$", r"The geometric series has all coefficients $1$, not $1/n!$. Which function matches $1/n!$?"),
            ],
        ),
    ],
)

# === 13.2 video 2 ===========================================================
add_micro(
    "6csP7dw0XTY",
    'Unit 13, Module 13.2, video 2\n           "Power Series Solutions of Differential Equations"',
    [
        item(
            "mp_6csP7dw0XTY_1",
            r"For $y'' + p(x)y' + q(x)y = 0$, what makes $x_0$ an ordinary point?",
            r"An ordinary point is where the coefficient functions behave nicely as power series.",
            [
                C(r"Both $p(x)$ and $q(x)$ are analytic at $x_0$", r"Yes. At an ordinary point both coefficient functions have convergent power series, so a power series solution exists."),
                W(r"Both $p(x)$ and $q(x)$ are zero at $x_0$", r"They need not vanish, only be well behaved. What property of $p$ and $q$ defines an ordinary point?"),
                W(r"$p(x)$ has a pole at $x_0$", r"A pole signals a singular point, not an ordinary one. What must be true of $p$ at an ordinary point?"),
                W(r"$q(x_0) = 1$", r"No special value is required. What general property must $p$ and $q$ have at $x_0$?"),
            ],
        ),
        item(
            "mp_6csP7dw0XTY_2",
            r"If $y = \sum a_n x^n$, which series equals $y''$ after re-indexing to powers of $x^n$?",
            r"Differentiate twice, then shift the index so the power is $x^n$.",
            [
                C(r"$\sum_{n=0}^{\infty} (n+2)(n+1)a_{n+2} x^n$", r"Yes. Two differentiations and an index shift give $(n+2)(n+1)a_{n+2}$ as the coefficient of $x^n$."),
                W(r"$\sum_{n=0}^{\infty} n(n-1)a_n x^n$", r"That is before re-indexing back to $x^n$. What coefficient multiplies $a_{n+2}$ after the shift?"),
                W(r"$\sum_{n=0}^{\infty} (n+1)a_{n+1} x^n$", r"That is the first derivative, not the second. How many factors does differentiating twice bring down?"),
                W(r"$\sum_{n=0}^{\infty} (n+2)a_{n+2} x^n$", r"Two derivatives bring down two factors, not one. What is the full product of factors?"),
            ],
        ),
        item(
            "mp_6csP7dw0XTY_3",
            r"Substituting the series into $y'' + y = 0$ gives which recurrence for the coefficients?",
            r"Match $(n+2)(n+1)a_{n+2} + a_n = 0$ and solve for $a_{n+2}$.",
            [
                C(r"$a_{n+2} = \frac{-a_n}{(n+2)(n+1)}$", r"Correct. From $(n+2)(n+1)a_{n+2} + a_n = 0$ we solve $a_{n+2} = -a_n/[(n+2)(n+1)]$."),
                W(r"$a_{n+2} = \frac{a_n}{(n+2)(n+1)}$", r"The $+y$ term moves across with a sign change. What sign does $a_n$ pick up?"),
                W(r"$a_{n+1} = \frac{-a_n}{n+1}$", r"The second derivative links $a_{n+2}$ to $a_n$, skipping one index. Which coefficient is solved for?"),
                W(r"$a_{n+2} = \frac{-a_n}{(n+1)}$", r"Two derivatives give the product $(n+2)(n+1)$ in the denominator. What is the full product?"),
            ],
        ),
        item(
            "mp_6csP7dw0XTY_4",
            r"The two independent power series solutions of $y'' + y = 0$ (from $a_0$ and $a_1$) are which familiar functions?",
            r"This equation is the harmonic oscillator; its series rebuild two trig functions.",
            [
                C(r"$\cos x$ and $\sin x$", r"Yes. The even-indexed series gives $\cos x$ and the odd-indexed series gives $\sin x$."),
                W(r"$e^x$ and $e^{-x}$", r"Those solve $y'' - y = 0$, with the opposite sign. What does $y'' + y = 0$ give?"),
                W(r"$\cosh x$ and $\sinh x$", r"The hyperbolic pair solves $y'' - y = 0$. Which oscillatory pair solves $y'' + y = 0$?"),
                W(r"$1$ and $x$", r"Those solve $y'' = 0$. What functions arise when the recurrence alternates signs?"),
            ],
        ),
        item(
            "mp_6csP7dw0XTY_5",
            r"At an ordinary point, the radius of convergence of a power series solution is at least equal to what?",
            r"The guaranteed radius reaches out to the nearest place where the coefficients misbehave.",
            [
                C(r"The distance to the nearest singular point of the equation", r"Yes. The series is guaranteed to converge at least out to the closest singular point in the complex plane."),
                W(r"Exactly $1$, always", r"The radius depends on the equation, not a fixed value. What geometric distance bounds it?"),
                W(r"Zero", r"At an ordinary point convergence is guaranteed on a positive interval. What sets that radius?"),
                W(r"The distance to the farthest singular point", r"Convergence is limited by the closest trouble spot, not the farthest. Which singular point matters?"),
            ],
        ),
    ],
)

# === 13.3 video 1 ===========================================================
add_micro(
    "_qQLuxYClA4",
    'Unit 13, Module 13.3, video 1\n           "Introduction to the Frobenius Method"',
    [
        item(
            "mp__qQLuxYClA4_1",
            r"For $y'' + p(x)y' + q(x)y = 0$, what makes $x_0 = 0$ a regular singular point?",
            r"It is singular, but the singularity is mild: $x p(x)$ and $x^2 q(x)$ must stay analytic.",
            [
                C(r"$x_0$ is singular, yet $x\,p(x)$ and $x^2 q(x)$ are analytic at $x_0$", r"Yes. A regular singular point is a singularity tamed by the factors $x$ and $x^2$, which is exactly what Frobenius needs."),
                W(r"Both $p$ and $q$ are analytic at $x_0$", r"That describes an ordinary point, where plain power series work. What extra factors must be analytic at a regular singular point?"),
                W(r"$p$ and $q$ have no singularity anywhere", r"A regular singular point is genuinely singular. What tamed combinations must remain analytic?"),
                W(r"$x^3 p(x)$ and $x^4 q(x)$ are analytic", r"The required powers are $1$ for $p$ and $2$ for $q$. Which factors tame the singularity?"),
            ],
        ),
        item(
            "mp__qQLuxYClA4_2",
            r"What solution form does the Frobenius method assume at a regular singular point?",
            r"It is a power series multiplied by a possibly non-integer power $x^r$.",
            [
                C(r"$y = x^r \sum_{n=0}^{\infty} a_n x^n = \sum_{n=0}^{\infty} a_n x^{n+r}$", r"Yes. The exponent $r$, found from the indicial equation, lets the series capture the singular behavior."),
                W(r"$y = \sum_{n=0}^{\infty} a_n x^n$", r"A plain power series is the ordinary-point ansatz. What extra factor handles the singularity?"),
                W(r"$y = e^{rx}\sum_{n=0}^{\infty} a_n x^n$", r"The Frobenius factor is a power $x^r$, not an exponential. What multiplies the series?"),
                W(r"$y = \sum_{n=0}^{\infty} a_n (x - r)^n$", r"The parameter $r$ is an exponent, not a shifted center. What power of $x$ multiplies the series?"),
            ],
        ),
        item(
            "mp__qQLuxYClA4_3",
            r"With $p_0 = \lim_{x\to 0} x\,p(x)$ and $q_0 = \lim_{x\to 0} x^2 q(x)$, what is the indicial equation?",
            r"It is the quadratic in $r$ coming from the lowest power of $x$ in the substitution.",
            [
                C(r"$r(r-1) + p_0\, r + q_0 = 0$", r"Yes. The lowest-order terms give $r(r-1) + p_0 r + q_0 = 0$, whose roots set the exponents."),
                W(r"$r^2 + p_0 r + q_0 = 0$", r"The leading second-derivative term gives $r(r-1)$, not $r^2$. What is $r(r-1) + p_0 r$ expanded?"),
                W(r"$r(r-1) + q_0 r + p_0 = 0$", r"The roles of $p_0$ and $q_0$ are swapped. Which constant multiplies $r$?"),
                W(r"$r(r+1) + p_0 r + q_0 = 0$", r"The second derivative contributes $r(r-1)$, not $r(r+1)$. What is the falling factorial here?"),
            ],
        ),
        item(
            "mp__qQLuxYClA4_4",
            r"For $x^2 y'' + x y' - y = 0$, here $p_0 = 1$ and $q_0 = -1$. What are the indicial roots?",
            r"Solve $r(r-1) + r - 1 = 0$, which simplifies to $r^2 - 1 = 0$.",
            [
                C(r"$r = 1$ and $r = -1$", r"Correct. $r(r-1) + r - 1 = r^2 - 1 = 0$, so $r = \pm 1$."),
                W(r"$r = 0$ and $r = 1$", r"Simplify $r(r-1) + r - 1$ first. What quadratic in $r$ results?"),
                W(r"$r = 1$ (repeated)", r"The simplified equation $r^2 - 1 = 0$ has two distinct roots. What are they?"),
                W(r"$r = 2$ and $r = -2$", r"Solve $r^2 - 1 = 0$, not $r^2 - 4 = 0$. What are the square roots of $1$?"),
            ],
        ),
        item(
            "mp__qQLuxYClA4_5",
            r"When should the Frobenius method be used instead of an ordinary power series?",
            r"The choice depends on what kind of point $x_0$ is.",
            [
                C(r"When expanding about a regular singular point", r"Yes. At a regular singular point the plain series can fail, so the $x^r$ factor of Frobenius is needed."),
                W(r"When expanding about an ordinary point", r"At an ordinary point a plain power series already works. What kind of point requires Frobenius?"),
                W(r"When the equation has constant coefficients", r"Constant-coefficient equations use the characteristic equation, not series. Which singular structure calls for Frobenius?"),
                W(r"Only when the solution is a polynomial", r"Frobenius applies broadly, not just to polynomial solutions. What feature of $x_0$ triggers it?"),
            ],
        ),
    ],
)

# === 13.3 video 2 ===========================================================
add_micro(
    "58_qJyfVl-Y",
    'Unit 13, Module 13.3, video 2\n           "Power Series Solutions Part 2, Frobenius Method"',
    [
        item(
            "mp_58_qJyfVl-Y_1",
            r"In standard form $y'' + \frac{3}{2x}y' - \frac{1}{2x^2}y = 0$ gives $p_0 = \tfrac{3}{2}$, $q_0 = -\tfrac{1}{2}$. What are the indicial roots?",
            r"Solve $r(r-1) + \tfrac{3}{2}r - \tfrac{1}{2} = 0$, or $2r^2 + r - 1 = 0$.",
            [
                C(r"$r = \frac{1}{2}$ and $r = -1$", r"Correct. $2r^2 + r - 1 = (2r - 1)(r + 1) = 0$ gives $r = 1/2$ and $r = -1$."),
                W(r"$r = 1$ and $r = -\frac{1}{2}$", r"Factor $2r^2 + r - 1$ carefully. What roots does $(2r - 1)(r + 1) = 0$ give?"),
                W(r"$r = \frac{1}{2}$ and $r = 1$", r"One root is negative. What does the factor $(r + 1)$ contribute?"),
                W(r"$r = -\frac{1}{2}$ and $r = -1$", r"The factor $(2r - 1)$ gives a positive root. What is it?"),
            ],
        ),
        item(
            "mp_58_qJyfVl-Y_2",
            r"When the two indicial roots are distinct and do not differ by an integer, the Frobenius method yields what?",
            r"Each root independently generates its own series solution.",
            [
                C(r"Two independent Frobenius series solutions, one per root", r"Yes. Each root $r$ gives a full series $x^r \sum a_n x^n$, and the two are independent."),
                W(r"A single solution with a logarithm", r"Logarithms enter only in special cases such as a repeated root. What do two well-separated roots give?"),
                W(r"No valid solution", r"Distinct non-integer-separated roots are the cleanest case. How many series solutions result?"),
                W(r"Only a polynomial solution", r"Frobenius solutions are generally infinite series. How many independent ones arise here?"),
            ],
        ),
        item(
            "mp_58_qJyfVl-Y_3",
            r"If the indicial equation has a repeated root, what feature must the second solution include?",
            r"A double root leaves only one series, so a different independent piece is needed.",
            [
                C(r"A logarithmic term, of the form $y_1 \ln x$ plus a second series", r"Yes. A repeated root forces a $\ln x$ term to build a second independent solution."),
                W(r"A second distinct power $x^r$ with a different $r$", r"A repeated root gives only one exponent. What extra function supplies independence?"),
                W(r"An exponential factor $e^{rx}$", r"Frobenius solutions carry powers and possibly logs, not exponentials. What term appears for a double root?"),
                W(r"Nothing extra; the single series suffices", r"One series cannot span a second-order solution space. What must the second solution contain?"),
            ],
        ),
        item(
            "mp_58_qJyfVl-Y_4",
            r"Near $x = 0$, a Frobenius solution behaves like which leading term?",
            r"The lowest-order term of $x^r \sum a_n x^n$ dominates as $x \to 0$.",
            [
                C(r"$a_0 x^r$, the lowest power set by the indicial root", r"Yes. The first nonzero term $a_0 x^r$ controls the behavior near the singular point."),
                W(r"$a_0$, a nonzero constant", r"A constant is the leading term only when $r = 0$. What power dominates for general $r$?"),
                W(r"$a_1 x^{r+1}$", r"The very lowest power comes from $a_0$, not $a_1$. What is the leading term?"),
                W(r"$e^{rx}$", r"Frobenius leading behavior is a power, not an exponential. What is $a_0 x^r$?"),
            ],
        ),
        item(
            "mp_58_qJyfVl-Y_5",
            r"When the indicial roots differ by a positive integer, the smaller root's solution may require what?",
            r"The two series can collide, so a correction sometimes appears.",
            [
                C(r"Possibly a logarithmic term, since the solutions can overlap", r"Yes. Integer-separated roots can make the series interfere, sometimes forcing a $\ln x$ term."),
                W(r"Always a third independent solution", r"A second-order equation has only two independent solutions. What term may the second one need?"),
                W(r"Replacing $x^r$ with $e^{rx}$", r"The Frobenius form keeps powers of $x$. What additional term may be required?"),
                W(r"Nothing; the case is identical to distinct roots", r"Integer separation is a special, trickier case. What can it force into the second solution?"),
            ],
        ),
    ],
)

# === 13.4 video 1 ===========================================================
add_micro(
    "3e5BUrtUKZc",
    'Unit 13, Module 13.4, video 1\n           "Solving ODEs by Series Solutions, Legendre ODE"',
    [
        item(
            "mp_3e5BUrtUKZc_1",
            r"Which equation is Legendre's differential equation?",
            r"It has a $(1 - x^2)$ factor on the second derivative and a parameter $n(n+1)$.",
            [
                C(r"$(1 - x^2)y'' - 2x y' + n(n+1)y = 0$", r"Yes. This is Legendre's equation, with parameter $n(n+1)$ multiplying $y$."),
                W(r"$x^2 y'' + x y' + (x^2 - n^2)y = 0$", r"That is Bessel's equation. Which equation carries the factor $(1 - x^2)$?"),
                W(r"$y'' - 2x y' + 2n y = 0$", r"That is Hermite's equation. What term multiplies $y''$ in Legendre's equation?"),
                W(r"$(1 - x^2)y'' - x y' + n^2 y = 0$", r"That is Chebyshev's equation, with a single $x y'$ and $n^2$. What are the correct middle and last coefficients for Legendre?"),
            ],
        ),
        item(
            "mp_3e5BUrtUKZc_2",
            r"For a non-negative integer $n$, one solution of Legendre's equation is special. What is it?",
            r"The series terminates, leaving a finite expression.",
            [
                C(r"A polynomial of degree $n$, the Legendre polynomial $P_n(x)$", r"Yes. For integer $n$ the series truncates into the degree-$n$ Legendre polynomial."),
                W(r"An exponential $e^{nx}$", r"The terminating solution is polynomial, not exponential. What degree does it have?"),
                W(r"An infinite series that never terminates", r"For integer $n$ one solution does terminate. What kind of function results?"),
                W(r"A trigonometric function $\cos(nx)$", r"That pattern belongs to Chebyshev polynomials. What polynomial does Legendre give?"),
            ],
        ),
        item(
            "mp_3e5BUrtUKZc_3",
            r"The Legendre polynomials begin $P_0 = 1$, $P_1 = x$. What is $P_2(x)$?",
            r"It is the quadratic Legendre polynomial, normalized so $P_2(1) = 1$.",
            [
                C(r"$\frac{1}{2}(3x^2 - 1)$", r"Correct. $P_2(x) = \tfrac{1}{2}(3x^2 - 1)$, which equals $1$ at $x = 1$."),
                W(r"$x^2$", r"The Legendre normalization mixes in a constant and a factor of $3$. What is $\tfrac{1}{2}(3x^2 - 1)$?"),
                W(r"$\frac{1}{2}(3x^2 + 1)$", r"Check the sign of the constant so that $P_2(1) = 1$. Should it be $+1$ or $-1$ inside?"),
                W(r"$2x^2 - 1$", r"That is the Chebyshev polynomial $T_2$. What is the Legendre $P_2$?"),
            ],
        ),
        item(
            "mp_3e5BUrtUKZc_4",
            r"Where are the singular points of Legendre's equation, and is $x = 0$ ordinary?",
            r"Singularities occur where the leading coefficient $(1 - x^2)$ vanishes.",
            [
                C(r"Singular at $x = \pm 1$; $x = 0$ is an ordinary point", r"Yes. The factor $(1 - x^2)$ vanishes at $\pm 1$, but $x = 0$ is ordinary, so a power series works there."),
                W(r"Singular at $x = 0$; expansion fails there", r"The leading coefficient is nonzero at $0$. Where does $(1 - x^2)$ actually vanish?"),
                W(r"No singular points anywhere", r"The coefficient $(1 - x^2)$ does vanish somewhere. At which points?"),
                W(r"Singular at $x = \pm 2$", r"Set $1 - x^2 = 0$ to find the singular points. What values solve that?"),
            ],
        ),
        item(
            "mp_3e5BUrtUKZc_5",
            r"On the interval $[-1, 1]$, the Legendre polynomials $P_m$ and $P_n$ for $m \neq n$ satisfy which property?",
            r"They form an orthogonal family under the standard inner product.",
            [
                C(r"They are orthogonal: $\int_{-1}^{1} P_m P_n\, dx = 0$", r"Yes. Distinct Legendre polynomials are orthogonal on $[-1, 1]$ with weight $1$."),
                W(r"They are equal", r"Different-degree polynomials are not equal. What integral relation do they satisfy?"),
                W(r"Their product integrates to $1$", r"The cross integral vanishes, not equals $1$. What is $\int_{-1}^1 P_m P_n\, dx$ for $m \neq n$?"),
                W(r"They are parallel as vectors", r"Orthogonality is the key relation, the opposite of parallel. What does the cross integral equal?"),
            ],
        ),
    ],
)

# === 13.4 video 2 ===========================================================
add_micro(
    "uLORiAWe63A",
    'Unit 13, Module 13.4, video 2\n           "Bessel Functions and the Frobenius Method"',
    [
        item(
            "mp_uLORiAWe63A_1",
            r"Which equation is Bessel's differential equation of order $\nu$?",
            r"It has $x^2$ on the second derivative and the combination $(x^2 - \nu^2)$ on $y$.",
            [
                C(r"$x^2 y'' + x y' + (x^2 - \nu^2)y = 0$", r"Yes. Bessel's equation of order $\nu$ has exactly this form."),
                W(r"$(1 - x^2)y'' - 2x y' + \nu(\nu+1)y = 0$", r"That is Legendre's equation. Which equation carries $x^2 y''$ and $(x^2 - \nu^2)y$?"),
                W(r"$x^2 y'' + x y' - \nu^2 y = 0$", r"That is an equidimensional equation missing the $x^2 y$ term. What term gives Bessel its oscillatory solutions?"),
                W(r"$x y'' + (1 - x)y' + \nu y = 0$", r"That is Laguerre's equation. What is the correct Bessel form?"),
            ],
        ),
        item(
            "mp_uLORiAWe63A_2",
            r"What type of point is $x = 0$ for Bessel's equation, and which method applies?",
            r"Writing it in standard form shows $x p(x)$ and $x^2 q(x)$ stay analytic.",
            [
                C(r"A regular singular point, so the Frobenius method applies", r"Yes. At $x = 0$ Bessel's equation has a regular singular point, exactly where Frobenius is used."),
                W(r"An ordinary point, so a plain power series applies", r"The coefficients blow up at $0$, so it is not ordinary. What kind of singular point is it?"),
                W(r"An irregular singular point, so no series works", r"The singularity is mild enough for Frobenius. What is the precise classification?"),
                W(r"A removable point with no special treatment", r"The point genuinely matters here. Which method handles a regular singular point?"),
            ],
        ),
        item(
            "mp_uLORiAWe63A_3",
            r"For Bessel's equation of order $\nu$, what are the indicial roots?",
            r"The indicial equation reduces to $r^2 - \nu^2 = 0$.",
            [
                C(r"$r = \nu$ and $r = -\nu$", r"Correct. The indicial equation $r^2 - \nu^2 = 0$ gives $r = \pm \nu$."),
                W(r"$r = \nu$ (repeated)", r"The equation $r^2 - \nu^2 = 0$ has two roots unless $\nu = 0$. What are both?"),
                W(r"$r = \nu^2$ and $r = -\nu^2$", r"Solve $r^2 = \nu^2$, taking the square root. What are the roots?"),
                W(r"$r = 0$ and $r = 1$", r"The roots depend on $\nu$, not fixed integers. What does $r^2 = \nu^2$ give?"),
            ],
        ),
        item(
            "mp_uLORiAWe63A_4",
            r"The Bessel function of the first kind $J_\nu(x)$ with $\nu > 0$ behaves how as $x \to 0$?",
            r"Its leading Frobenius term is proportional to $x^\nu$ with the larger root.",
            [
                C(r"It approaches $0$, growing from zero like $x^\nu$", r"Yes. The first-kind solution uses the root $+\nu$, so $J_\nu(x) \sim x^\nu \to 0$ for $\nu > 0$."),
                W(r"It blows up to infinity", r"The unbounded behavior belongs to the second-kind solution. How does the $+\nu$ root behave at $0$?"),
                W(r"It approaches the constant $1$", r"Only the order-zero case $J_0$ tends to $1$. For $\nu > 0$, what does $x^\nu$ give at $0$?"),
                W(r"It oscillates infinitely near $0$", r"The rapid oscillation happens for large $x$, not near $0$. What is the leading power behavior?"),
            ],
        ),
        item(
            "mp_uLORiAWe63A_5",
            r"Bessel functions naturally arise in which kind of physical problem?",
            r"Think about wave or heat problems with circular or cylindrical symmetry.",
            [
                C(r"Vibrations and heat flow with cylindrical symmetry, such as a circular drumhead", r"Yes. Separating variables in cylindrical geometry yields Bessel's equation."),
                W(r"Straight-line motion under constant force", r"That gives polynomials, not Bessel functions. What geometry produces Bessel's equation?"),
                W(r"Radioactive decay", r"Decay is governed by simple exponentials. Which symmetric geometry leads to Bessel functions?"),
                W(r"Linear population growth", r"That is a first-order model, unrelated to Bessel. What symmetry gives rise to these functions?"),
            ],
        ),
    ],
)

# === 13.5 video 1 ===========================================================
add_micro(
    "1WlTe-DzO5E",
    'Unit 13, Module 13.5, video 1\n           "Hermite and Laguerre Polynomials, Differential Equations"',
    [
        item(
            "mp_1WlTe-DzO5E_1",
            r"Which equation is Hermite's differential equation?",
            r"It has a constant leading coefficient, a $-2x y'$ term, and parameter $2n$.",
            [
                C(r"$y'' - 2x y' + 2n y = 0$", r"Yes. Hermite's equation is $y'' - 2x y' + 2n y = 0$, terminating into Hermite polynomials for integer $n$."),
                W(r"$x y'' + (1 - x)y' + n y = 0$", r"That is Laguerre's equation. Which equation has the $-2x y'$ term?"),
                W(r"$(1 - x^2)y'' - 2x y' + n(n+1)y = 0$", r"That is Legendre's equation. What is the Hermite form?"),
                W(r"$y'' + 2x y' + 2n y = 0$", r"The sign on the first-derivative term is negative for Hermite. What is the correct middle term?"),
            ],
        ),
        item(
            "mp_1WlTe-DzO5E_2",
            r"The Hermite polynomials (physicists' convention) begin $H_0 = 1$, $H_1 = 2x$. What is $H_2(x)$?",
            r"Use the recurrence $H_{n+1} = 2x H_n - 2n H_{n-1}$ with $n = 1$.",
            [
                C(r"$4x^2 - 2$", r"Correct. $H_2 = 2x H_1 - 2H_0 = 2x(2x) - 2 = 4x^2 - 2$."),
                W(r"$x^2 - 1$", r"Apply $H_2 = 2x H_1 - 2H_0$ with $H_1 = 2x$. What does $2x(2x) - 2$ give?"),
                W(r"$4x^2$", r"The recurrence subtracts $2H_0 = 2$. What is $4x^2 - 2$?"),
                W(r"$2x^2 - 1$", r"That is the Chebyshev $T_2$. Using the Hermite recurrence, what is $H_2$?"),
            ],
        ),
        item(
            "mp_1WlTe-DzO5E_3",
            r"Which equation is Laguerre's differential equation?",
            r"It has $x$ on the second derivative and a $(1 - x)$ factor on the first.",
            [
                C(r"$x y'' + (1 - x)y' + n y = 0$", r"Yes. Laguerre's equation is $x y'' + (1 - x)y' + n y = 0$."),
                W(r"$y'' - 2x y' + 2n y = 0$", r"That is Hermite's equation. Which one has $x y''$ and the $(1 - x)$ factor?"),
                W(r"$x^2 y'' + x y' + (x^2 - n^2)y = 0$", r"That is Bessel's equation. What is the Laguerre form?"),
                W(r"$x y'' + (1 + x)y' + n y = 0$", r"The sign inside the first-derivative coefficient is $(1 - x)$, not $(1 + x)$. What is the correct factor?"),
            ],
        ),
        item(
            "mp_1WlTe-DzO5E_4",
            r"Hermite polynomials are orthogonal on $(-\infty, \infty)$ with respect to which weight function?",
            r"The weight is the Gaussian tied to the Hermite recurrence.",
            [
                C(r"$e^{-x^2}$", r"Yes. Hermite polynomials are orthogonal with the Gaussian weight $e^{-x^2}$."),
                W(r"$e^{-x}$", r"That weight belongs to Laguerre polynomials on $[0, \infty)$. What Gaussian weight pairs with Hermite?"),
                W(r"$\frac{1}{\sqrt{1 - x^2}}$", r"That is the Chebyshev weight on $[-1, 1]$. What weight does Hermite use on the whole line?"),
                W(r"$1$", r"Weight $1$ is for Legendre on $[-1, 1]$. Which weight makes Hermite integrals converge on the whole line?"),
            ],
        ),
        item(
            "mp_1WlTe-DzO5E_5",
            r"In which physical setting do Hermite polynomials famously appear?",
            r"Think of the bound-state wavefunctions of a familiar quadratic-potential system.",
            [
                C(r"The quantum harmonic oscillator wavefunctions", r"Yes. The stationary states of the quantum harmonic oscillator involve Hermite polynomials times a Gaussian."),
                W(r"The hydrogen atom radial equation", r"That setting involves Laguerre polynomials. Which quadratic-potential system uses Hermite?"),
                W(r"Black-body radiation", r"That is governed by Planck's law, not Hermite polynomials. Which oscillator problem uses them?"),
                W(r"Radioactive decay chains", r"Those are simple exponential processes. Which quantum system features Hermite polynomials?"),
            ],
        ),
    ],
)

# === 13.5 video 2 ===========================================================
add_micro(
    "sHlIF-YZ9Yw",
    'Unit 13, Module 13.5, video 2\n           "Chebyshev Differential Equations"',
    [
        item(
            "mp_sHlIF-YZ9Yw_1",
            r"Which equation is Chebyshev's differential equation?",
            r"It has the $(1 - x^2)$ factor like Legendre but a single $x y'$ term and parameter $n^2$.",
            [
                C(r"$(1 - x^2)y'' - x y' + n^2 y = 0$", r"Yes. Chebyshev's equation has one $x y'$ term and $n^2 y$, distinguishing it from Legendre."),
                W(r"$(1 - x^2)y'' - 2x y' + n(n+1)y = 0$", r"That is Legendre's equation, with $2x y'$ and $n(n+1)$. What are the Chebyshev coefficients?"),
                W(r"$x^2 y'' + x y' + (x^2 - n^2)y = 0$", r"That is Bessel's equation. Which equation pairs $(1 - x^2)$ with a single $x y'$?"),
                W(r"$y'' - 2x y' + 2n y = 0$", r"That is Hermite's equation. What is the Chebyshev form?"),
            ],
        ),
        item(
            "mp_sHlIF-YZ9Yw_2",
            r"The Chebyshev polynomials of the first kind begin $T_0 = 1$, $T_1 = x$. What is $T_2(x)$?",
            r"Use the recurrence $T_{n+1} = 2x T_n - T_{n-1}$ with $n = 1$.",
            [
                C(r"$2x^2 - 1$", r"Correct. $T_2 = 2x T_1 - T_0 = 2x^2 - 1$."),
                W(r"$x^2$", r"The recurrence $2x T_1 - T_0$ subtracts $1$. What is $2x^2 - 1$?"),
                W(r"$4x^2 - 2$", r"That is the Hermite $H_2$. Using $T_{n+1} = 2x T_n - T_{n-1}$, what is $T_2$?"),
                W(r"$\frac{1}{2}(3x^2 - 1)$", r"That is the Legendre $P_2$. What does the Chebyshev recurrence give?"),
            ],
        ),
        item(
            "mp_sHlIF-YZ9Yw_3",
            r"Chebyshev polynomials satisfy the elegant identity $T_n(\cos\theta) = ?$",
            r"They are designed so a cosine substitution collapses them to a single cosine.",
            [
                C(r"$\cos(n\theta)$", r"Yes. Substituting $x = \cos\theta$ gives $T_n(\cos\theta) = \cos(n\theta)$, the defining trigonometric identity."),
                W(r"$\cos^n\theta$", r"It is the cosine of $n\theta$, not the $n$-th power of cosine. What does the recurrence produce under $x = \cos\theta$?"),
                W(r"$n\cos\theta$", r"The result is a cosine of a multiple angle, not a multiple of cosine. What is $T_n(\cos\theta)$?"),
                W(r"$\sin(n\theta)$", r"First-kind Chebyshev gives a cosine; sine relates to the second kind. What is the identity?"),
            ],
        ),
        item(
            "mp_sHlIF-YZ9Yw_4",
            r"Chebyshev polynomials of the first kind are orthogonal on $[-1, 1]$ with which weight function?",
            r"The weight comes from the Jacobian of the substitution $x = \cos\theta$.",
            [
                C(r"$\frac{1}{\sqrt{1 - x^2}}$", r"Yes. The Chebyshev weight is $1/\sqrt{1 - x^2}$, matching the $x = \cos\theta$ substitution."),
                W(r"$1$", r"Weight $1$ is for Legendre. What weight arises from $x = \cos\theta$?"),
                W(r"$e^{-x^2}$", r"That Gaussian weight belongs to Hermite on the whole line. What is the Chebyshev weight on $[-1, 1]$?"),
                W(r"$e^{-x}$", r"That weight is for Laguerre on $[0, \infty)$. Which weight pairs with Chebyshev?"),
            ],
        ),
        item(
            "mp_sHlIF-YZ9Yw_5",
            r"Why are Chebyshev polynomials especially valued in numerical approximation?",
            r"Their equal-ripple behavior controls the worst-case error across the interval.",
            [
                C(r"They minimize the maximum error, spreading it evenly (the equioscillation property)", r"Yes. Chebyshev polynomials equioscillate, which makes them ideal for minimizing worst-case approximation error."),
                W(r"They are the only polynomials that are continuous", r"All polynomials are continuous, so that is no advantage. What error property makes Chebyshev special?"),
                W(r"They grow fastest outside $[-1, 1]$", r"Fast growth outside the interval is not the approximation advantage. What do they do to the error inside it?"),
                W(r"They have no real roots", r"Chebyshev polynomials do have real roots in $[-1, 1]$. What worst-case property makes them useful?"),
            ],
        ),
    ],
)

# ============================================================================
# UNIT 14 MICRO PRACTICE
# ============================================================================

# === 14.1 video 1 ===========================================================
add_micro(
    "k7RM-ot2NWY",
    'Unit 14, Module 14.1, video 1\n           "Linear combinations, span, and basis vectors, Chapter 2"',
    [
        item(
            "mp_k7RM-ot2NWY_1",
            r"What is a linear combination of vectors $\mathbf{v}$ and $\mathbf{w}$?",
            r"It is built by scaling each vector and adding the results.",
            [
                C(r"$a\mathbf{v} + b\mathbf{w}$ for scalars $a$ and $b$", r"Yes. A linear combination scales each vector by a scalar and adds, giving $a\mathbf{v} + b\mathbf{w}$."),
                W(r"$\mathbf{v}\cdot\mathbf{w}$, their dot product", r"The dot product returns a single number, not a combined vector. What operation scales and adds the vectors?"),
                W(r"$\mathbf{v}\times\mathbf{w}$, their cross product", r"The cross product is a specific perpendicular vector, not a general combination. What form uses arbitrary scalars?"),
                W(r"$\mathbf{v}^a \mathbf{w}^b$", r"Vectors are not raised to powers. What combination uses scalar multiples and addition?"),
            ],
        ),
        item(
            "mp_k7RM-ot2NWY_2",
            r"Compute the linear combination $2(1, 0) + 3(0, 1)$.",
            r"Scale each vector, then add componentwise.",
            [
                C(r"$(2, 3)$", r"Correct. $2(1,0) = (2,0)$ and $3(0,1) = (0,3)$, which sum to $(2,3)$."),
                W(r"$(3, 2)$", r"Keep the components in order: the first scalar scales the first basis vector. What is $(2,0) + (0,3)$?"),
                W(r"$(5, 5)$", r"The scalars do not add together; they scale separate directions. What is $2(1,0) + 3(0,1)$ componentwise?"),
                W(r"$(6, 0)$", r"The two vectors point in different directions, so they do not merge into one axis. What is the componentwise sum?"),
            ],
        ),
        item(
            "mp_k7RM-ot2NWY_3",
            r"What is the span of a set of vectors?",
            r"It is everything you can reach by combining them.",
            [
                C(r"The set of all linear combinations of those vectors", r"Yes. The span is every vector reachable as a linear combination of the given set."),
                W(r"Only the vectors themselves", r"The span includes far more than the listed vectors. What set of reachable vectors does it describe?"),
                W(r"The longest vector in the set", r"Span is a whole set of vectors, not a single longest one. What collection does it form?"),
                W(r"The dot products of the vectors", r"Span is about combinations, not dot products. What operation generates the span?"),
            ],
        ),
        item(
            "mp_k7RM-ot2NWY_4",
            r"What is the span of two nonzero vectors in $\mathbb{R}^2$ that do not lie on the same line?",
            r"Two independent directions in the plane reach everywhere in it.",
            [
                C(r"All of $\mathbb{R}^2$ (the entire plane)", r"Yes. Two linearly independent vectors in the plane span all of $\mathbb{R}^2$."),
                W(r"A single line through the origin", r"A single line is spanned by parallel vectors. What do two independent directions reach?"),
                W(r"Only the two vectors", r"Linear combinations reach much more than the two vectors. What region of the plane is covered?"),
                W(r"A single point, the origin", r"Only the zero vectors span just the origin. What do two independent vectors span?"),
            ],
        ),
        item(
            "mp_k7RM-ot2NWY_5",
            r"What two conditions must a set of vectors satisfy to be a basis for a space?",
            r"A basis must reach everything, with no redundancy.",
            [
                C(r"It must be linearly independent and span the space", r"Yes. A basis spans the space and has no redundant vectors, that is, it is linearly independent."),
                W(r"It must contain the zero vector", r"The zero vector makes a set dependent, which is disallowed. What two properties define a basis?"),
                W(r"It must be orthogonal", r"Orthogonality is optional, not required for a basis. What two conditions are essential?"),
                W(r"It must have infinitely many vectors", r"A finite-dimensional basis is finite. What spanning and independence conditions are needed?"),
            ],
        ),
    ],
)

# === 14.1 video 2 ===========================================================
add_micro(
    "kYB8IZa5AuE",
    'Unit 14, Module 14.1, video 2\n           "Linear transformations and matrices, Chapter 3"',
    [
        item(
            "mp_kYB8IZa5AuE_1",
            r"Which property must a linear transformation $T$ satisfy?",
            r"Linearity means it respects vector addition and scalar multiplication.",
            [
                C(r"$T(a\mathbf{u} + b\mathbf{v}) = aT(\mathbf{u}) + bT(\mathbf{v})$", r"Yes. A linear transformation preserves linear combinations, which is exactly this identity."),
                W(r"$T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u})\,T(\mathbf{v})$", r"Linear maps add outputs, they do not multiply them. What identity preserves combinations?"),
                W(r"$T(\mathbf{u}) = \mathbf{u} + \mathbf{c}$ for a fixed $\mathbf{c} \neq \mathbf{0}$", r"A nonzero shift moves the origin, breaking linearity. What identity must hold instead?"),
                W(r"$T(\mathbf{u}) = \|\mathbf{u}\|$", r"That returns a scalar length, not a linear vector map. What property defines linearity?"),
            ],
        ),
        item(
            "mp_kYB8IZa5AuE_2",
            r"For a matrix representing a linear transformation, what do its columns represent?",
            r"Feed in the standard basis vectors and see where they land.",
            [
                C(r"The images of the standard basis vectors under the transformation", r"Yes. Column $j$ is where the $j$-th basis vector is sent, which fully determines the map."),
                W(r"The eigenvalues of the transformation", r"Eigenvalues come from the characteristic equation, not directly from columns. What do the columns show geometrically?"),
                W(r"The lengths of the input vectors", r"Columns encode directions of basis images, not input lengths. What landing points do they record?"),
                W(r"The fixed points of the transformation", r"Columns are basis images, not fixed points. Where does each basis vector go?"),
            ],
        ),
        item(
            "mp_kYB8IZa5AuE_3",
            r"Apply the transformation with rows $(2, 0)$ and $(0, 3)$ to the vector $(1, 1)$.",
            r"Each output component is a row dotted with the input.",
            [
                C(r"$(2, 3)$", r"Correct. Row $(2,0)\cdot(1,1) = 2$ and row $(0,3)\cdot(1,1) = 3$, giving $(2,3)$."),
                W(r"$(2, 2)$", r"The second row is $(0, 3)$, scaling the second component by $3$. What is $(0,3)\cdot(1,1)$?"),
                W(r"$(3, 2)$", r"Keep the row order: the first row gives the first output. What is $(2,0)\cdot(1,1)$?"),
                W(r"$(5, 5)$", r"Each output uses one row only, not both summed. What is row one dotted with the input?"),
            ],
        ),
        item(
            "mp_kYB8IZa5AuE_4",
            r"Apply the transformation with rows $(1, 2)$ and $(3, 4)$ to the vector $(1, 1)$.",
            r"Dot each row with $(1, 1)$.",
            [
                C(r"$(3, 7)$", r"Correct. $(1,2)\cdot(1,1) = 3$ and $(3,4)\cdot(1,1) = 7$, giving $(3, 7)$."),
                W(r"$(7, 3)$", r"Keep the rows in order. What is the first row $(1,2)$ dotted with $(1,1)$?"),
                W(r"$(3, 4)$", r"The second component uses row $(3, 4)$ dotted with $(1, 1)$, summing the entries. What is $3 + 4$?"),
                W(r"$(1, 3)$", r"Each output adds both row entries since the input is $(1,1)$. What are $1 + 2$ and $3 + 4$?"),
            ],
        ),
        item(
            "mp_kYB8IZa5AuE_5",
            r"How is the composition of two linear transformations represented with matrices?",
            r"Doing one transformation after another corresponds to a single combined operation.",
            [
                C(r"By the product of their matrices", r"Yes. Composing transformations corresponds to multiplying the matrices, applied right to left."),
                W(r"By the sum of their matrices", r"Adding matrices represents adding transformations, not composing them. What operation chains them?"),
                W(r"By the dot product of their columns", r"Composition is a full matrix operation, not a single dot product. What matrix operation applies?"),
                W(r"By swapping their rows and columns", r"That describes a transpose, not composition. How are two maps combined into one matrix?"),
            ],
        ),
    ],
)

# === 14.2 video 1 ===========================================================
add_micro(
    "Ip3X9LOh2dk",
    'Unit 14, Module 14.2, video 1\n           "The determinant, Chapter 6"',
    [
        item(
            "mp_Ip3X9LOh2dk_1",
            r"Geometrically, what does the determinant of a $2\times 2$ matrix measure?",
            r"Think about how the transformation rescales areas.",
            [
                C(r"The factor by which areas are scaled by the transformation", r"Yes. The determinant is the area-scaling factor of the linear transformation."),
                W(r"The total length of the column vectors", r"The determinant measures area change, not summed lengths. What does it scale?"),
                W(r"The angle between the column vectors", r"Angle is not what the determinant reports. What geometric quantity does it scale?"),
                W(r"The number of eigenvalues", r"Eigenvalue count is fixed by size, not the determinant. What area effect does it capture?"),
            ],
        ),
        item(
            "mp_Ip3X9LOh2dk_2",
            r"For a matrix with rows $(a, b)$ and $(c, d)$, what is the determinant?",
            r"It is the difference of the two diagonal products.",
            [
                C(r"$ad - bc$", r"Yes. The $2\times 2$ determinant is the main diagonal product minus the off-diagonal product, $ad - bc$."),
                W(r"$ab - cd$", r"The determinant pairs entries across the diagonals, not along rows. What is $ad - bc$?"),
                W(r"$ad + bc$", r"The off-diagonal product is subtracted, not added. What is the correct sign?"),
                W(r"$ac - bd$", r"Group the entries by diagonal: $a$ with $d$, and $b$ with $c$. What is $ad - bc$?"),
            ],
        ),
        item(
            "mp_Ip3X9LOh2dk_3",
            r"Compute the determinant of the matrix with rows $(3, 1)$ and $(2, 4)$.",
            r"Use $ad - bc$ with $a = 3$, $b = 1$, $c = 2$, $d = 4$.",
            [
                C(r"$10$", r"Correct. $ad - bc = 3\cdot 4 - 1\cdot 2 = 12 - 2 = 10$."),
                W(r"$14$", r"The off-diagonal product is subtracted, not added. What is $12 - 2$?"),
                W(r"$12$", r"Do not forget to subtract $bc = 1\cdot 2$. What is $12 - 2$?"),
                W(r"$11$", r"Recompute $bc = 1 \cdot 2 = 2$, then subtract. What is $12 - 2$?"),
            ],
        ),
        item(
            "mp_Ip3X9LOh2dk_4",
            r"What does a determinant of $0$ tell you about a linear transformation?",
            r"Zero area scaling means the output is flattened.",
            [
                C(r"It collapses space to a lower dimension, so the columns are linearly dependent", r"Yes. A zero determinant squishes the plane onto a line or point, signaling dependent columns."),
                W(r"It rotates space without changing area", r"A pure rotation has determinant $1$, not $0$. What does zero area scaling do to the space?"),
                W(r"It doubles every area", r"Doubling is determinant $2$. What does a factor of $0$ do to areas?"),
                W(r"It leaves every vector fixed", r"Fixing all vectors is the identity, with determinant $1$. What does determinant $0$ imply?"),
            ],
        ),
        item(
            "mp_Ip3X9LOh2dk_5",
            r"What does a negative determinant indicate about a linear transformation?",
            r"The sign tracks whether orientation is preserved.",
            [
                C(r"The transformation reverses orientation (it flips the plane)", r"Yes. A negative determinant means orientation is reversed, like a reflection, while its magnitude still gives area scaling."),
                W(r"The areas become negative", r"Area magnitude stays positive; the sign tracks orientation. What does the negative sign flip?"),
                W(r"The transformation is not invertible", r"Invertibility fails only at determinant $0$, not for negative values. What does the sign indicate?"),
                W(r"All eigenvalues are negative", r"The determinant sign is the product of eigenvalues, not each one. What orientation effect does a negative sign signal?"),
            ],
        ),
    ],
)

# === 14.2 video 2 ===========================================================
add_micro(
    "P2LTAUO1TdA",
    'Unit 14, Module 14.2, video 2\n           "Change of basis, Chapter 13"',
    [
        item(
            "mp_P2LTAUO1TdA_1",
            r"What does a change of basis matrix do?",
            r"It translates the description of a vector between two coordinate systems.",
            [
                C(r"It converts a vector's coordinates from one basis to another", r"Yes. A change of basis matrix relabels the same vector in a different coordinate system."),
                W(r"It changes the actual vector into a different vector", r"The underlying vector is unchanged; only its coordinates change. What does the matrix translate?"),
                W(r"It computes the length of a vector", r"Length is not what a change of basis produces. What does it convert between coordinate systems?"),
                W(r"It always rotates vectors by ninety degrees", r"A change of basis is general, not a fixed rotation. What does it do to coordinates?"),
            ],
        ),
        item(
            "mp_P2LTAUO1TdA_2",
            r"In a change of basis matrix, what do the columns contain?",
            r"They record where the new basis vectors sit in the old language.",
            [
                C(r"The new basis vectors written in the old coordinates", r"Yes. Each column is a new basis vector expressed in terms of the original basis."),
                W(r"The eigenvalues of the transformation", r"Eigenvalues are separate from a basis change. What vectors fill the columns?"),
                W(r"The lengths of the old basis vectors", r"Columns hold full vectors, not scalar lengths. Which vectors do they store?"),
                W(r"The dot products of the bases", r"Columns are basis vectors, not dot products. What do they express?"),
            ],
        ),
        item(
            "mp_P2LTAUO1TdA_3",
            r"To express a transformation $A$ in a new basis given by change of basis matrix $P$, which formula applies?",
            r"You translate into the new basis, apply $A$, then translate back.",
            [
                C(r"$P^{-1} A P$", r"Yes. The similarity transform $P^{-1} A P$ rewrites $A$ in the new coordinate system."),
                W(r"$P A P^{-1}$", r"Check the order of translating in and out. Which factor converts an input from the new basis first?"),
                W(r"$A P$", r"You must also translate back after applying $A$. What completes the conjugation?"),
                W(r"$P^{-1} A$", r"The input must first be converted into the original basis. What factor goes on the right?"),
            ],
        ),
        item(
            "mp_P2LTAUO1TdA_4",
            r"A matrix and its representation in a new basis describe what, relative to each other?",
            r"Only the coordinate language changes, not the underlying action.",
            [
                C(r"The same linear transformation in different coordinates", r"Yes. Similar matrices are the same transformation viewed through different bases."),
                W(r"Two completely unrelated transformations", r"They are tightly linked by the basis change. What single object do they both describe?"),
                W(r"A transformation and its inverse", r"A basis change is not inversion. What stays the same between the two representations?"),
                W(r"A transformation and its transpose", r"Similarity is not transposition. What underlying map do similar matrices share?"),
            ],
        ),
        item(
            "mp_P2LTAUO1TdA_5",
            r"Why is choosing an eigenbasis a particularly useful change of basis?",
            r"In the right basis the transformation acts as simple independent scalings.",
            [
                C(r"In an eigenbasis the matrix becomes diagonal, so the action is just scaling each axis", r"Yes. Using eigenvectors as the basis diagonalizes the matrix, simplifying powers and exponentials."),
                W(r"In an eigenbasis the matrix becomes the zero matrix", r"Diagonalization scales the axes, it does not annihilate them. What special form does the matrix take?"),
                W(r"An eigenbasis makes the determinant equal $1$", r"The determinant is unchanged by a basis change. What simpler structure does the matrix gain?"),
                W(r"An eigenbasis removes all eigenvalues", r"Eigenvalues are preserved and become the diagonal entries. What form does the matrix take?"),
            ],
        ),
    ],
)

# === 14.3 video 1 ===========================================================
add_micro(
    "PFDu9oVAE-g",
    'Unit 14, Module 14.3, video 1\n           "Eigenvectors and eigenvalues, Chapter 14"',
    [
        item(
            "mp_PFDu9oVAE-g_1",
            r"What equation defines an eigenvector $\mathbf{v}$ of a matrix $A$ with eigenvalue $\lambda$?",
            r"The transformation only stretches the eigenvector, leaving its direction fixed.",
            [
                C(r"$A\mathbf{v} = \lambda\mathbf{v}$ with $\mathbf{v} \neq \mathbf{0}$", r"Yes. An eigenvector is a nonzero vector that the matrix only scales, by the factor $\lambda$."),
                W(r"$A\mathbf{v} = \mathbf{0}$ with $\mathbf{v} \neq \mathbf{0}$", r"That defines a null-space vector, the special case $\lambda = 0$. What is the general eigenvalue equation?"),
                W(r"$A\mathbf{v} = \mathbf{v} + \lambda$", r"You cannot add a scalar to a vector. How should $\lambda$ act on $\mathbf{v}$?"),
                W(r"$A + \lambda\mathbf{v} = \mathbf{0}$", r"The matrix multiplies the vector, it is not added to it. What is the correct multiplicative relation?"),
            ],
        ),
        item(
            "mp_PFDu9oVAE-g_2",
            r"Geometrically, what is special about an eigenvector under its transformation?",
            r"Most vectors get knocked off their line; eigenvectors do not.",
            [
                C(r"It stays on its own line through the origin, only stretched or compressed", r"Yes. An eigenvector keeps its direction (its span), being scaled by the eigenvalue."),
                W(r"It is rotated to a perpendicular direction", r"Eigenvectors keep their direction rather than rotating. What happens to their line?"),
                W(r"It is sent to the zero vector", r"That only happens for eigenvalue $0$, a special case. What generally happens to an eigenvector's direction?"),
                W(r"It doubles in number of components", r"A transformation does not change the dimension of a vector. What stays fixed about an eigenvector?"),
            ],
        ),
        item(
            "mp_PFDu9oVAE-g_3",
            r"The eigenvalues of $A$ are found by solving which equation?",
            r"Eigenvalues make $A - \lambda I$ fail to be invertible.",
            [
                C(r"$\det(A - \lambda I) = 0$", r"Yes. Eigenvalues are the roots of the characteristic equation $\det(A - \lambda I) = 0$."),
                W(r"$\det(A) = \lambda$", r"The eigenvalues come from a determinant set to zero, not the determinant itself. What is the characteristic equation?"),
                W(r"$A - \lambda I = 0$", r"Setting the whole matrix to zero is too strong; only its determinant must vanish. What is the correct condition?"),
                W(r"$\text{tr}(A) = \lambda$", r"The trace is the sum of eigenvalues, not the defining equation. What determinant condition gives each $\lambda$?"),
            ],
        ),
        item(
            "mp_PFDu9oVAE-g_4",
            r"What are the eigenvalues of the matrix with rows $(3, 0)$ and $(0, 5)$?",
            r"For a diagonal matrix the eigenvalues sit on the diagonal.",
            [
                C(r"$3$ and $5$", r"Correct. A diagonal matrix has its diagonal entries as eigenvalues, here $3$ and $5$."),
                W(r"$0$ and $0$", r"The off-diagonal zeros are not the eigenvalues. Which entries does a diagonal matrix expose as eigenvalues?"),
                W(r"$8$ and $0$", r"The trace $8$ is the sum, not an eigenvalue. What are the individual diagonal entries?"),
                W(r"$15$ and $1$", r"The product $15$ is the determinant, not an eigenvalue. What sit on the diagonal?"),
            ],
        ),
        item(
            "mp_PFDu9oVAE-g_5",
            r"What are the eigenvalues of the upper triangular matrix with rows $(2, 7)$ and $(0, 4)$?",
            r"A triangular matrix shares the diagonal-eigenvalue property.",
            [
                C(r"$2$ and $4$", r"Correct. A triangular matrix has its diagonal entries as eigenvalues, here $2$ and $4$; the entry $7$ does not affect them."),
                W(r"$2$ and $7$", r"The off-diagonal entry $7$ is not an eigenvalue of a triangular matrix. Which entries are?"),
                W(r"$7$ and $4$", r"The eigenvalues are the diagonal entries, not the off-diagonal one. What are they?"),
                W(r"$6$ and $8$", r"Those are not the diagonal entries. For a triangular matrix, where do the eigenvalues sit?"),
            ],
        ),
    ],
)

# === 14.3 video 2 ===========================================================
add_micro(
    "e50Bj7jn9IQ",
    'Unit 14, Module 14.3, video 2\n           "A quick trick for computing eigenvalues, Chapter 15"',
    [
        item(
            "mp_e50Bj7jn9IQ_1",
            r"For a $2\times 2$ matrix, the eigenvalues are the roots of which quadratic?",
            r"The characteristic polynomial is built from the trace and determinant.",
            [
                C(r"$\lambda^2 - (\text{tr}\,A)\lambda + \det A = 0$", r"Yes. For a $2\times 2$ matrix the characteristic equation is $\lambda^2 - (\text{tr})\lambda + \det = 0$."),
                W(r"$\lambda^2 + (\text{tr}\,A)\lambda + \det A = 0$", r"The trace term carries a minus sign. What is the correct sign on the $\lambda$ term?"),
                W(r"$\lambda^2 - (\det A)\lambda + \text{tr}\,A = 0$", r"The trace and determinant roles are swapped. Which one multiplies $\lambda$?"),
                W(r"$\lambda^2 - \text{tr}\,A - \det A = 0$", r"The trace must multiply $\lambda$, not stand alone. What is the proper quadratic?"),
            ],
        ),
        item(
            "mp_e50Bj7jn9IQ_2",
            r"The quick trick writes eigenvalues as $\lambda = m \pm \sqrt{m^2 - p}$. What are $m$ and $p$?",
            r"One is half the trace (the mean of the eigenvalues), the other is the determinant.",
            [
                C(r"$m = \tfrac{1}{2}\text{tr}\,A$ (the mean) and $p = \det A$ (the product)", r"Yes. The mean of the eigenvalues is half the trace, and their product is the determinant."),
                W(r"$m = \text{tr}\,A$ and $p = \det A$", r"The mean is half the trace, not the full trace. What is $m$?"),
                W(r"$m = \det A$ and $p = \tfrac{1}{2}\text{tr}\,A$", r"The roles are reversed. Which quantity is the mean and which is the product?"),
                W(r"$m = \tfrac{1}{2}\det A$ and $p = \text{tr}\,A$", r"The mean comes from the trace and the product from the determinant. What are $m$ and $p$?"),
            ],
        ),
        item(
            "mp_e50Bj7jn9IQ_3",
            r"Use the trick on the matrix with rows $(2, 1)$ and $(1, 2)$: trace $4$, determinant $3$. What are the eigenvalues?",
            r"Compute $m = 2$, $p = 3$, then $\lambda = m \pm \sqrt{m^2 - p}$.",
            [
                C(r"$3$ and $1$", r"Correct. $m = 2$, $p = 3$, so $\lambda = 2 \pm \sqrt{4 - 3} = 2 \pm 1$, giving $3$ and $1$."),
                W(r"$4$ and $0$", r"Use $m = 2$ and $\sqrt{m^2 - p} = \sqrt{1} = 1$. What is $2 \pm 1$?"),
                W(r"$2$ and $2$", r"The discriminant $m^2 - p = 1$ is nonzero, so the roots differ. What is $2 \pm 1$?"),
                W(r"$3$ and $-1$", r"Both roots are $2$ plus or minus $1$. What is $2 - 1$?"),
            ],
        ),
        item(
            "mp_e50Bj7jn9IQ_4",
            r"For any matrix, the sum of the eigenvalues equals which quantity?",
            r"It is the invariant formed by adding the diagonal entries.",
            [
                C(r"The trace of the matrix", r"Yes. The eigenvalues sum to the trace, the sum of the diagonal entries."),
                W(r"The determinant of the matrix", r"The determinant equals the product of eigenvalues, not their sum. What invariant gives the sum?"),
                W(r"The rank of the matrix", r"Rank counts independent directions, unrelated to the eigenvalue sum. Which diagonal quantity matches the sum?"),
                W(r"Always zero", r"The sum is generally nonzero. Which matrix invariant equals the eigenvalue sum?"),
            ],
        ),
        item(
            "mp_e50Bj7jn9IQ_5",
            r"Use the trick on the matrix with rows $(3, 1)$ and $(1, 3)$: trace $6$, determinant $8$. What are the eigenvalues?",
            r"Compute $m = 3$, $p = 8$, then $\lambda = m \pm \sqrt{m^2 - p}$.",
            [
                C(r"$4$ and $2$", r"Correct. $m = 3$, $p = 8$, so $\lambda = 3 \pm \sqrt{9 - 8} = 3 \pm 1$, giving $4$ and $2$."),
                W(r"$6$ and $8$", r"The trace and determinant are not themselves the eigenvalues. What is $3 \pm 1$?"),
                W(r"$3$ and $3$", r"The discriminant $9 - 8 = 1$ is nonzero, so the roots split. What is $3 \pm 1$?"),
                W(r"$5$ and $1$", r"Check the discriminant: $\sqrt{9 - 8} = 1$, not $2$. What is $3 \pm 1$?"),
            ],
        ),
    ],
)

# === 14.4 video 1 ===========================================================
add_micro(
    "QYS-ML_vn4k",
    'Unit 14, Module 14.4, video 1\n           "Motivating Eigenvalues and Eigenvectors with Differential Equations"',
    [
        item(
            "mp_QYS-ML_vn4k_1",
            r"For the linear system $\mathbf{x}' = A\mathbf{x}$, what trial solution leads to the eigenvalue problem?",
            r"Guess a fixed direction whose size changes exponentially in time.",
            [
                C(r"$\mathbf{x} = e^{\lambda t}\mathbf{v}$ for a constant vector $\mathbf{v}$", r"Yes. Substituting this trial turns the system into the eigenvalue equation for $A$."),
                W(r"$\mathbf{x} = \lambda t\,\mathbf{v}$", r"Linear-in-$t$ growth does not solve a first-order linear system. What time dependence does?"),
                W(r"$\mathbf{x} = e^{\lambda t}$ (a scalar)", r"The state is a vector, so the trial needs a constant direction $\mathbf{v}$. What is the full vector trial?"),
                W(r"$\mathbf{x} = \cos(\lambda t)\mathbf{v}$", r"The natural trial for a first-order system is exponential, not cosine. What form should $\mathbf{x}$ take?"),
            ],
        ),
        item(
            "mp_QYS-ML_vn4k_2",
            r"Substituting $\mathbf{x} = e^{\lambda t}\mathbf{v}$ into $\mathbf{x}' = A\mathbf{x}$ and cancelling $e^{\lambda t}$ gives what?",
            r"The derivative brings down a $\lambda$, and the exponential factors out.",
            [
                C(r"$A\mathbf{v} = \lambda\mathbf{v}$, the eigenvalue problem", r"Yes. The substitution reduces to $\lambda\mathbf{v} = A\mathbf{v}$, exactly the eigenvalue equation."),
                W(r"$A\mathbf{v} = \mathbf{0}$", r"The left side differentiates to $\lambda e^{\lambda t}\mathbf{v}$, leaving a $\lambda\mathbf{v}$ term. What equation results?"),
                W(r"$\mathbf{v}' = \lambda\mathbf{v}$", r"The vector $\mathbf{v}$ is constant, so it has no derivative. What relation between $A\mathbf{v}$ and $\lambda\mathbf{v}$ appears?"),
                W(r"$A = \lambda I$ exactly", r"That would force every direction to be an eigenvector. What weaker equation does the substitution give?"),
            ],
        ),
        item(
            "mp_QYS-ML_vn4k_3",
            r"Each eigenpair $(\lambda, \mathbf{v})$ of $A$ provides which solution of $\mathbf{x}' = A\mathbf{x}$?",
            r"Reassemble the trial with the eigenpair you found.",
            [
                C(r"$\mathbf{x} = e^{\lambda t}\mathbf{v}$", r"Yes. Each eigenpair yields the exponential solution $e^{\lambda t}\mathbf{v}$."),
                W(r"$\mathbf{x} = \lambda e^{t}\mathbf{v}$", r"The eigenvalue belongs in the exponent, not as a front multiplier. What is the correct solution?"),
                W(r"$\mathbf{x} = e^{t}\mathbf{v}$", r"The growth rate is the eigenvalue $\lambda$, not $1$. What exponent should appear?"),
                W(r"$\mathbf{x} = e^{\lambda t}A\mathbf{v}$", r"The eigenvector $\mathbf{v}$ itself rides the exponential. What is the clean solution form?"),
            ],
        ),
        item(
            "mp_QYS-ML_vn4k_4",
            r"Why does using eigenvectors simplify the system $\mathbf{x}' = A\mathbf{x}$?",
            r"Along an eigenvector the matrix acts like a single number.",
            [
                C(r"Along an eigenvector the system decouples into a scalar equation $x' = \lambda x$", r"Yes. In the eigenvector direction $A$ acts as multiplication by $\lambda$, reducing to a simple scalar ODE."),
                W(r"Eigenvectors make $A$ the zero matrix", r"Eigenvectors diagonalize, not annihilate, the matrix. What scalar equation appears along an eigenvector?"),
                W(r"Eigenvectors eliminate the need for initial conditions", r"Initial conditions are still needed to fix constants. What does the eigenvector direction simplify the dynamics to?"),
                W(r"Eigenvectors turn the system nonlinear", r"The system stays linear; eigenvectors decouple it. Into what simple form?"),
            ],
        ),
        item(
            "mp_QYS-ML_vn4k_5",
            r"How is the general solution of $\mathbf{x}' = A\mathbf{x}$ built from several eigensolutions?",
            r"A linear system lets independent solutions be superposed.",
            [
                C(r"As a linear combination of the eigensolutions $e^{\lambda_i t}\mathbf{v}_i$", r"Yes. Superposition combines the independent eigensolutions into the general solution."),
                W(r"As the product of the eigensolutions", r"Linear systems superpose by addition, not multiplication. How are the eigensolutions combined?"),
                W(r"By choosing only the largest eigenvalue's solution", r"Dropping solutions loses generality. How are all eigensolutions used together?"),
                W(r"As the determinant of the eigensolutions", r"A determinant is not how solutions combine. What linear operation builds the general solution?"),
            ],
        ),
    ],
)

# === 14.4 video 2 ===========================================================
add_micro(
    "Cose44Lgssw",
    'Unit 14, Module 14.4, video 2\n           "Applications of Eigenvalues and Eigenvectors to solve Differential Equations, part 1"',
    [
        item(
            "mp_Cose44Lgssw_1",
            r"For $\mathbf{x}' = A\mathbf{x}$ with eigenpairs $(\lambda_1, \mathbf{v}_1)$ and $(\lambda_2, \mathbf{v}_2)$, what is the general solution?",
            r"Combine the two exponential eigensolutions with arbitrary constants.",
            [
                C(r"$\mathbf{x} = c_1 e^{\lambda_1 t}\mathbf{v}_1 + c_2 e^{\lambda_2 t}\mathbf{v}_2$", r"Yes. The general solution superposes the two eigensolutions with constants $c_1$ and $c_2$."),
                W(r"$\mathbf{x} = c_1 e^{\lambda_1 t}\mathbf{v}_2 + c_2 e^{\lambda_2 t}\mathbf{v}_1$", r"Each exponential must pair with its own eigenvector. Which vector goes with $\lambda_1$?"),
                W(r"$\mathbf{x} = (c_1 + c_2)e^{(\lambda_1 + \lambda_2)t}\mathbf{v}_1$", r"The eigenvalues do not add into one exponent. How are the two separate eigensolutions combined?"),
                W(r"$\mathbf{x} = c_1 e^{\lambda_1 t} + c_2 e^{\lambda_2 t}$", r"The eigenvectors must appear, since $\mathbf{x}$ is a vector. What multiplies each exponential?"),
            ],
        ),
        item(
            "mp_Cose44Lgssw_2",
            r"If $A$ has eigenvalue $\lambda = -2$ with eigenvector $\mathbf{v}$, what is the corresponding solution of $\mathbf{x}' = A\mathbf{x}$?",
            r"Place the eigenvalue in the exponent of the eigensolution.",
            [
                C(r"$\mathbf{x} = c\,e^{-2t}\mathbf{v}$", r"Correct. The eigenpair gives the decaying solution $e^{-2t}\mathbf{v}$."),
                W(r"$\mathbf{x} = c\,e^{2t}\mathbf{v}$", r"The eigenvalue is $-2$, so the exponent is negative. What is the sign in the exponent?"),
                W(r"$\mathbf{x} = c\,e^{-2t}$", r"The vector $\mathbf{v}$ must appear in a vector solution. What rides the exponential?"),
                W(r"$\mathbf{x} = -2c\,e^{t}\mathbf{v}$", r"The eigenvalue sets the exponent, not a front factor. What exponential appears?"),
            ],
        ),
        item(
            "mp_Cose44Lgssw_3",
            r"For real eigenvalues, what does the sign of $\lambda$ tell you about the corresponding solution as $t \to \infty$?",
            r"The exponential $e^{\lambda t}$ either grows or decays depending on the sign.",
            [
                C(r"Negative $\lambda$ gives decay toward the origin; positive $\lambda$ gives growth", r"Yes. The factor $e^{\lambda t}$ decays for $\lambda < 0$ and grows for $\lambda > 0$, governing stability."),
                W(r"Negative $\lambda$ gives growth; positive $\lambda$ gives decay", r"Check the behavior of $e^{\lambda t}$: which sign of $\lambda$ makes it shrink as $t$ grows?"),
                W(r"The sign has no effect on growth or decay", r"The sign is decisive for $e^{\lambda t}$. Which sign causes decay?"),
                W(r"Any real $\lambda$ produces oscillation", r"Oscillation needs complex eigenvalues, not real ones. What do real negative eigenvalues produce?"),
            ],
        ),
        item(
            "mp_Cose44Lgssw_4",
            r"The matrix with rows $(1, 0)$ and $(0, -2)$ has eigenvalues $1$ and $-2$ with eigenvectors $(1,0)$ and $(0,1)$. What is the general solution of $\mathbf{x}' = A\mathbf{x}$?",
            r"Pair each diagonal eigenvalue with its standard eigenvector in the superposition.",
            [
                C(r"$\mathbf{x} = c_1 e^{t}(1, 0) + c_2 e^{-2t}(0, 1)$", r"Correct. Eigenvalue $1$ pairs with $(1,0)$ and eigenvalue $-2$ pairs with $(0,1)$."),
                W(r"$\mathbf{x} = c_1 e^{-2t}(1, 0) + c_2 e^{t}(0, 1)$", r"Match each exponent to its own eigenvector. Which eigenvalue belongs to $(1, 0)$?"),
                W(r"$\mathbf{x} = c_1 e^{t}(1, 0) + c_2 e^{2t}(0, 1)$", r"The second eigenvalue is $-2$, not $2$. What is the correct exponent for $(0, 1)$?"),
                W(r"$\mathbf{x} = c_1 e^{t} + c_2 e^{-2t}$", r"The eigenvectors must appear in a vector solution. What multiplies each exponential?"),
            ],
        ),
        item(
            "mp_Cose44Lgssw_5",
            r"If $A$ has complex eigenvalues, what qualitative behavior do the solutions of $\mathbf{x}' = A\mathbf{x}$ show?",
            r"The imaginary part of the eigenvalue introduces a rotational character.",
            [
                C(r"Oscillation, since complex eigenvalues produce sines and cosines", r"Yes. Complex eigenvalues introduce oscillatory factors, giving spiraling or circulating solutions."),
                W(r"Pure exponential decay with no oscillation", r"Pure decay comes from real negative eigenvalues. What does the imaginary part add?"),
                W(r"Constant solutions that never change", r"Constant solutions require a zero eigenvalue. What does a nonzero imaginary part introduce?"),
                W(r"Unbounded linear growth in $t$", r"Linear-in-$t$ growth signals repeated eigenvalues, not complex ones. What behavior do complex eigenvalues give?"),
            ],
        ),
    ],
)

# ============================================================================
# UNIT 13 MASTERY
# ============================================================================

m13(
    "um_13_1",
    r"The Taylor coefficient of $(x - a)^n$ for a function $f$ expanded about $a$ is which expression?",
    r"It uses the $n$-th derivative at the center over a factorial.",
    [
        C(r"$\frac{f^{(n)}(a)}{n!}$", r"Yes. The $n$-th Taylor coefficient is $f^{(n)}(a)/n!$."),
        W(r"$\frac{f^{(n)}(a)}{n}$", r"The denominator is a factorial, not $n$. What divides $f^{(n)}(a)$?"),
        W(r"$f^{(n)}(a)$", r"A factorial divides the derivative. What is the denominator?"),
        W(r"$\frac{f(a)}{n!}$", r"The numerator is the $n$-th derivative, not $f(a)$. Which derivative appears?"),
    ],
)

m13(
    "um_13_2",
    r"What is the Maclaurin series of $e^x$?",
    r"All derivatives at $0$ equal $1$.",
    [
        C(r"$\sum_{n=0}^{\infty} \frac{x^n}{n!}$", r"Yes. With $f^{(n)}(0) = 1$, the coefficient of $x^n$ is $1/n!$."),
        W(r"$\sum_{n=0}^{\infty} n!\, x^n$", r"The factorial belongs in the denominator. What is $1/n!$?"),
        W(r"$\sum_{n=1}^{\infty} \frac{x^n}{n}$", r"That is the series for $-\ln(1 - x)$, not $e^x$. What denominator does $e^x$ use?"),
        W(r"$\sum_{n=0}^{\infty} \frac{(-1)^n x^n}{n!}$", r"Alternating signs give $e^{-x}$. Does $e^x$ alternate?"),
    ],
)

m13(
    "um_13_3",
    r"In the Maclaurin series of $e^x$, what is the coefficient of $x^3$?",
    r"The coefficient of $x^n$ is $1/n!$.",
    [
        C(r"$\frac{1}{6}$", r"Correct. The coefficient is $1/3! = 1/6$."),
        W(r"$\frac{1}{3}$", r"The denominator is $3!$, not $3$. What is $3!$?"),
        W(r"$6$", r"The factorial is in the denominator. What is $1/3!$?"),
        W(r"$\frac{1}{9}$", r"That is $1/3^2$, not $1/3!$. What is $3!$?"),
    ],
)

m13(
    "um_13_4",
    r"A Maclaurin series is a Taylor series with which center?",
    r"It is the simplest possible center.",
    [
        C(r"$a = 0$", r"Yes. Maclaurin means the Taylor series centered at the origin."),
        W(r"$a = 1$", r"The Maclaurin center is the origin. What value gives plain powers of $x$?"),
        W(r"the nearest singular point", r"The center is fixed at the origin, not tied to singularities. What is $a$?"),
        W(r"$a = \infty$", r"A Taylor center is a finite point. Which one defines Maclaurin?"),
    ],
)

m13(
    "um_13_5",
    r"What is the radius of convergence of the geometric series $\sum_{n=0}^{\infty} x^n$?",
    r"A geometric series converges when the ratio has magnitude below $1$.",
    [
        C(r"$R = 1$", r"Yes. The geometric series converges exactly for $|x| < 1$, so $R = 1$."),
        W(r"$R = \infty$", r"The terms do not shrink for large $|x|$. For which $|x|$ does it converge?"),
        W(r"$R = 0$", r"It converges on a positive interval around $0$. What is the bound on $|x|$?"),
        W(r"$R = 2$", r"The ratio is $x$ itself, so $|x| < 1$. What radius does that give?"),
    ],
)

m13(
    "um_13_6",
    r"What is the Maclaurin series of $\sin x$?",
    r"Sine is odd, so it keeps only odd powers with alternating signs.",
    [
        C(r"$\sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{(2n+1)!}$", r"Yes. Sine uses odd powers with alternating signs and factorial denominators."),
        W(r"$\sum_{n=0}^{\infty} \frac{(-1)^n x^{2n}}{(2n)!}$", r"Even powers belong to $\cos x$. Which powers does an odd function keep?"),
        W(r"$\sum_{n=0}^{\infty} \frac{x^{2n+1}}{(2n+1)!}$", r"The signs must alternate. What factor supplies the alternation?"),
        W(r"$\sum_{n=0}^{\infty} \frac{(-1)^n x^n}{n!}$", r"That keeps all powers and equals $e^{-x}$. Which exponents does sine keep?"),
    ],
)

m13(
    "um_13_7",
    r"In the power series method, what form is assumed for the solution about an ordinary point $x = 0$?",
    r"An analytic function with unknown coefficients.",
    [
        C(r"$y = \sum_{n=0}^{\infty} a_n x^n$", r"Yes. We posit a power series and solve for the coefficients $a_n$."),
        W(r"$y = x^r\sum_{n=0}^{\infty} a_n x^n$", r"The $x^r$ factor is the Frobenius form, used at singular points. What is assumed at an ordinary point?"),
        W(r"$y = e^{rx}$", r"That trial is for constant-coefficient equations. What analytic series is assumed?"),
        W(r"$y = \sum_{n=0}^{\infty} a_n e^{nx}$", r"The method uses powers of $x$, not exponentials. What is the standard ansatz?"),
    ],
)

m13(
    "um_13_8",
    r"Substituting $y = \sum a_n x^n$ into $y' = y$ yields which recurrence?",
    r"Match coefficients: $(n+1)a_{n+1} = a_n$.",
    [
        C(r"$a_{n+1} = \frac{a_n}{n+1}$", r"Correct. From $(n+1)a_{n+1} = a_n$ we get $a_{n+1} = a_n/(n+1)$."),
        W(r"$a_{n+1} = (n+1)a_n$", r"The factor $(n+1)$ divides. Solve $(n+1)a_{n+1} = a_n$ for $a_{n+1}$."),
        W(r"$a_{n+1} = a_n$", r"The differentiation factor cannot vanish. What divides $a_n$?"),
        W(r"$a_n = \frac{a_{n+1}}{n+1}$", r"Solve for the higher-index coefficient. What is $a_{n+1}$ in terms of $a_n$?"),
    ],
)

m13(
    "um_13_9",
    r"Using $a_{n+1} = a_n/(n+1)$ with $a_0 = 1$, what is $a_3$?",
    r"Step through $a_1, a_2, a_3$.",
    [
        C(r"$\frac{1}{6}$", r"Correct. $a_1 = 1$, $a_2 = 1/2$, $a_3 = (1/2)/3 = 1/6$."),
        W(r"$\frac{1}{3}$", r"Apply the recurrence three times from $a_0 = 1$. What is $a_2/3$?"),
        W(r"$\frac{1}{2}$", r"That is $a_2$, not $a_3$. What is the next step $a_2/3$?"),
        W(r"$\frac{1}{9}$", r"The final divisor is $3$ applied to $a_2 = 1/2$. What is $(1/2)/3$?"),
    ],
)

m13(
    "um_13_10",
    r"For $y'' + p(x)y' + q(x)y = 0$, what defines an ordinary point $x_0$?",
    r"The coefficient functions must be analytic there.",
    [
        C(r"Both $p$ and $q$ are analytic at $x_0$", r"Yes. At an ordinary point both coefficients have convergent power series."),
        W(r"$x\,p$ and $x^2 q$ are analytic but $p$, $q$ are not", r"That describes a regular singular point. What is true at an ordinary point itself?"),
        W(r"$p$ and $q$ both vanish at $x_0$", r"They need not be zero, only analytic. What property is required?"),
        W(r"$q$ has a simple pole at $x_0$", r"A pole signals a singular point. What must hold for an ordinary point?"),
    ],
)

m13(
    "um_13_11",
    r"Substituting the series into $y'' + y = 0$ gives which recurrence?",
    r"Use $(n+2)(n+1)a_{n+2} + a_n = 0$.",
    [
        C(r"$a_{n+2} = \frac{-a_n}{(n+2)(n+1)}$", r"Correct. The second derivative contributes $(n+2)(n+1)$ and the $+y$ flips the sign."),
        W(r"$a_{n+2} = \frac{a_n}{(n+2)(n+1)}$", r"The $+y$ term changes the sign of $a_n$. What sign appears?"),
        W(r"$a_{n+2} = \frac{-a_n}{(n+1)}$", r"Two derivatives give the product $(n+2)(n+1)$. What is the full denominator?"),
        W(r"$a_{n+1} = -a_n$", r"The second derivative links indices two apart. Which coefficient is solved for?"),
    ],
)

m13(
    "um_13_12",
    r"At an ordinary point, the radius of convergence of a series solution is at least what?",
    r"It extends to the nearest place the coefficients break down.",
    [
        C(r"The distance to the nearest singular point", r"Yes. Convergence is guaranteed out to the closest singularity in the complex plane."),
        W(r"Exactly $1$ always", r"The radius depends on the equation. What geometric distance bounds it?"),
        W(r"Zero", r"Convergence is guaranteed on a positive interval. What sets its radius?"),
        W(r"Infinite for every equation", r"Singular points can limit it. What distance gives the guaranteed radius?"),
    ],
)

m13(
    "um_13_13",
    r"What is a regular singular point of $y'' + p(x)y' + q(x)y = 0$ at $x_0 = 0$?",
    r"A singularity mild enough that $x p$ and $x^2 q$ stay analytic.",
    [
        C(r"A singular point where $x\,p(x)$ and $x^2 q(x)$ are analytic at $0$", r"Yes. The factors $x$ and $x^2$ tame the singularity, exactly what Frobenius requires."),
        W(r"A point where $p$ and $q$ are both analytic", r"That is an ordinary point. What extra tamed combinations must be analytic?"),
        W(r"A point where the solution is undefined for all methods", r"Frobenius does handle it. What mild condition classifies a regular singular point?"),
        W(r"A point where $x^3 p$ and $x^4 q$ are analytic", r"The required powers are $1$ and $2$. Which factors tame the singularity?"),
    ],
)

m13(
    "um_13_14",
    r"What solution form does the Frobenius method assume?",
    r"A power series times a power $x^r$.",
    [
        C(r"$y = \sum_{n=0}^{\infty} a_n x^{n+r}$", r"Yes. The exponent $r$ comes from the indicial equation and captures the singular behavior."),
        W(r"$y = \sum_{n=0}^{\infty} a_n x^n$", r"That plain series is the ordinary-point form. What extra factor is needed?"),
        W(r"$y = e^{rx}\sum_{n=0}^{\infty} a_n x^n$", r"The factor is a power $x^r$, not an exponential. What multiplies the series?"),
        W(r"$y = \sum_{n=0}^{\infty} a_n (x - r)^n$", r"$r$ is an exponent, not a shifted center. What is the correct form?"),
    ],
)

m13(
    "um_13_15",
    r"With $p_0 = \lim x\,p(x)$ and $q_0 = \lim x^2 q(x)$, what is the indicial equation?",
    r"It is the quadratic from the lowest power of $x$.",
    [
        C(r"$r(r-1) + p_0\, r + q_0 = 0$", r"Yes. The lowest-order balance gives $r(r-1) + p_0 r + q_0 = 0$."),
        W(r"$r^2 + p_0 r + q_0 = 0$", r"The leading term is $r(r-1)$, not $r^2$. What does that expand to?"),
        W(r"$r(r-1) + q_0 r + p_0 = 0$", r"The constants $p_0$ and $q_0$ are swapped. Which one multiplies $r$?"),
        W(r"$p_0 r^2 + q_0 r + 1 = 0$", r"The structure is $r(r-1) + p_0 r + q_0$. What is the correct indicial form?"),
    ],
)

m13(
    "um_13_16",
    r"For $x^2 y'' + x y' - y = 0$ ($p_0 = 1$, $q_0 = -1$), what are the indicial roots?",
    r"Solve $r(r-1) + r - 1 = r^2 - 1 = 0$.",
    [
        C(r"$r = 1$ and $r = -1$", r"Correct. $r^2 - 1 = 0$ gives $r = \pm 1$."),
        W(r"$r = 0$ and $r = 1$", r"Simplify $r(r-1) + r - 1$ to $r^2 - 1$. What are its roots?"),
        W(r"$r = 1$ repeated", r"The equation $r^2 - 1 = 0$ has two distinct roots. What are they?"),
        W(r"$r = \pm i$", r"$r^2 - 1 = 0$ has real roots, since $r^2 = 1$. What are they?"),
    ],
)

m13(
    "um_13_17",
    r"When the indicial equation has a repeated root, the second Frobenius solution must include what?",
    r"One series is not enough for two independent solutions.",
    [
        C(r"A logarithmic term", r"Yes. A repeated root forces a $\ln x$ term in the second independent solution."),
        W(r"A second distinct power $x^r$", r"A repeated root supplies only one exponent. What term gives independence?"),
        W(r"An exponential factor $e^{rx}$", r"Frobenius solutions use powers and logs, not exponentials. What extra term appears?"),
        W(r"Nothing beyond the single series", r"One series cannot span the solution space. What must the second solution contain?"),
    ],
)

m13(
    "um_13_18",
    r"Near $x = 0$, a Frobenius solution behaves like which leading term?",
    r"The smallest power dominates as $x \to 0$.",
    [
        C(r"$a_0 x^r$", r"Yes. The first nonzero term $a_0 x^r$ controls the behavior near the singular point."),
        W(r"$a_0$ (a constant)", r"A constant leads only when $r = 0$. What power dominates for general $r$?"),
        W(r"$x^{2r}$", r"The leading power is $x^r$, not $x^{2r}$. What is the lowest term?"),
        W(r"$e^{rx}$", r"The leading behavior is a power, not an exponential. What is $a_0 x^r$?"),
    ],
)

m13(
    "um_13_19",
    r"Which equation is Legendre's differential equation?",
    r"It carries the $(1 - x^2)$ factor and the parameter $n(n+1)$.",
    [
        C(r"$(1 - x^2)y'' - 2x y' + n(n+1)y = 0$", r"Yes. This is Legendre's equation."),
        W(r"$x^2 y'' + x y' + (x^2 - n^2)y = 0$", r"That is Bessel's equation. Which has the $(1 - x^2)$ factor?"),
        W(r"$y'' - 2x y' + 2n y = 0$", r"That is Hermite's equation. What is the Legendre form?"),
        W(r"$(1 - x^2)y'' - x y' + n^2 y = 0$", r"That is Chebyshev's equation. What are the correct middle and last terms?"),
    ],
)

m13(
    "um_13_20",
    r"What is the Legendre polynomial $P_2(x)$?",
    r"It is the quadratic Legendre polynomial, with $P_2(1) = 1$.",
    [
        C(r"$\frac{1}{2}(3x^2 - 1)$", r"Correct. $P_2(x) = \tfrac{1}{2}(3x^2 - 1)$."),
        W(r"$2x^2 - 1$", r"That is the Chebyshev $T_2$. What is the Legendre $P_2$?"),
        W(r"$x^2$", r"Legendre normalization adds a constant and a factor $3$. What is $\tfrac{1}{2}(3x^2 - 1)$?"),
        W(r"$4x^2 - 2$", r"That is the Hermite $H_2$. What is $P_2$?"),
    ],
)

m13(
    "um_13_21",
    r"Where are the singular points of Legendre's equation?",
    r"They occur where the leading coefficient $(1 - x^2)$ vanishes.",
    [
        C(r"At $x = \pm 1$", r"Yes. The factor $(1 - x^2)$ vanishes at $x = \pm 1$."),
        W(r"At $x = 0$", r"The leading coefficient is nonzero at $0$, an ordinary point. Where does $(1 - x^2)$ vanish?"),
        W(r"Nowhere", r"The coefficient does vanish somewhere. At which points?"),
        W(r"At $x = \pm 2$", r"Solve $1 - x^2 = 0$. What values result?"),
    ],
)

m13(
    "um_13_22",
    r"What kind of point is $x = 0$ for Bessel's equation, and which method applies?",
    r"The coefficients blow up mildly at $0$.",
    [
        C(r"A regular singular point, handled by the Frobenius method", r"Yes. Bessel's equation has a regular singular point at $0$, exactly where Frobenius applies."),
        W(r"An ordinary point, handled by a plain power series", r"The coefficients are singular at $0$, so it is not ordinary. What is it?"),
        W(r"An irregular singular point with no series solution", r"The singularity is mild enough for Frobenius. What is the precise type?"),
        W(r"A removable point needing no special method", r"The point genuinely matters. Which method is used at a regular singular point?"),
    ],
)

m13(
    "um_13_23",
    r"For Bessel's equation of order $\nu$, what are the indicial roots?",
    r"The indicial equation reduces to $r^2 - \nu^2 = 0$.",
    [
        C(r"$r = \pm\nu$", r"Correct. $r^2 - \nu^2 = 0$ gives $r = \pm\nu$."),
        W(r"$r = \nu$ repeated", r"There are two roots unless $\nu = 0$. What are both?"),
        W(r"$r = \pm\nu^2$", r"Take the square root of $r^2 = \nu^2$. What are the roots?"),
        W(r"$r = 0, 1$", r"The roots depend on $\nu$. What does $r^2 = \nu^2$ give?"),
    ],
)

m13(
    "um_13_24",
    r"On $[-1, 1]$, distinct Legendre polynomials $P_m$ and $P_n$ ($m \neq n$) satisfy which relation?",
    r"They form an orthogonal family with weight $1$.",
    [
        C(r"$\int_{-1}^{1} P_m P_n\, dx = 0$", r"Yes. Distinct Legendre polynomials are orthogonal on $[-1, 1]$."),
        W(r"$\int_{-1}^{1} P_m P_n\, dx = 1$", r"The cross integral vanishes for $m \neq n$. What does it equal?"),
        W(r"$P_m = P_n$", r"Different degrees are not equal. What integral relation holds?"),
        W(r"$P_m P_n = 0$ for all $x$", r"The product is not identically zero; its integral is. What is $\int_{-1}^1 P_m P_n\, dx$?"),
    ],
)

m13(
    "um_13_25",
    r"Which equation is Hermite's differential equation?",
    r"It has a $-2x y'$ term and parameter $2n$.",
    [
        C(r"$y'' - 2x y' + 2n y = 0$", r"Yes. Hermite's equation is $y'' - 2x y' + 2n y = 0$."),
        W(r"$x y'' + (1 - x)y' + n y = 0$", r"That is Laguerre's equation. Which has $-2x y'$?"),
        W(r"$(1 - x^2)y'' - 2x y' + n(n+1)y = 0$", r"That is Legendre's equation. What is the Hermite form?"),
        W(r"$y'' + 2x y' + 2n y = 0$", r"The first-derivative term is negative for Hermite. What is the correct sign?"),
    ],
)

m13(
    "um_13_26",
    r"What is the Hermite polynomial $H_2(x)$ (physicists' convention)?",
    r"Use $H_2 = 2x H_1 - 2H_0$ with $H_0 = 1$, $H_1 = 2x$.",
    [
        C(r"$4x^2 - 2$", r"Correct. $H_2 = 2x(2x) - 2 = 4x^2 - 2$."),
        W(r"$2x^2 - 1$", r"That is the Chebyshev $T_2$. What does the Hermite recurrence give?"),
        W(r"$x^2 - 1$", r"Apply $H_2 = 2x H_1 - 2H_0$ with $H_1 = 2x$. What is $4x^2 - 2$?"),
        W(r"$4x^2$", r"The recurrence subtracts $2H_0 = 2$. What is $4x^2 - 2$?"),
    ],
)

m13(
    "um_13_27",
    r"Hermite polynomials are orthogonal on $(-\infty, \infty)$ with which weight?",
    r"The weight is the Gaussian tied to the recurrence.",
    [
        C(r"$e^{-x^2}$", r"Yes. Hermite polynomials use the Gaussian weight $e^{-x^2}$."),
        W(r"$e^{-x}$", r"That is the Laguerre weight on $[0, \infty)$. What Gaussian pairs with Hermite?"),
        W(r"$\frac{1}{\sqrt{1 - x^2}}$", r"That is the Chebyshev weight. What weight makes Hermite integrals converge on the whole line?"),
        W(r"$1$", r"Weight $1$ is for Legendre. What weight does Hermite use?"),
    ],
)

m13(
    "um_13_28",
    r"What is the Chebyshev polynomial $T_2(x)$ of the first kind?",
    r"Use $T_2 = 2x T_1 - T_0$ with $T_0 = 1$, $T_1 = x$.",
    [
        C(r"$2x^2 - 1$", r"Correct. $T_2 = 2x(x) - 1 = 2x^2 - 1$."),
        W(r"$4x^2 - 2$", r"That is the Hermite $H_2$. What does the Chebyshev recurrence give?"),
        W(r"$\frac{1}{2}(3x^2 - 1)$", r"That is the Legendre $P_2$. What is the Chebyshev $T_2$?"),
        W(r"$x^2$", r"The recurrence subtracts $T_0 = 1$. What is $2x^2 - 1$?"),
    ],
)

m13(
    "um_13_29",
    r"Chebyshev polynomials of the first kind satisfy which identity under $x = \cos\theta$?",
    r"They collapse to a single cosine of a multiple angle.",
    [
        C(r"$T_n(\cos\theta) = \cos(n\theta)$", r"Yes. This defining identity makes $T_n(\cos\theta)$ equal $\cos(n\theta)$."),
        W(r"$T_n(\cos\theta) = \cos^n\theta$", r"It is the cosine of $n\theta$, not the $n$-th power. What is the identity?"),
        W(r"$T_n(\cos\theta) = \sin(n\theta)$", r"First-kind Chebyshev gives a cosine. What is $T_n(\cos\theta)$?"),
        W(r"$T_n(\cos\theta) = n\cos\theta$", r"The result is a multiple-angle cosine, not a multiple of cosine. What is the identity?"),
    ],
)

m13(
    "um_13_30",
    r"In which physical setting do Laguerre polynomials famously appear?",
    r"Think of the radial part of a well-known atomic wavefunction.",
    [
        C(r"The radial wavefunctions of the hydrogen atom", r"Yes. The hydrogen atom's radial equation produces Laguerre polynomials."),
        W(r"The quantum harmonic oscillator", r"That setting uses Hermite polynomials. Which atomic problem uses Laguerre?"),
        W(r"Vibrations of a circular drumhead", r"That involves Bessel functions. Which atomic system features Laguerre polynomials?"),
        W(r"Planetary orbital mechanics", r"That is governed by Kepler's laws, not Laguerre. Which quantum system uses them?"),
    ],
)

# ============================================================================
# UNIT 14 MASTERY
# ============================================================================

m14(
    "um_14_1",
    r"What is a linear combination of vectors $\mathbf{v}$ and $\mathbf{w}$?",
    r"Scale each vector and add the results.",
    [
        C(r"$a\mathbf{v} + b\mathbf{w}$ for scalars $a$ and $b$", r"Yes. A linear combination scales each vector and adds them."),
        W(r"$\mathbf{v}\cdot\mathbf{w}$", r"The dot product returns a scalar, not a combined vector. What scales and adds?"),
        W(r"$\mathbf{v}\times\mathbf{w}$", r"The cross product is one perpendicular vector, not a general combination. What uses arbitrary scalars?"),
        W(r"$\|\mathbf{v}\| + \|\mathbf{w}\|$", r"That adds lengths, not vectors. What is the vector combination?"),
    ],
)

m14(
    "um_14_2",
    r"What is the span of a set of vectors?",
    r"Everything reachable by combining them.",
    [
        C(r"The set of all linear combinations of the vectors", r"Yes. The span is every vector reachable as a linear combination."),
        W(r"Only the listed vectors", r"The span includes far more. What set does it form?"),
        W(r"The longest vector", r"Span is a whole set, not one vector. What collection is it?"),
        W(r"The perpendicular to the vectors", r"Span is built from combinations, not perpendiculars. What does it contain?"),
    ],
)

m14(
    "um_14_3",
    r"What two conditions make a set of vectors a basis?",
    r"Reach everything, with no redundancy.",
    [
        C(r"Linear independence and spanning the space", r"Yes. A basis spans the space and is linearly independent."),
        W(r"Orthogonality and unit length", r"Those are optional refinements, not the definition. What two conditions are essential?"),
        W(r"Containing the zero vector", r"The zero vector creates dependence. What two properties define a basis?"),
        W(r"Having infinitely many vectors", r"A finite-dimensional basis is finite. What conditions are required?"),
    ],
)

m14(
    "um_14_4",
    r"What is the span of two nonzero, non-parallel vectors in $\mathbb{R}^2$?",
    r"Two independent directions cover the plane.",
    [
        C(r"All of $\mathbb{R}^2$", r"Yes. Two independent vectors span the entire plane."),
        W(r"A single line", r"A line is spanned by parallel vectors. What do independent directions reach?"),
        W(r"Just the origin", r"Only zero vectors span the origin alone. What do two independent vectors span?"),
        W(r"Only the two vectors", r"Combinations reach much more. What region results?"),
    ],
)

m14(
    "um_14_5",
    r"Compute the linear combination $3(1, 0) + 2(0, 1)$.",
    r"Scale each, then add componentwise.",
    [
        C(r"$(3, 2)$", r"Correct. $3(1,0) + 2(0,1) = (3,0) + (0,2) = (3,2)$."),
        W(r"$(2, 3)$", r"Keep the scalars with their own directions. What is $(3,0) + (0,2)$?"),
        W(r"$(5, 5)$", r"The scalars scale separate axes; they do not add together. What is the componentwise sum?"),
        W(r"$(6, 0)$", r"The vectors point in different directions. What is the componentwise sum?"),
    ],
)

m14(
    "um_14_6",
    r"Which identity must a linear transformation $T$ satisfy?",
    r"It preserves linear combinations.",
    [
        C(r"$T(a\mathbf{u} + b\mathbf{v}) = aT(\mathbf{u}) + bT(\mathbf{v})$", r"Yes. Linearity preserves linear combinations exactly this way."),
        W(r"$T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u})\,T(\mathbf{v})$", r"Outputs add, they do not multiply. What identity holds?"),
        W(r"$T(\mathbf{u}) = \mathbf{u} + \mathbf{c}$, $\mathbf{c}\neq\mathbf{0}$", r"A nonzero shift breaks linearity. What identity is required?"),
        W(r"$T(\mathbf{u}) = \|\mathbf{u}\|$", r"That returns a scalar, not a linear map. What property defines linearity?"),
    ],
)

m14(
    "um_14_7",
    r"For a matrix of a linear transformation, what do the columns represent?",
    r"Send in the standard basis vectors.",
    [
        C(r"The images of the standard basis vectors", r"Yes. Each column is where a basis vector lands."),
        W(r"The eigenvalues", r"Eigenvalues come from the characteristic equation. What do columns show?"),
        W(r"The input vector lengths", r"Columns are basis images, not lengths. What do they record?"),
        W(r"The fixed points", r"Columns are basis images, not fixed points. Where does each basis vector go?"),
    ],
)

m14(
    "um_14_8",
    r"Apply the transformation with rows $(1, 2)$ and $(3, 4)$ to $(1, 1)$.",
    r"Dot each row with the input.",
    [
        C(r"$(3, 7)$", r"Correct. $(1,2)\cdot(1,1) = 3$ and $(3,4)\cdot(1,1) = 7$."),
        W(r"$(7, 3)$", r"Keep the rows in order. What is row one dotted with $(1,1)$?"),
        W(r"$(3, 4)$", r"The second output is $(3,4)\cdot(1,1) = 3 + 4$. What is that?"),
        W(r"$(4, 6)$", r"Each output dots one row with $(1,1)$. What are $1+2$ and $3+4$?"),
    ],
)

m14(
    "um_14_9",
    r"Geometrically, what does the determinant of a $2\times 2$ matrix measure?",
    r"How the transformation rescales area.",
    [
        C(r"The area-scaling factor of the transformation", r"Yes. The determinant is the factor by which areas are scaled."),
        W(r"The summed length of the columns", r"It measures area change, not length. What does it scale?"),
        W(r"The angle between the columns", r"Angle is not the determinant. What geometric quantity does it scale?"),
        W(r"The number of eigenvalues", r"That is fixed by size. What area effect does the determinant capture?"),
    ],
)

m14(
    "um_14_10",
    r"For a matrix with rows $(a, b)$ and $(c, d)$, what is the determinant?",
    r"The difference of the diagonal products.",
    [
        C(r"$ad - bc$", r"Yes. The $2\times 2$ determinant is $ad - bc$."),
        W(r"$ab - cd$", r"Pair entries across the diagonals, not along rows. What is $ad - bc$?"),
        W(r"$ad + bc$", r"The off-diagonal product is subtracted. What is the sign?"),
        W(r"$ac - bd$", r"Group $a$ with $d$ and $b$ with $c$. What is $ad - bc$?"),
    ],
)

m14(
    "um_14_11",
    r"Compute the determinant of the matrix with rows $(2, 3)$ and $(1, 4)$.",
    r"Use $ad - bc$.",
    [
        C(r"$5$", r"Correct. $2\cdot 4 - 3\cdot 1 = 8 - 3 = 5$."),
        W(r"$11$", r"The off-diagonal product is subtracted, not added. What is $8 - 3$?"),
        W(r"$8$", r"Subtract $bc = 3\cdot 1$. What is $8 - 3$?"),
        W(r"$2$", r"Recompute: $ad = 8$ and $bc = 3$. What is $8 - 3$?"),
    ],
)

m14(
    "um_14_12",
    r"What does a determinant of $0$ indicate?",
    r"Zero area scaling flattens the space.",
    [
        C(r"Space collapses to a lower dimension and the columns are dependent", r"Yes. A zero determinant squishes the plane onto a line or point, so the columns are linearly dependent."),
        W(r"The transformation is a pure rotation", r"A rotation has determinant $1$. What does zero area scaling do?"),
        W(r"Areas are doubled", r"Doubling is determinant $2$. What does factor $0$ do?"),
        W(r"Every vector is fixed", r"That is the identity, determinant $1$. What does determinant $0$ imply?"),
    ],
)

m14(
    "um_14_13",
    r"What does a negative determinant indicate?",
    r"The sign tracks orientation.",
    [
        C(r"The transformation reverses orientation (a flip)", r"Yes. A negative determinant reverses orientation, like a reflection; its magnitude still gives area scaling."),
        W(r"Areas become negative", r"Area magnitude stays positive; the sign tracks orientation. What does it flip?"),
        W(r"The matrix is not invertible", r"Invertibility fails only at $0$. What does a negative sign indicate?"),
        W(r"All eigenvalues are negative", r"The sign is the product of eigenvalues, not each one. What orientation effect does it signal?"),
    ],
)

m14(
    "um_14_14",
    r"What does a change of basis matrix do?",
    r"It relabels the same vector in new coordinates.",
    [
        C(r"It converts a vector's coordinates from one basis to another", r"Yes. It relabels the same vector in a different coordinate system."),
        W(r"It changes the vector into a different vector", r"The vector is unchanged; only coordinates change. What does it translate?"),
        W(r"It computes a vector's length", r"Length is unrelated. What does it convert?"),
        W(r"It always rotates by ninety degrees", r"It is general, not a fixed rotation. What does it convert?"),
    ],
)

m14(
    "um_14_15",
    r"To express a transformation $A$ in a new basis given by matrix $P$, which formula applies?",
    r"Translate in, apply $A$, translate back.",
    [
        C(r"$P^{-1} A P$", r"Yes. The similarity transform $P^{-1} A P$ rewrites $A$ in the new basis."),
        W(r"$P A P^{-1}$", r"Check which factor converts the input first. What goes on the right of $A$?"),
        W(r"$A P$", r"You must translate back after applying $A$. What completes the conjugation?"),
        W(r"$P^{-1} A$", r"The input must be converted into the original basis first. What goes on the right?"),
    ],
)

m14(
    "um_14_16",
    r"Why is an eigenbasis a particularly useful change of basis?",
    r"The transformation becomes simple independent scalings.",
    [
        C(r"The matrix becomes diagonal, scaling each axis independently", r"Yes. In an eigenbasis the matrix is diagonal, simplifying powers and exponentials."),
        W(r"The matrix becomes the zero matrix", r"Diagonalization scales axes, not annihilates them. What form results?"),
        W(r"The determinant becomes $1$", r"The determinant is unchanged by a basis change. What structure does the matrix gain?"),
        W(r"The eigenvalues all vanish", r"Eigenvalues become the diagonal entries. What form does the matrix take?"),
    ],
)

m14(
    "um_14_17",
    r"What equation defines an eigenvector $\mathbf{v}$ of $A$ with eigenvalue $\lambda$?",
    r"The matrix only scales the eigenvector.",
    [
        C(r"$A\mathbf{v} = \lambda\mathbf{v}$ with $\mathbf{v}\neq\mathbf{0}$", r"Yes. An eigenvector is a nonzero vector that $A$ only scales by $\lambda$."),
        W(r"$A\mathbf{v} = \mathbf{0}$ with $\mathbf{v}\neq\mathbf{0}$", r"That is the special case $\lambda = 0$. What is the general equation?"),
        W(r"$A\mathbf{v} = \mathbf{v} + \lambda$", r"A scalar cannot be added to a vector. How should $\lambda$ act?"),
        W(r"$A + \lambda\mathbf{v} = \mathbf{0}$", r"The matrix multiplies the vector. What is the multiplicative relation?"),
    ],
)

m14(
    "um_14_18",
    r"The eigenvalues of $A$ are the roots of which equation?",
    r"They make $A - \lambda I$ singular.",
    [
        C(r"$\det(A - \lambda I) = 0$", r"Yes. Eigenvalues are roots of the characteristic equation $\det(A - \lambda I) = 0$."),
        W(r"$\det(A) = \lambda$", r"Eigenvalues come from a determinant set to zero, not the determinant itself. What is the equation?"),
        W(r"$A - \lambda I = 0$", r"Only the determinant must vanish, not the whole matrix. What is the condition?"),
        W(r"$\text{tr}(A) = \lambda$", r"The trace is the sum of eigenvalues, not the defining equation. What gives each $\lambda$?"),
    ],
)

m14(
    "um_14_19",
    r"What are the eigenvalues of the matrix with rows $(4, 0)$ and $(0, 7)$?",
    r"A diagonal matrix exposes its eigenvalues on the diagonal.",
    [
        C(r"$4$ and $7$", r"Correct. The diagonal entries are the eigenvalues."),
        W(r"$0$ and $0$", r"The off-diagonal zeros are not the eigenvalues. Which entries are?"),
        W(r"$11$ and $0$", r"The trace $11$ is the sum, not an eigenvalue. What are the diagonal entries?"),
        W(r"$28$ and $1$", r"The product $28$ is the determinant. What sit on the diagonal?"),
    ],
)

m14(
    "um_14_20",
    r"For any matrix, the sum of the eigenvalues equals which quantity?",
    r"Add the diagonal entries.",
    [
        C(r"The trace", r"Yes. The eigenvalues sum to the trace."),
        W(r"The determinant", r"The determinant is the product of eigenvalues, not the sum. What gives the sum?"),
        W(r"The rank", r"Rank counts independent directions. What invariant equals the eigenvalue sum?"),
        W(r"Zero, always", r"The sum is generally nonzero. Which invariant matches it?"),
    ],
)

m14(
    "um_14_21",
    r"For any matrix, the product of the eigenvalues equals which quantity?",
    r"It is the area or volume scaling factor.",
    [
        C(r"The determinant", r"Yes. The eigenvalues multiply to the determinant."),
        W(r"The trace", r"The trace is the sum, not the product. What invariant equals the product?"),
        W(r"The number of columns", r"Column count is fixed by size. What invariant equals the eigenvalue product?"),
        W(r"One, always", r"The product is generally not $1$. Which invariant matches it?"),
    ],
)

m14(
    "um_14_22",
    r"For a $2\times 2$ matrix, the eigenvalues are roots of which quadratic?",
    r"Built from the trace and determinant.",
    [
        C(r"$\lambda^2 - (\text{tr}\,A)\lambda + \det A = 0$", r"Yes. The characteristic equation is $\lambda^2 - (\text{tr})\lambda + \det = 0$."),
        W(r"$\lambda^2 + (\text{tr}\,A)\lambda + \det A = 0$", r"The trace term is negative. What is the correct sign?"),
        W(r"$\lambda^2 - (\det A)\lambda + \text{tr}\,A = 0$", r"Trace and determinant roles are swapped. Which multiplies $\lambda$?"),
        W(r"$\lambda^2 = \text{tr}\,A + \det A$", r"The structure is a full quadratic in $\lambda$. What is it?"),
    ],
)

m14(
    "um_14_23",
    r"Use the trick $\lambda = m \pm \sqrt{m^2 - p}$ on rows $(2, 1)$ and $(1, 2)$: trace $4$, determinant $3$.",
    r"Here $m = 2$, $p = 3$.",
    [
        C(r"$3$ and $1$", r"Correct. $\lambda = 2 \pm \sqrt{4 - 3} = 2 \pm 1$, giving $3$ and $1$."),
        W(r"$4$ and $0$", r"Use $\sqrt{m^2 - p} = 1$. What is $2 \pm 1$?"),
        W(r"$2$ and $2$", r"The discriminant $1$ is nonzero. What is $2 \pm 1$?"),
        W(r"$3$ and $-1$", r"Both roots are $2$ plus or minus $1$. What is $2 - 1$?"),
    ],
)

m14(
    "um_14_24",
    r"What are the eigenvalues of the upper triangular matrix with rows $(5, 9)$ and $(0, 2)$?",
    r"A triangular matrix shows eigenvalues on the diagonal.",
    [
        C(r"$5$ and $2$", r"Correct. The diagonal entries $5$ and $2$ are the eigenvalues; the off-diagonal $9$ does not affect them."),
        W(r"$5$ and $9$", r"The off-diagonal $9$ is not an eigenvalue. Which entries are?"),
        W(r"$9$ and $2$", r"The eigenvalues are the diagonal entries. What are they?"),
        W(r"$7$ and $11$", r"Those are not diagonal entries. Where do triangular eigenvalues sit?"),
    ],
)

m14(
    "um_14_25",
    r"For $\mathbf{x}' = A\mathbf{x}$, which trial solution leads to the eigenvalue problem?",
    r"A fixed direction with exponential time dependence.",
    [
        C(r"$\mathbf{x} = e^{\lambda t}\mathbf{v}$ for a constant vector $\mathbf{v}$", r"Yes. This trial turns the system into the eigenvalue equation."),
        W(r"$\mathbf{x} = \lambda t\,\mathbf{v}$", r"Linear-in-$t$ growth does not solve the system. What time dependence does?"),
        W(r"$\mathbf{x} = e^{\lambda t}$ (scalar)", r"The state is a vector, so a direction $\mathbf{v}$ is needed. What is the full trial?"),
        W(r"$\mathbf{x} = \sin(\lambda t)\mathbf{v}$", r"The natural first-order trial is exponential. What form is it?"),
    ],
)

m14(
    "um_14_26",
    r"Substituting $\mathbf{x} = e^{\lambda t}\mathbf{v}$ into $\mathbf{x}' = A\mathbf{x}$ gives what?",
    r"The derivative brings down $\lambda$; the exponential cancels.",
    [
        C(r"$A\mathbf{v} = \lambda\mathbf{v}$", r"Yes. It reduces to the eigenvalue equation $A\mathbf{v} = \lambda\mathbf{v}$."),
        W(r"$A\mathbf{v} = \mathbf{0}$", r"The left side gives $\lambda\mathbf{v}$, not zero. What equation results?"),
        W(r"$\mathbf{v}' = \lambda\mathbf{v}$", r"The vector $\mathbf{v}$ is constant. What relation appears?"),
        W(r"$A = \lambda I$", r"That forces every vector to be an eigenvector. What weaker equation results?"),
    ],
)

m14(
    "um_14_27",
    r"For $\mathbf{x}' = A\mathbf{x}$ with eigenpairs $(\lambda_1,\mathbf{v}_1)$ and $(\lambda_2,\mathbf{v}_2)$, what is the general solution?",
    r"Superpose the two eigensolutions with constants.",
    [
        C(r"$\mathbf{x} = c_1 e^{\lambda_1 t}\mathbf{v}_1 + c_2 e^{\lambda_2 t}\mathbf{v}_2$", r"Yes. The general solution superposes the eigensolutions."),
        W(r"$\mathbf{x} = c_1 e^{\lambda_1 t}\mathbf{v}_2 + c_2 e^{\lambda_2 t}\mathbf{v}_1$", r"Each exponential pairs with its own eigenvector. Which vector goes with $\lambda_1$?"),
        W(r"$\mathbf{x} = c_1 e^{\lambda_1 t} + c_2 e^{\lambda_2 t}$", r"The eigenvectors must appear in a vector solution. What multiplies each exponential?"),
        W(r"$\mathbf{x} = (c_1 + c_2)e^{(\lambda_1+\lambda_2)t}\mathbf{v}_1$", r"The eigenvalues do not merge into one exponent. How are the eigensolutions combined?"),
    ],
)

m14(
    "um_14_28",
    r"For real eigenvalues, what does $\lambda < 0$ imply for the solution as $t \to \infty$?",
    r"Look at the sign in $e^{\lambda t}$.",
    [
        C(r"The solution decays toward the origin", r"Yes. With $\lambda < 0$ the factor $e^{\lambda t}$ decays to zero."),
        W(r"The solution grows without bound", r"Growth needs $\lambda > 0$. What does a negative exponent do?"),
        W(r"The solution oscillates", r"Oscillation needs complex eigenvalues. What do real negative ones do?"),
        W(r"The solution stays constant", r"A constant needs $\lambda = 0$. What does $\lambda < 0$ give?"),
    ],
)

m14(
    "um_14_29",
    r"The matrix with rows $(1, 0)$ and $(0, -2)$ has eigenvalues $1$ and $-2$ with eigenvectors $(1,0)$ and $(0,1)$. What is the general solution of $\mathbf{x}' = A\mathbf{x}$?",
    r"Pair each eigenvalue with its eigenvector.",
    [
        C(r"$\mathbf{x} = c_1 e^{t}(1, 0) + c_2 e^{-2t}(0, 1)$", r"Correct. Eigenvalue $1$ pairs with $(1,0)$ and $-2$ pairs with $(0,1)$."),
        W(r"$\mathbf{x} = c_1 e^{-2t}(1, 0) + c_2 e^{t}(0, 1)$", r"Match each exponent to its own eigenvector. Which eigenvalue belongs to $(1,0)$?"),
        W(r"$\mathbf{x} = c_1 e^{t}(1, 0) + c_2 e^{2t}(0, 1)$", r"The second eigenvalue is $-2$, not $2$. What exponent goes with $(0,1)$?"),
        W(r"$\mathbf{x} = c_1 e^{t} + c_2 e^{-2t}$", r"The eigenvectors must appear. What multiplies each exponential?"),
    ],
)

m14(
    "um_14_30",
    r"If $A$ has complex eigenvalues, what behavior do the solutions of $\mathbf{x}' = A\mathbf{x}$ show?",
    r"The imaginary part brings rotation.",
    [
        C(r"Oscillation, from the sine and cosine the complex parts produce", r"Yes. Complex eigenvalues give oscillatory, spiraling solutions."),
        W(r"Pure exponential decay only", r"Pure decay comes from real negative eigenvalues. What does the imaginary part add?"),
        W(r"Constant solutions", r"Those need a zero eigenvalue. What does a nonzero imaginary part introduce?"),
        W(r"Linear growth in $t$", r"That signals repeated eigenvalues. What do complex eigenvalues give?"),
    ],
)

# ============================================================================
# EMIT, UPDATE, VALIDATE
# ============================================================================

def js_str(s):
    """Return a JS/JSON double quoted string literal for s (single backslash in)."""
    return json.dumps(s, ensure_ascii=False)


def emit_option(opt):
    if opt.get("correct"):
        return "{ \"text\": %s, \"correct\": true, \"rationale\": %s }" % (
            js_str(opt["text"]), js_str(opt["rationale"]))
    return "{ \"text\": %s, \"rationale\": %s }" % (
        js_str(opt["text"]), js_str(opt["rationale"]))


def emit_item(it, indent):
    pad = " " * indent
    p2 = " " * (indent + 4)
    p3 = " " * (indent + 8)
    lines = []
    lines.append(pad + "{")
    lines.append(p2 + "\"id\": %s," % js_str(it["id"]))
    lines.append(p2 + "\"prompt\": %s," % js_str(it["prompt"]))
    lines.append(p2 + "\"hint\": %s," % js_str(it["hint"]))
    lines.append(p2 + "\"answerOptions\": [")
    opts = it["answerOptions"]
    for i, opt in enumerate(opts):
        comma = "," if i < len(opts) - 1 else ""
        lines.append(p3 + emit_option(opt) + comma)
    lines.append(p2 + "]")
    lines.append(pad + "}")
    return "\n".join(lines)


def emit_micro_block(video_id, comment, items):
    lines = []
    lines.append("        /* %s */" % comment)
    lines.append("        %s: [" % js_str(video_id))
    for i, it in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        lines.append(emit_item(it, 12) + comma)
    lines.append("        ]")
    return "\n".join(lines)


def emit_unit_block(title, items):
    lines = []
    lines.append("        %s: [" % js_str(title))
    for i, it in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        lines.append(emit_item(it, 12) + comma)
    lines.append("        ]")
    return "\n".join(lines)


def build_micro_js():
    blocks = [emit_micro_block(v, c, its) for (v, c, its) in MICRO]
    return ",\n\n".join(blocks)


def update_js():
    with open(JS_PATH, "r", encoding="utf-8") as f:
        src = f.read()

    # --- splice micro_practice (append before unit_mastery) ---
    micro_marker = "        ]\n\n    },\n\n    unit_mastery: {"
    assert src.count(micro_marker) == 1, "micro marker not unique"
    micro_new = build_micro_js()
    micro_replacement = "        ],\n\n" + micro_new + "\n\n    },\n\n    unit_mastery: {"
    src = src.replace(micro_marker, micro_replacement)

    # --- splice unit_mastery (append both units at end of file) ---
    end_marker = "        ]\n\n    }\n\n};"
    assert src.count(end_marker) == 1, "end marker not unique"
    unit_new = (emit_unit_block(UNIT13_TITLE, MASTERY_13) + ",\n\n"
                + emit_unit_block(UNIT14_TITLE, MASTERY_14))
    end_replacement = "        ],\n\n" + unit_new + "\n\n    }\n\n};"
    src = src.replace(end_marker, end_replacement)

    with open(JS_PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(src)
    print("[+] quiz-data.js updated")


def update_json():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    def strip_item(it):
        opts = []
        for o in it["answerOptions"]:
            if o.get("correct"):
                opts.append({"text": o["text"], "correct": True, "rationale": o["rationale"]})
            else:
                opts.append({"text": o["text"], "rationale": o["rationale"]})
        return {"id": it["id"], "prompt": it["prompt"], "hint": it["hint"], "answerOptions": opts}

    for (v, c, its) in MICRO:
        data["micro_practice"][v] = [strip_item(it) for it in its]
    data["unit_mastery"][UNIT13_TITLE] = [strip_item(it) for it in MASTERY_13]
    data["unit_mastery"][UNIT14_TITLE] = [strip_item(it) for it in MASTERY_14]

    with open(JSON_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print("[+] quizzes.json mirror updated")


def validate():
    bad = []

    def check(s, where):
        if "—" in s or "–" in s or "&" in s:
            bad.append((where, s))

    for (v, c, its) in MICRO:
        for it in its:
            check(it["prompt"], it["id"] + ".prompt")
            check(it["hint"], it["id"] + ".hint")
            for o in it["answerOptions"]:
                check(o["text"], it["id"] + ".text")
                check(o["rationale"], it["id"] + ".rationale")
    for it in MASTERY_13 + MASTERY_14:
        check(it["prompt"], it["id"] + ".prompt")
        check(it["hint"], it["id"] + ".hint")
        for o in it["answerOptions"]:
            check(o["text"], it["id"] + ".text")
            check(o["rationale"], it["id"] + ".rationale")

    def one_correct(its, label):
        for it in its:
            n = sum(1 for o in it["answerOptions"] if o.get("correct"))
            assert n == 1, "%s %s has %d correct" % (label, it["id"], n)
            assert len(it["answerOptions"]) == 4, "%s %s not 4 options" % (label, it["id"])

    seen_ids = set()
    for (v, c, its) in MICRO:
        assert len(its) == 5, "%s not 5 items" % v
        one_correct(its, "micro")
        for it in its:
            assert it["id"] not in seen_ids, "duplicate id %s" % it["id"]
            seen_ids.add(it["id"])
    assert len(MICRO) == 18, "expected 18 micro videos, got %d" % len(MICRO)
    assert len(MASTERY_13) == 30, "Unit 13 mastery not 30 items, got %d" % len(MASTERY_13)
    assert len(MASTERY_14) == 30, "Unit 14 mastery not 30 items, got %d" % len(MASTERY_14)
    one_correct(MASTERY_13, "mastery13")
    one_correct(MASTERY_14, "mastery14")
    for it in MASTERY_13 + MASTERY_14:
        assert it["id"] not in seen_ids, "duplicate id %s" % it["id"]
        seen_ids.add(it["id"])

    if bad:
        for where, s in bad:
            print("[!] FORBIDDEN CHAR in", where, "->", s)
        raise SystemExit("Validation failed: forbidden characters present")
    print("[+] validation passed: %d micro videos, %d + %d mastery items, copy rules OK"
          % (len(MICRO), len(MASTERY_13), len(MASTERY_14)))


if __name__ == "__main__":
    validate()
    update_js()
    update_json()
    print("[+] Unit 13 and Unit 14 quiz generation complete")
