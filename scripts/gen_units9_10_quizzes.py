#!/usr/bin/env python3
"""
Generate Unit 9 (Second-Order Linear Equations, Theory and Structure) and
Unit 10 (Nonhomogeneous Equations and Forced Response) interactive quizzes in a
single batch.

Authors the 31 video micro-practice quizzes (five items each) and the two 30
item unit mastery quizzes as one Python source of truth, then:
  1. Emits JS object literal text and splices it into ode/js/quiz-data.js, into
     the existing micro_practice and unit_mastery objects (append only).
  2. Updates the documentation mirror ode/data/quizzes.json so both stay in sync.

Canonical math strings here use SINGLE backslashes (raw strings). json.dumps
performs the escaping, which is identical for JS source literals and JSON, so
the emitted \\frac in both files evaluates to a single backslash at runtime.

Copy rule: no em dashes and no ampersands in any user facing string.
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS_PATH = os.path.join(ROOT, "app", "js", "quiz-data.js")
JSON_PATH = os.path.join(ROOT, "app", "data", "quizzes.json")

UNIT9_TITLE = "Unit 9: Second-Order Linear Equations, Theory and Structure"
UNIT10_TITLE = "Unit 10: Nonhomogeneous Equations and Forced Response"


def C(text, rationale):
    return {"text": text, "correct": True, "rationale": rationale}


def W(text, rationale):
    return {"text": text, "rationale": rationale}


def item(qid, prompt, hint, options):
    return {"id": qid, "prompt": prompt, "hint": hint, "answerOptions": options}


MICRO = []  # list of (video_id, comment_line, [items])


def add_micro(video_id, comment, items):
    MICRO.append((video_id, comment, items))


MASTERY_9 = []
MASTERY_10 = []


def m9(qid, prompt, hint, options):
    MASTERY_9.append(item(qid, prompt, hint, options))


def m10(qid, prompt, hint, options):
    MASTERY_10.append(item(qid, prompt, hint, options))


# ============================================================================
# CONTENT  (inserted above the machinery marker)
# ============================================================================

# ============================================================================
# UNIT 9 MICRO PRACTICE
# ============================================================================

# === 9.1 video 1 ============================================================
add_micro(
    "xCCeV-glFdM",
    'Unit 9, Module 9.1, video 1\n           "Second Order Equations"',
    [
        item(
            "mp_xCCeV-glFdM_1",
            r"What feature makes a differential equation second order?",
            r"The order of an equation is named for the highest derivative that appears in it.",
            [
                C(r"The highest derivative present is $y''$", r"Yes. Order is set by the highest derivative, so a second-order equation contains $y''$ and no higher."),
                W(r"It contains exactly two terms", r"Term count does not set the order. Which derivative being present fixes the order?"),
                W(r"It has two solutions", r"Solution count is a consequence, not the definition. What derivative names the order?"),
                W(r"The coefficients are quadratic in $x$", r"The shape of the coefficients does not set order. What is the highest derivative that must appear?"),
            ],
        ),
        item(
            "mp_xCCeV-glFdM_2",
            r"Which is the general form of a linear second-order differential equation?",
            r"Linear means $y$, $y'$, and $y''$ each appear to the first power and are not multiplied together.",
            [
                C(r"$a(x)\,y'' + b(x)\,y' + c(x)\,y = g(x)$", r"Yes. Each of $y$, $y'$, $y''$ appears to the first power with coefficients depending only on $x$."),
                W(r"$a(x)\,y'' + b(x)\,(y')^2 + c(x)\,y = g(x)$", r"A squared derivative breaks linearity. To what power may each derivative appear in a linear equation?"),
                W(r"$y'' \cdot y' + c(x)\,y = g(x)$", r"Multiplying two derivatives together is nonlinear. How must the derivative terms combine in a linear equation?"),
                W(r"$a(x)\,y'' = \sin(y)$", r"A function like $\sin(y)$ makes the dependence on $y$ nonlinear. How must $y$ enter a linear equation?"),
            ],
        ),
        item(
            "mp_xCCeV-glFdM_3",
            r"A second-order linear equation is called homogeneous when which condition holds?",
            r"Homogeneous here refers to the forcing term on the right-hand side.",
            [
                C(r"The right-hand side $g(x)$ is zero", r"Yes. With $g(x) = 0$ the equation is homogeneous; a nonzero $g(x)$ makes it nonhomogeneous."),
                W(r"All coefficients are constant", r"Constant coefficients are a separate property. What must the forcing term equal for homogeneity?"),
                W(r"The equation has no $y$ term", r"A missing $y$ term is unrelated to homogeneity. What value of $g(x)$ defines it?"),
                W(r"$y'' = y$", r"That is one particular equation, not the defining condition. What about the right-hand side makes an equation homogeneous?"),
            ],
        ),
        item(
            "mp_xCCeV-glFdM_4",
            r"How many arbitrary constants appear in the general solution of a second-order linear equation?",
            r"The number of free constants matches the order of the equation.",
            [
                C(r"Two", r"Yes. A second-order equation carries two arbitrary constants, fixed by two side conditions."),
                W(r"One", r"One constant suits a first-order equation. How does the constant count relate to the order here?"),
                W(r"Three", r"Three constants would suit a third-order equation. What is the order of this equation?"),
                W(r"Zero", r"A general solution is a family, not a single curve. How many free constants does order two give?"),
            ],
        ),
        item(
            "mp_xCCeV-glFdM_5",
            r"Which equation is nonlinear?",
            r"Scan for derivatives or $y$ raised to powers other than one, or products of those quantities.",
            [
                C(r"$y'' + (y')^2 = 0$", r"Yes. The term $(y')^2$ raises a derivative to the second power, so the equation is nonlinear."),
                W(r"$y'' + 3y' + 2y = 0$", r"Every term here is first power in $y$ or its derivatives. Does any term square a derivative?"),
                W(r"$x^2 y'' + x y' + y = 0$", r"The coefficients depend on $x$, but the derivatives are first power. Is that linear or nonlinear?"),
                W(r"$y'' + y = \sin x$", r"Here $\sin x$ is just a forcing term in $x$, not $\sin y$. Are the $y$ terms first power?"),
            ],
        ),
    ],
)

# === 9.1 video 2 ============================================================
add_micro(
    "fi54Hz5TiWI",
    'Unit 9, Module 9.1, video 2\n           "More Examples of Second Order Differential Equations"',
    [
        item(
            "mp_fi54Hz5TiWI_1",
            r"Is $y = \cos x$ a solution of $y'' + y = 0$?",
            r"Compute $y''$ for $y = \cos x$ and substitute into the equation.",
            [
                C(r"Yes, since $y'' = -\cos x$ and $-\cos x + \cos x = 0$", r"Correct. The second derivative cancels $y$, so the equation holds."),
                W(r"No, since $y'' = \cos x$", r"Recompute. What is the second derivative of $\cos x$?"),
                W(r"No, since $\cos x$ is not differentiable twice", r"Cosine is smooth and differentiable to all orders. What does substituting $y''$ give?"),
                W(r"Yes, but only at $x = 0$", r"A solution must satisfy the equation for all $x$, and this one does. What is $y'' + y$ in general here?"),
            ],
        ),
        item(
            "mp_fi54Hz5TiWI_2",
            r"What is the general solution of $y'' = 0$?",
            r"Integrate twice, picking up one constant at each integration.",
            [
                C(r"$y = c_1 x + c_2$", r"Yes. Integrating $y'' = 0$ once gives a constant slope, and again gives a linear function with two constants."),
                W(r"$y = c_1 x^2 + c_2$", r"Integrating zero does not produce a quadratic. What do two integrations of zero give?"),
                W(r"$y = c_1 e^x + c_2 e^{-x}$", r"Exponentials solve $y'' = y$, not $y'' = 0$. What functions have zero second derivative?"),
                W(r"$y = c_1$", r"That has only one constant, too few for second order. How many constants should appear, and what is the form?"),
            ],
        ),
        item(
            "mp_fi54Hz5TiWI_3",
            r"How many initial conditions are needed to pin down a unique solution of a second-order equation?",
            r"Match the number of conditions to the number of arbitrary constants.",
            [
                C(r"Two, typically $y(x_0)$ and $y'(x_0)$", r"Yes. Two constants require two conditions, usually the value and slope at a point."),
                W(r"One, just $y(x_0)$", r"One condition leaves a constant undetermined. How many constants must be fixed?"),
                W(r"Three", r"Three would over-determine a two-constant family. How many free constants are there?"),
                W(r"None, the solution is already unique", r"The general solution is a two-parameter family. How many conditions select one member?"),
            ],
        ),
        item(
            "mp_fi54Hz5TiWI_4",
            r"If $y_1$ and $y_2$ both solve the same homogeneous linear equation, what can you say about $c_1 y_1 + c_2 y_2$?",
            r"This is the superposition principle for linear homogeneous equations.",
            [
                C(r"It also solves the equation for any constants $c_1, c_2$", r"Yes. Superposition says any linear combination of homogeneous solutions is again a solution."),
                W(r"It solves the equation only if $c_1 = c_2$", r"No special relation between the constants is required. What does linearity allow for any combination?"),
                W(r"It never solves the equation", r"Linear combinations of homogeneous solutions do solve it. What principle guarantees this?"),
                W(r"It solves a different equation", r"The combination stays a solution of the same homogeneous equation. Why does linearity preserve it?"),
            ],
        ),
        item(
            "mp_fi54Hz5TiWI_5",
            r"Which equation has variable coefficients rather than constant coefficients?",
            r"Look at whether the multipliers of $y''$, $y'$, and $y$ are numbers or functions of $x$.",
            [
                C(r"$x^2 y'' + x y' + y = 0$", r"Yes. The coefficients $x^2$ and $x$ depend on $x$, so this has variable coefficients."),
                W(r"$y'' + 5y' + 6y = 0$", r"All multipliers here are numbers. Are those constant or variable coefficients?"),
                W(r"$2y'' - 3y' + y = 0$", r"Each coefficient is a fixed number. Does $x$ appear as a multiplier anywhere?"),
                W(r"$y'' + 4y = 0$", r"The coefficients $1$ and $4$ are constants. Which option instead multiplies a derivative by a function of $x$?"),
            ],
        ),
    ],
)

# === 9.2 video 1 ============================================================
add_micro(
    "VpZOuOJ_ob4",
    'Unit 9, Module 9.2, video 1\n           "The Theory of 2nd Order ODEs, Existence and Uniqueness, Superposition, Linear Independence"',
    [
        item(
            "mp_VpZOuOJ_ob4_1",
            r"For $y'' + p(x)\,y' + q(x)\,y = g(x)$ with an initial point $x_0$, the existence and uniqueness theorem guarantees a unique solution provided what?",
            r"The theorem asks for continuity of the coefficient functions on an interval containing the start point.",
            [
                C(r"$p$, $q$, and $g$ are continuous on an interval containing $x_0$", r"Yes. Continuity of the coefficients and forcing on an interval around $x_0$ guarantees a unique solution there."),
                W(r"$p$, $q$, and $g$ are constant", r"Constancy is stronger than needed. What weaker property of these functions does the theorem actually require?"),
                W(r"$g(x) = 0$", r"The theorem covers nonhomogeneous equations too. What must be true of $p$, $q$, and $g$ near $x_0$?"),
                W(r"The equation is separable", r"Separability is unrelated to this theorem. What continuity hypothesis is needed?"),
            ],
        ),
        item(
            "mp_VpZOuOJ_ob4_2",
            r"Writing $L[y] = y'' + p\,y' + q\,y$, the linearity of $L$ means $L[c_1 y_1 + c_2 y_2]$ equals what?",
            r"A linear operator distributes over sums and pulls out constant multipliers.",
            [
                C(r"$c_1 L[y_1] + c_2 L[y_2]$", r"Yes. The operator $L$ is linear, so it distributes across the combination and factors out the constants."),
                W(r"$L[y_1] \cdot L[y_2]$", r"Linearity gives a sum, not a product. How does a linear operator act on a sum of scaled inputs?"),
                W(r"$c_1 c_2 L[y_1 + y_2]$", r"The constants do not multiply together. How do $c_1$ and $c_2$ attach to each term?"),
                W(r"$L[y_1] + L[y_2]$", r"You dropped the constants $c_1$ and $c_2$. Where do those multipliers go?"),
            ],
        ),
        item(
            "mp_VpZOuOJ_ob4_3",
            r"Why does superposition build solutions for the homogeneous equation $L[y] = 0$ but not directly for $L[y] = g$ with $g \neq 0$?",
            r"Apply the linear operator to a sum of two solutions in each case and see what the right-hand side becomes.",
            [
                C(r"Adding two solutions of $L[y] = g$ gives $L = 2g$, not $g$, while adding solutions of $L[y] = 0$ stays zero", r"Yes. Zero is preserved under addition, but a nonzero $g$ doubles, so the homogeneous case is special."),
                W(r"Superposition works equally for both", r"Test it on $L[y] = g$: adding two solutions gives $L = 2g$. Does that still equal $g$?"),
                W(r"The nonhomogeneous equation has no solutions", r"It does have solutions. What goes wrong when you add two of them under $L$?"),
                W(r"Because $g$ is not continuous", r"Continuity is not the issue. What value does $L$ give when you add two particular solutions?"),
            ],
        ),
        item(
            "mp_VpZOuOJ_ob4_4",
            r"For a homogeneous linear second-order equation, the largest interval on which the unique solution is guaranteed is determined by what?",
            r"The solution is guaranteed wherever the hypotheses of the existence theorem hold.",
            [
                C(r"The largest interval containing $x_0$ on which $p$ and $q$ are continuous", r"Yes. The guaranteed interval extends as far as the coefficient functions remain continuous around $x_0$."),
                W(r"The interval where $y$ stays positive", r"The sign of $y$ does not bound the interval. What property of the coefficients sets it?"),
                W(r"A fixed interval of length one", r"There is no fixed length. What feature of $p$ and $q$ controls how far the solution extends?"),
                W(r"The spacing of the initial conditions", r"Both conditions sit at one point $x_0$. What continuity property determines the interval?"),
            ],
        ),
        item(
            "mp_VpZOuOJ_ob4_5",
            r"Two solutions $y_1, y_2$ of a homogeneous second-order linear equation form a fundamental set when they are what?",
            r"A fundamental set must be rich enough to express every solution as a combination of its members.",
            [
                C(r"Linearly independent", r"Yes. Two linearly independent solutions form a fundamental set whose combinations give the general solution."),
                W(r"Equal to each other", r"Identical solutions cannot span a two-parameter family. What relationship must they avoid?"),
                W(r"Both equal to zero", r"The zero function carries no information. What independence property is required?"),
                W(r"Proportional", r"Proportional solutions are dependent and span too little. What must be true instead?"),
            ],
        ),
    ],
)

# === 9.2 video 2 ============================================================
add_micro(
    "S-wzapPZGzE",
    'Unit 9, Module 9.2, video 2\n           "3.3 Linear Independence and the Wronskian"',
    [
        item(
            "mp_S-wzapPZGzE_1",
            r"Two functions $y_1$ and $y_2$ are linearly independent on an interval when which statement holds?",
            r"Independence means no nontrivial constant combination vanishes identically.",
            [
                C(r"$c_1 y_1 + c_2 y_2 = 0$ for all $x$ forces $c_1 = c_2 = 0$", r"Yes. Only the trivial choice of constants makes the combination vanish everywhere, which is independence."),
                W(r"$y_1 + y_2 = 0$ for all $x$", r"That is one specific combination, not the definition. What must be true of every constant combination that vanishes?"),
                W(r"$y_1$ and $y_2$ are never zero", r"Independence is about combinations, not about either function being nonzero. What condition on $c_1, c_2$ defines it?"),
                W(r"$y_1 = c\,y_2$ for some constant $c$", r"That describes dependence, the opposite case. What does independence require of the constants?"),
            ],
        ),
        item(
            "mp_S-wzapPZGzE_2",
            r"The Wronskian of $y_1$ and $y_2$ is defined as which expression?",
            r"It is the determinant of the matrix whose rows are the functions and their first derivatives.",
            [
                C(r"$W = y_1 y_2' - y_2 y_1'$", r"Yes. The Wronskian is the determinant $y_1 y_2' - y_2 y_1'$."),
                W(r"$W = y_1 y_2' + y_2 y_1'$", r"A determinant uses a difference, not a sum. Which sign joins the two product terms?"),
                W(r"$W = y_1 y_2 - y_1' y_2'$", r"The pairing crosses functions with derivatives. Which products belong in the Wronskian?"),
                W(r"$W = y_1' y_2' - y_1 y_2$", r"That pairs both derivatives and both functions incorrectly. What are the correct cross products?"),
            ],
        ),
        item(
            "mp_S-wzapPZGzE_3",
            r"If the Wronskian $W(x_0) \neq 0$ at some point, what does that tell you about $y_1$ and $y_2$?",
            r"A nonzero Wronskian at a point is a sufficient test for independence.",
            [
                C(r"They are linearly independent", r"Yes. A nonzero Wronskian at any point certifies linear independence."),
                W(r"They are linearly dependent", r"A nonzero Wronskian points the other way. What does a nonzero value certify?"),
                W(r"One of them is zero", r"Neither function need vanish. What independence conclusion follows from $W \neq 0$?"),
                W(r"They solve different equations", r"The Wronskian says nothing about which equation they solve. What does $W \neq 0$ imply about independence?"),
            ],
        ),
        item(
            "mp_S-wzapPZGzE_4",
            r"When $y_1, y_2$ are independent solutions, the general solution of the homogeneous equation is what?",
            r"A fundamental set spans all solutions through linear combinations.",
            [
                C(r"$y = c_1 y_1 + c_2 y_2$", r"Yes. Every solution is a linear combination of the two independent solutions."),
                W(r"$y = y_1 y_2$", r"Solutions combine by addition with constants, not by multiplication. What is the spanning form?"),
                W(r"$y = c_1 y_1$", r"That uses only one solution and one constant. How many independent pieces span a second-order solution space?"),
                W(r"$y = c_1 y_1 + c_2 y_2 + c_3$", r"A bare extra constant is not a solution of the homogeneous equation in general. What is the correct two-term form?"),
            ],
        ),
        item(
            "mp_S-wzapPZGzE_5",
            r"Compute the Wronskian of $y_1 = e^{x}$ and $y_2 = e^{2x}$.",
            r"Use $W = y_1 y_2' - y_2 y_1'$ with $y_1' = e^x$ and $y_2' = 2e^{2x}$.",
            [
                C(r"$W = e^{3x}$", r"Correct. $e^x \cdot 2e^{2x} - e^{2x} \cdot e^x = 2e^{3x} - e^{3x} = e^{3x}$."),
                W(r"$W = 0$", r"These exponentials are not proportional, so $W$ is nonzero. Recompute $y_1 y_2' - y_2 y_1'$."),
                W(r"$W = 3e^{3x}$", r"Check the subtraction: $2e^{3x} - e^{3x}$. What is the coefficient?"),
                W(r"$W = e^{2x}$", r"Each product is a multiple of $e^{3x}$, not $e^{2x}$. What exponent results from $e^x \cdot e^{2x}$?"),
            ],
        ),
    ],
)

# === 9.3 video 1 ============================================================
add_micro(
    "4z5aL3aGVQs",
    'Unit 9, Module 9.3, video 1\n           "Linear Independence of Functions and The Wronskian"',
    [
        item(
            "mp_4z5aL3aGVQs_1",
            r"Compute the Wronskian of $y_1 = x$ and $y_2 = 2x$.",
            r"Use $W = y_1 y_2' - y_2 y_1'$ with $y_1' = 1$ and $y_2' = 2$.",
            [
                C(r"$W = 0$", r"Correct. $x \cdot 2 - 2x \cdot 1 = 2x - 2x = 0$, consistent with these proportional functions."),
                W(r"$W = 2x$", r"Recheck the subtraction $2x - 2x$. What does it equal?"),
                W(r"$W = -2x$", r"Both products equal $2x$, so they cancel. What is $2x - 2x$?"),
                W(r"$W = 2$", r"You may have stopped at the derivatives. Carry out $y_1 y_2' - y_2 y_1'$ fully."),
            ],
        ),
        item(
            "mp_4z5aL3aGVQs_2",
            r"The functions $y_1 = x$ and $y_2 = 2x$ have $W = 0$. What does this reflect?",
            r"They are constant multiples of one another.",
            [
                C(r"They are linearly dependent, since $y_2 = 2 y_1$", r"Yes. One is a constant multiple of the other, so they are dependent and $W = 0$."),
                W(r"They are independent", r"Proportional functions are not independent. What relationship between $x$ and $2x$ shows dependence?"),
                W(r"They cannot both be solutions", r"Both can be solutions; their dependence is the point. What multiple links them?"),
                W(r"The Wronskian was computed wrong", r"The value $0$ is correct for proportional functions. What does $y_2 = 2y_1$ tell you?"),
            ],
        ),
        item(
            "mp_4z5aL3aGVQs_3",
            r"Compute the Wronskian of $y_1 = \sin x$ and $y_2 = \cos x$.",
            r"Use $W = y_1 y_2' - y_2 y_1'$ with $y_1' = \cos x$ and $y_2' = -\sin x$.",
            [
                C(r"$W = -1$", r"Correct. $\sin x(-\sin x) - \cos x(\cos x) = -\sin^2 x - \cos^2 x = -1$."),
                W(r"$W = 1$", r"Check the signs: both products are negative. What is $-\sin^2 x - \cos^2 x$?"),
                W(r"$W = 0$", r"Sine and cosine are independent, so $W \neq 0$. Recompute the determinant."),
                W(r"$W = \sin x \cos x$", r"The cross terms simplify using $\sin^2 x + \cos^2 x = 1$. What constant results?"),
            ],
        ),
        item(
            "mp_4z5aL3aGVQs_4",
            r"A nonzero Wronskian on an interval certifies which property of the two functions?",
            r"Recall what conclusion a nonvanishing Wronskian supports.",
            [
                C(r"Linear independence", r"Yes. If $W$ is nonzero somewhere, the functions are linearly independent."),
                W(r"Linear dependence", r"That is the opposite conclusion. What does a nonzero Wronskian establish?"),
                W(r"That both are constant", r"Constancy is unrelated. What independence property does $W \neq 0$ certify?"),
                W(r"That they are equal", r"Equal functions would have $W = 0$. What does a nonzero value indicate?"),
            ],
        ),
        item(
            "mp_4z5aL3aGVQs_5",
            r"For two solutions of the same homogeneous linear equation, the Wronskian behaves how across an interval?",
            r"Abel's theorem constrains the Wronskian of solutions to one of two extremes.",
            [
                C(r"It is either zero everywhere or nonzero everywhere", r"Yes. For solutions of one linear equation, the Wronskian cannot be zero at some points and nonzero at others."),
                W(r"It can be zero at some points and nonzero at others", r"That mixed behavior is exactly what Abel's theorem rules out for solutions. What are the only two options?"),
                W(r"It is always exactly one", r"The value is not pinned to one. What dichotomy does Abel's theorem give instead?"),
                W(r"It always changes sign", r"There is no forced sign change. What two global possibilities does the theorem allow?"),
            ],
        ),
    ],
)

# === 9.3 video 2 ============================================================
add_micro(
    "clc2poliklA",
    'Unit 9, Module 9.3, video 2\n           "How Does the Wronskian Test for Linear Independence, Proof"',
    [
        item(
            "mp_clc2poliklA_1",
            r"The proof shows that if $y_1$ and $y_2$ are linearly dependent, then their Wronskian is what?",
            r"Dependence means one function is a constant multiple of the other; substitute that in.",
            [
                C(r"Identically zero", r"Yes. If $y_2 = c\,y_1$, the determinant collapses and $W = 0$ everywhere."),
                W(r"Nonzero everywhere", r"Dependence forces the determinant to vanish. What value does $W$ take when $y_2 = c\,y_1$?"),
                W(r"Equal to $c$", r"The Wronskian does not equal the proportionality constant. What does substituting $y_2 = c\,y_1$ give?"),
                W(r"Equal to one", r"A dependent pair gives a vanishing determinant. What is $W$ then?"),
            ],
        ),
        item(
            "mp_clc2poliklA_2",
            r"Taking the contrapositive, if the Wronskian is nonzero at a point, then the functions must be what?",
            r"The contrapositive of dependence implying $W = 0$ flips both statements.",
            [
                C(r"Linearly independent", r"Yes. The contrapositive of dependence forcing $W = 0$ is that $W \neq 0$ forces independence."),
                W(r"Still possibly dependent", r"Dependence forces $W = 0$ everywhere, so $W \neq 0$ excludes it. What is the only remaining case?"),
                W(r"Proportional", r"Proportional functions have $W = 0$. What does a nonzero value rule out and therefore imply?"),
                W(r"Equal", r"Equal functions give $W = 0$. What does $W \neq 0$ force instead?"),
            ],
        ),
        item(
            "mp_clc2poliklA_3",
            r"Why is the Wronskian written as a determinant of $y_1, y_2$ and their first derivatives?",
            r"Think about the linear system you get by differentiating $c_1 y_1 + c_2 y_2 = 0$ once.",
            [
                C(r"The system for $c_1, c_2$ from the combination and its derivative has that matrix, and a nonzero determinant forces $c_1 = c_2 = 0$", r"Yes. The determinant decides whether the only solution of that system is the trivial one."),
                W(r"It is an arbitrary definition with no system behind it", r"There is a linear system behind it. What equations in $c_1, c_2$ produce this determinant?"),
                W(r"Because determinants are always zero", r"Determinants are generally nonzero. What role does this particular determinant play for $c_1, c_2$?"),
                W(r"Because $y_1 = y_2$ by assumption", r"The functions are not assumed equal. What system of equations makes the determinant relevant?"),
            ],
        ),
        item(
            "mp_clc2poliklA_4",
            r"A subtle point: for arbitrary functions, $W = 0$ at a point does not by itself prove dependence. Why is the test cleaner for solutions of a linear ODE?",
            r"Abel's theorem applies only when the functions solve a common linear equation.",
            [
                C(r"For solutions of one linear equation, $W$ is zero everywhere or nowhere, so a single zero implies dependence", r"Yes. Abel's dichotomy removes the loophole that affects arbitrary functions."),
                W(r"Because solutions are always proportional", r"Solutions need not be proportional. What special property of $W$ for solutions sharpens the test?"),
                W(r"Because the Wronskian is undefined for solutions", r"The Wronskian is perfectly defined for solutions. What does Abel's theorem add?"),
                W(r"Because arbitrary functions have no derivatives", r"Arbitrary smooth functions do have derivatives. What is special about $W$ for ODE solutions?"),
            ],
        ),
        item(
            "mp_clc2poliklA_5",
            r"Two functions are proportional on an interval. What is the most direct conclusion about independence?",
            r"Proportional means a single constant multiple connects them.",
            [
                C(r"They are linearly dependent", r"Yes. Proportional functions are dependent, since one is a constant multiple of the other."),
                W(r"They are linearly independent", r"Proportionality is exactly dependence. What conclusion follows?"),
                W(r"Nothing can be concluded", r"Proportionality settles it immediately. What does a constant multiple relationship mean?"),
                W(r"They must be equal", r"Proportional is weaker than equal. What independence status does proportionality give?"),
            ],
        ),
    ],
)

# === 9.4 video 1 ============================================================
add_micro(
    "wJspS9lQsHM",
    'Unit 9, Module 9.4, video 1\n           "Abel\'s Identity Explained and Proved Step by Step"',
    [
        item(
            "mp_wJspS9lQsHM_1",
            r"For $y'' + p(x)\,y' + q(x)\,y = 0$, Abel's identity gives the Wronskian as which expression?",
            r"The Wronskian solves a first-order equation whose solution is an exponential of an integral.",
            [
                C(r"$W(x) = W(x_0)\,\exp\!\left(-\int p(x)\,dx\right)$", r"Yes. Abel's identity expresses $W$ as a constant times $\exp(-\int p\,dx)$."),
                W(r"$W(x) = W(x_0)\,\exp\!\left(\int p(x)\,dx\right)$", r"Check the sign in the exponent. Does Abel's formula use $+\int p$ or $-\int p$?"),
                W(r"$W(x) = W(x_0)\,\exp\!\left(-\int q(x)\,dx\right)$", r"The exponent uses the first-derivative coefficient, not $q$. Which coefficient appears?"),
                W(r"$W(x) = W(x_0) + \int p(x)\,dx$", r"The dependence is exponential, not additive. What function wraps the integral of $p$?"),
            ],
        ),
        item(
            "mp_wJspS9lQsHM_2",
            r"The proof shows the Wronskian satisfies which first-order differential equation?",
            r"Differentiate $W = y_1 y_2' - y_2 y_1'$ and use the original equation for each $y_i''$.",
            [
                C(r"$W' = -p(x)\,W$", r"Yes. Differentiating $W$ and substituting the ODE yields $W' = -p\,W$."),
                W(r"$W' = p(x)\,W$", r"Check the sign you obtain after substituting $y_i'' = -p y_i' - q y_i$. Is the coefficient $+p$ or $-p$?"),
                W(r"$W' = -q(x)\,W$", r"The surviving coefficient is the one on $y'$, not on $y$. Which function multiplies $W$?"),
                W(r"$W' = W^2$", r"The equation for $W$ is linear, not quadratic. What linear relation does $W'$ satisfy?"),
            ],
        ),
        item(
            "mp_wJspS9lQsHM_3",
            r"If $p(x) = 0$ in the equation $y'' + q(x)\,y = 0$, what does Abel's identity say about $W$?",
            r"Set the exponent to zero in the Abel formula.",
            [
                C(r"$W$ is constant", r"Yes. With $p = 0$ the exponential is $1$, so $W$ stays constant."),
                W(r"$W$ grows exponentially", r"Growth requires a nonzero $p$. What does $\exp(0)$ equal, and what does that make $W$?"),
                W(r"$W = 0$", r"A zero $p$ does not force $W = 0$. What constant behavior does $\exp(-\int 0\,dx)$ give?"),
                W(r"$W$ oscillates", r"No oscillation arises from a constant factor. What is $W$ when the exponent vanishes?"),
            ],
        ),
        item(
            "mp_wJspS9lQsHM_4",
            r"Abel's identity confirms that the Wronskian of two solutions is either always zero or never zero. Why?",
            r"An exponential factor is never zero, so the sign of $W$ is fixed by the constant $W(x_0)$.",
            [
                C(r"The exponential factor is never zero, so $W$ vanishes only if $W(x_0) = 0$, and then everywhere", r"Yes. Since $\exp(\cdot) \neq 0$, the whole product is zero exactly when the leading constant is zero."),
                W(r"Because $p$ is always positive", r"The sign of $p$ is irrelevant here. What property of the exponential forces the dichotomy?"),
                W(r"Because solutions are periodic", r"Periodicity is not assumed. What feature of $\exp$ prevents $W$ from crossing zero?"),
                W(r"Because $W$ is linear in $x$", r"$W$ is generally not linear. Why can an exponential factor never make $W$ cross zero?"),
            ],
        ),
        item(
            "mp_wJspS9lQsHM_5",
            r"For $y'' - 3y' + 2y = 0$, Abel's identity gives the Wronskian proportional to which function?",
            r"Here $p = -3$, so the exponent is $-\int p\,dx = 3x$.",
            [
                C(r"$e^{3x}$", r"Correct. With $p = -3$, $W \propto \exp(-\int(-3)\,dx) = e^{3x}$."),
                W(r"$e^{-3x}$", r"Watch the double sign: the exponent is $-\int p$ with $p = -3$. What is $-(-3x)$?"),
                W(r"$e^{2x}$", r"The exponent comes from $p$, the coefficient of $y'$, not from the $y$ coefficient $2$. What is $-\int p\,dx$?"),
                W(r"a constant", r"A constant Wronskian needs $p = 0$, but here $p = -3$. What exponential results?"),
            ],
        ),
    ],
)

# === 9.4 video 2 ============================================================
add_micro(
    "h4w3euxv_i4",
    'Unit 9, Module 9.4, video 2\n           "Abel\'s Formula for the Wronskian"',
    [
        item(
            "mp_h4w3euxv_i4_1",
            r"Before applying Abel's formula, an equation $a(x)\,y'' + b(x)\,y' + c(x)\,y = 0$ should first be put in which form?",
            r"Abel's $p$ is read off only after the leading coefficient is one.",
            [
                C(r"Standard form $y'' + \frac{b}{a}\,y' + \frac{c}{a}\,y = 0$, so $p = \frac{b}{a}$", r"Yes. Divide by $a(x)$ so the $y''$ coefficient is one, then $p = b/a$."),
                W(r"Leave it as is and use $p = b$", r"Using $b$ directly ignores the leading coefficient $a$. What must you divide by first?"),
                W(r"Multiply through by $a(x)$", r"Multiplying makes the leading coefficient worse, not one. What operation normalizes it?"),
                W(r"Set $a(x) = 0$", r"That would destroy the second-order term. How do you make the $y''$ coefficient equal one?"),
            ],
        ),
        item(
            "mp_h4w3euxv_i4_2",
            r"In $W(x) = W(x_0)\,\exp(-\int p\,dx)$, what determines the sign of the exponent?",
            r"Look at the explicit minus sign in front of the integral of $p$.",
            [
                C(r"The leading minus sign together with the sign of $p$", r"Yes. The formula has a built-in minus, so the exponent is the negative of the integral of $p$."),
                W(r"The sign of $q$", r"The coefficient $q$ does not enter the exponent. Which coefficient and which fixed sign set it?"),
                W(r"Always positive", r"The formula carries an explicit minus sign. How does that affect the exponent?"),
                W(r"The value of $W(x_0)$", r"That constant scales $W$ but does not set the exponent's sign. What does?"),
            ],
        ),
        item(
            "mp_h4w3euxv_i4_3",
            r"Abel's formula is especially useful when you already know one solution and want a second. Which later technique does it support?",
            r"Knowing $W$ and one solution lets you recover the other through an integral.",
            [
                C(r"Reduction of order, which uses $W$ and $y_1$ to build $y_2$", r"Yes. With $W$ from Abel and one solution $y_1$, reduction of order produces a second independent solution."),
                W(r"Separation of variables", r"Separation is a first-order technique unrelated to $W$. Which method uses $y_1$ and $W$ to find $y_2$?"),
                W(r"The Laplace transform", r"Transforms do not rely on the Wronskian this way. What method recovers a second solution from $y_1$ and $W$?"),
                W(r"Undetermined coefficients", r"That targets nonhomogeneous forcing, not a second homogeneous solution. Which method does Abel support?"),
            ],
        ),
        item(
            "mp_h4w3euxv_i4_4",
            r"For $y'' + 2x\,y' + y = 0$, the Abel Wronskian is proportional to which function?",
            r"Here $p = 2x$, so the exponent is $-\int 2x\,dx = -x^2$.",
            [
                C(r"$e^{-x^2}$", r"Correct. $-\int 2x\,dx = -x^2$, so $W \propto e^{-x^2}$."),
                W(r"$e^{x^2}$", r"The formula has a minus sign in the exponent. What is $-\int 2x\,dx$?"),
                W(r"$e^{-2x}$", r"The integral of $2x$ is $x^2$, not $2x$. What is $-\int 2x\,dx$?"),
                W(r"$e^{-x}$", r"Integrating $2x$ raises the power of $x$. What is $\int 2x\,dx$?"),
            ],
        ),
        item(
            "mp_h4w3euxv_i4_5",
            r"What does Abel's formula reveal about the relationship between the two solutions whose Wronskian it computes?",
            r"A nonzero Wronskian is the certificate the formula produces when $W(x_0) \neq 0$.",
            [
                C(r"If $W(x_0) \neq 0$, the solutions are independent for all $x$ in the interval", r"Yes. A nonzero starting value combined with a nonvanishing exponential keeps the pair independent throughout."),
                W(r"They are always dependent", r"A nonzero $W(x_0)$ rules out dependence. What independence does the formula then guarantee?"),
                W(r"They must be equal at $x_0$", r"Equality is not implied. What does $W(x_0) \neq 0$ say about independence?"),
                W(r"Their Wronskian must change sign", r"The exponential prevents sign changes. What stays true about independence across the interval?"),
            ],
        ),
    ],
)

# === 9.5 video 1 ============================================================
add_micro(
    "oQSFW8BIrY0",
    'Unit 9, Module 9.5, video 1\n           "Reduction of Order, Basic Example in Differential Equations"',
    [
        item(
            "mp_oQSFW8BIrY0_1",
            r"Reduction of order finds a second solution by assuming $y_2$ has which form, given a known solution $y_1$?",
            r"The method multiplies the known solution by an unknown function to be determined.",
            [
                C(r"$y_2 = v(x)\,y_1$ for an unknown function $v(x)$", r"Yes. Writing $y_2 = v\,y_1$ and substituting reduces the problem to a first-order equation for $v'$."),
                W(r"$y_2 = v(x) + y_1$", r"The method scales $y_1$, it does not add to it. What product form is assumed for $y_2$?"),
                W(r"$y_2 = y_1^2$", r"Squaring the known solution is not the ansatz. What multiplicative unknown is introduced?"),
                W(r"$y_2 = c\,y_1$ for a constant $c$", r"A constant multiple is dependent and gives nothing new. What kind of multiplier is allowed instead?"),
            ],
        ),
        item(
            "mp_oQSFW8BIrY0_2",
            r"After substituting $y_2 = v y_1$ into the homogeneous equation, which terms cancel?",
            r"The terms with $v$ undifferentiated collect into $v$ times the original equation applied to $y_1$.",
            [
                C(r"The terms multiplying $v$ alone, because $y_1$ already solves the equation", r"Yes. Those terms form $v$ times $L[y_1] = 0$, so they vanish, leaving an equation in $v'$ and $v''$."),
                W(r"The terms with $v''$", r"The highest-derivative terms in $v$ do not cancel; they drive the reduced equation. Which terms vanish because $y_1$ is a solution?"),
                W(r"All terms, leaving $0 = 0$", r"Not everything cancels, or the method would be useless. Which specific group of terms drops out?"),
                W(r"The forcing term", r"The equation is homogeneous, so there is no forcing term. Which terms cancel because of $L[y_1] = 0$?"),
            ],
        ),
        item(
            "mp_oQSFW8BIrY0_3",
            r"Why does the leftover equation become first order in disguise?",
            r"Notice that $v$ itself no longer appears, only its derivatives.",
            [
                C(r"Only $v'$ and $v''$ remain, so substituting $w = v'$ gives a first-order equation in $w$", r"Yes. With $v$ absent, $w = v'$ turns the equation into a first-order one, lowering the order."),
                W(r"Because $v$ is constant", r"If $v$ were constant the solution would be dependent. What lets $w = v'$ reduce the order?"),
                W(r"Because $y_1 = 0$", r"The known solution is not the zero function. What substitution reduces the order of the $v$ equation?"),
                W(r"Because the equation is separable from the start", r"Separability is not the reason. What variable change drops the equation to first order?"),
            ],
        ),
        item(
            "mp_oQSFW8BIrY0_4",
            r"For the repeated-root equation $y'' - 2y' + y = 0$ with known solution $y_1 = e^x$, reduction of order produces which second solution?",
            r"The repeated-root case famously yields the known exponential times $x$.",
            [
                C(r"$y_2 = x e^{x}$", r"Correct. Reduction of order gives $v = x$, so $y_2 = x e^x$, independent of $e^x$."),
                W(r"$y_2 = e^{-x}$", r"This equation has a repeated root, not two distinct ones. What factor times $e^x$ does reduction yield?"),
                W(r"$y_2 = e^{2x}$", r"The characteristic root here is repeated at $1$, not $2$. What second solution does the repeated root give?"),
                W(r"$y_2 = x^2 e^{x}$", r"A double root gives one extra factor of $x$, not two. What is $v$ from the reduction?"),
            ],
        ),
        item(
            "mp_oQSFW8BIrY0_5",
            r"Why must $v(x)$ be nonconstant for $y_2 = v y_1$ to be a genuinely new solution?",
            r"Think about what $y_2$ becomes if $v$ is just a constant.",
            [
                C(r"A constant $v$ makes $y_2$ proportional to $y_1$, hence dependent", r"Yes. Only a nonconstant $v$ produces a solution independent of $y_1$."),
                W(r"A constant $v$ makes $y_2$ undefined", r"$y_2$ stays defined; it just is not new. What dependence problem does a constant $v$ create?"),
                W(r"A constant $v$ changes the equation", r"The equation is unchanged. What happens to the independence of $y_2$ if $v$ is constant?"),
                W(r"It does not matter whether $v$ is constant", r"It matters for independence. What does a constant $v$ do to the relationship between $y_2$ and $y_1$?"),
            ],
        ),
    ],
)

# === 9.5 video 2 ============================================================
add_micro(
    "i9HSsR8aF4I",
    'Unit 9, Module 9.5, video 2\n           "Linear Independence of Solutions vs Wronskian and Reduction of Order"',
    [
        item(
            "mp_i9HSsR8aF4I_1",
            r"The reduction-of-order formula expresses the second solution as which integral, given $y_1$ and $p(x)$?",
            r"The formula integrates the Abel factor divided by the square of the known solution.",
            [
                C(r"$y_2 = y_1 \int \frac{\exp\!\left(-\int p\,dx\right)}{y_1^2}\,dx$", r"Yes. This standard formula builds $y_2$ from $y_1$, the Abel factor, and $y_1^2$."),
                W(r"$y_2 = y_1 \int \frac{\exp\!\left(\int p\,dx\right)}{y_1^2}\,dx$", r"Check the sign of the exponent, which comes from Abel's formula. Is it $+\int p$ or $-\int p$?"),
                W(r"$y_2 = y_1 \int \frac{\exp\!\left(-\int p\,dx\right)}{y_1}\,dx$", r"The denominator should be the square of $y_1$. What power of $y_1$ appears?"),
                W(r"$y_2 = \int \frac{\exp\!\left(-\int p\,dx\right)}{y_1^2}\,dx$", r"The prefactor $y_1$ outside the integral is missing. What multiplies the integral?"),
            ],
        ),
        item(
            "mp_i9HSsR8aF4I_2",
            r"Reduction of order connects to the Wronskian because the quantity $\exp(-\int p\,dx)$ is what?",
            r"Recall Abel's identity for the Wronskian of two solutions.",
            [
                C(r"Proportional to the Wronskian $W$ of the solutions", r"Yes. Abel's identity makes $\exp(-\int p\,dx)$ proportional to $W$, which is why it appears in the formula."),
                W(r"Equal to $y_1$", r"It is not the known solution itself. Which Wronskian quantity does the Abel factor represent?"),
                W(r"Equal to $p(x)$", r"It is built from integrating $p$, not $p$ itself. What Wronskian object is it proportional to?"),
                W(r"Always equal to one", r"It equals one only when $p = 0$. In general, what does it equal up to a constant?"),
            ],
        ),
        item(
            "mp_i9HSsR8aF4I_3",
            r"A key advantage of reduction of order is that it works for which kind of equations?",
            r"The method only needs one known solution and the coefficient $p(x)$, not constant coefficients.",
            [
                C(r"Variable-coefficient equations, as long as one solution is already known", r"Yes. Reduction of order handles variable coefficients whenever a first solution is available."),
                W(r"Only constant-coefficient equations", r"The method does not require constant coefficients. What does it require instead?"),
                W(r"Only homogeneous equations with $p = 0$", r"A nonzero $p$ is fine; it enters through the Abel factor. What single ingredient must you already have?"),
                W(r"Only first-order equations", r"It reduces second-order equations using a known solution. What class of coefficients can it tolerate?"),
            ],
        ),
        item(
            "mp_i9HSsR8aF4I_4",
            r"For $y'' - y = 0$ with known solution $y_1 = e^{x}$, the reduction formula leads to which independent second solution?",
            r"Here $p = 0$, so the integrand is $1/y_1^2 = e^{-2x}$; integrate and multiply by $y_1$.",
            [
                C(r"$y_2 = e^{-x}$ (up to a constant factor)", r"Correct. $\int e^{-2x}\,dx = -\tfrac{1}{2}e^{-2x}$, and $e^x$ times that is proportional to $e^{-x}$."),
                W(r"$y_2 = x e^{x}$", r"The roots here are distinct ($\pm 1$), not repeated. What independent exponential does the integral give?"),
                W(r"$y_2 = e^{2x}$", r"The integral of $e^{-2x}$ times $e^x$ does not give $e^{2x}$. What sign does the new exponent carry?"),
                W(r"$y_2 = e^{x}$", r"That is just $y_1$ again, which is dependent. What different exponential results?"),
            ],
        ),
        item(
            "mp_i9HSsR8aF4I_5",
            r"After reduction of order yields $y_2$, how can you confirm $y_1$ and $y_2$ form a fundamental set?",
            r"Use the independence test built from the two solutions and their derivatives.",
            [
                C(r"Check that their Wronskian is nonzero", r"Yes. A nonzero Wronskian confirms independence and hence a fundamental set."),
                W(r"Check that $y_2 = y_1$", r"Equality would mean dependence, the opposite of what you want. What nonzero quantity confirms independence?"),
                W(r"Check that both are exponentials", r"The form of the solutions is not the test. What determinant must be nonzero?"),
                W(r"Check that $y_1 + y_2 = 0$", r"That would signal a dependence relation. What value of the Wronskian certifies a fundamental set?"),
            ],
        ),
    ],
)

# === 9.6 video 1 ============================================================
add_micro(
    "znO6v-8pvXo",
    'Unit 9, Module 9.6, video 1\n           "How to Solve Constant Coefficient Homogeneous Differential Equations"',
    [
        item(
            "mp_znO6v-8pvXo_1",
            r"To solve $a y'' + b y' + c y = 0$ with constant coefficients, the standard trial solution is what?",
            r"Choose a function whose derivatives are multiples of itself.",
            [
                C(r"$y = e^{rx}$ for a constant $r$ to be found", r"Yes. The exponential trial reduces the ODE to an algebraic equation for $r$."),
                W(r"$y = x^r$", r"That power trial belongs to Cauchy-Euler equations, not constant-coefficient ones. What exponential trial works here?"),
                W(r"$y = \sin(rx)$ only", r"Sinusoids arise only in the complex-root case, as part of a broader family. What single trial covers all cases?"),
                W(r"$y = r x + c$", r"A linear trial does not capture exponential behavior. What function has derivatives proportional to itself?"),
            ],
        ),
        item(
            "mp_znO6v-8pvXo_2",
            r"Substituting $y = e^{rx}$ into $a y'' + b y' + c y = 0$ produces which characteristic equation?",
            r"Each derivative brings down a factor of $r$, and the common $e^{rx}$ divides out.",
            [
                C(r"$a r^2 + b r + c = 0$", r"Yes. The exponential cancels, leaving this quadratic in $r$."),
                W(r"$a r + b = 0$", r"That is only first order in $r$ and ignores two derivatives. What quadratic results from $y''$, $y'$, and $y$?"),
                W(r"$r^2 + r + 1 = 0$", r"The coefficients should be $a$, $b$, $c$, not all ones. What is the general characteristic equation?"),
                W(r"$a r^2 - b r + c = 0$", r"The sign on the $b r$ term should match the sign of $b$. What is the correct quadratic?"),
            ],
        ),
        item(
            "mp_znO6v-8pvXo_3",
            r"Solve $y'' - 5y' + 6y = 0$. What is the general solution?",
            r"Factor the characteristic equation $r^2 - 5r + 6 = 0$.",
            [
                C(r"$y = c_1 e^{2x} + c_2 e^{3x}$", r"Correct. $r^2 - 5r + 6 = (r-2)(r-3)$, giving distinct roots $2$ and $3$."),
                W(r"$y = c_1 e^{-2x} + c_2 e^{-3x}$", r"Check the signs of the roots of $(r-2)(r-3) = 0$. Are they positive or negative?"),
                W(r"$y = (c_1 + c_2 x) e^{2x}$", r"The repeated-root form applies only when the roots coincide. Are $2$ and $3$ equal?"),
                W(r"$y = c_1 \cos 2x + c_2 \sin 3x$", r"Trig solutions require complex roots. Are the roots of $r^2 - 5r + 6$ real or complex?"),
            ],
        ),
        item(
            "mp_znO6v-8pvXo_4",
            r"Which feature of the characteristic equation decides whether you get exponentials, a repeated factor, or sinusoids?",
            r"The nature of the roots is governed by the discriminant of the quadratic.",
            [
                C(r"The discriminant $b^2 - 4ac$", r"Yes. Positive gives distinct real roots, zero gives a repeated root, and negative gives complex roots."),
                W(r"The sign of $c$ alone", r"The constant term alone does not classify the roots. What combination of $a$, $b$, $c$ does?"),
                W(r"Whether $a = 1$", r"Normalizing the leading coefficient does not change the root type. What quantity governs the cases?"),
                W(r"The value of $y(0)$", r"Initial data does not affect the root structure. What part of the quadratic determines the case?"),
            ],
        ),
        item(
            "mp_znO6v-8pvXo_5",
            r"For distinct real roots $r_1 \neq r_2$, why is $y = c_1 e^{r_1 x} + c_2 e^{r_2 x}$ the general solution?",
            r"The two exponentials must be independent to span the full solution space.",
            [
                C(r"The two exponentials are linearly independent, so their combinations give every solution", r"Yes. Distinct exponents make $e^{r_1 x}$ and $e^{r_2 x}$ independent, forming a fundamental set."),
                W(r"Because every second-order equation has exponential solutions", r"Not every case is purely exponential; complex and repeated roots differ. Why does the distinct-real case use two exponentials?"),
                W(r"Because $r_1 = r_2$", r"The roots here are distinct, not equal. What does distinctness give the two exponentials?"),
                W(r"Because the Wronskian is zero", r"A zero Wronskian would mean dependence. What must the Wronskian be for these to span solutions?"),
            ],
        ),
    ],
)

# === 9.6 video 2 ============================================================
add_micro(
    "r8Uk4tbuxVE",
    'Unit 9, Module 9.6, video 2\n           "Constant Coefficient ODEs, Real and Distinct vs Real and Repeated vs Complex Pair"',
    [
        item(
            "mp_r8Uk4tbuxVE_1",
            r"Solve $y'' - 4y' + 4y = 0$. What is the general solution?",
            r"The characteristic equation $r^2 - 4r + 4 = 0$ is a perfect square.",
            [
                C(r"$y = (c_1 + c_2 x)\,e^{2x}$", r"Correct. $r^2 - 4r + 4 = (r-2)^2$, a repeated root $2$, giving the factor $x$ on the second solution."),
                W(r"$y = c_1 e^{2x} + c_2 e^{-2x}$", r"The root here is repeated, not a $\pm$ pair. What form handles a double root?"),
                W(r"$y = c_1 e^{2x} + c_2 e^{4x}$", r"The characteristic equation is $(r-2)^2$, not $(r-2)(r-4)$. What single root repeats?"),
                W(r"$y = e^{2x}\cos 2x$", r"The root is real and repeated, not complex. What repeated-root form applies?"),
            ],
        ),
        item(
            "mp_r8Uk4tbuxVE_2",
            r"Solve $y'' + y = 0$. What is the general solution?",
            r"The characteristic equation $r^2 + 1 = 0$ has purely imaginary roots.",
            [
                C(r"$y = c_1 \cos x + c_2 \sin x$", r"Correct. Roots $\pm i$ give the oscillatory solution with frequency one."),
                W(r"$y = c_1 e^{x} + c_2 e^{-x}$", r"Those exponentials solve $y'' - y = 0$, not $y'' + y = 0$. What roots does $r^2 + 1 = 0$ give?"),
                W(r"$y = (c_1 + c_2 x)\cos x$", r"The roots are simple, not repeated, so no factor of $x$ is needed. What is the plain sinusoidal form?"),
                W(r"$y = c_1 \cos x$", r"That has only one constant, too few for second order. What second independent sinusoid is missing?"),
            ],
        ),
        item(
            "mp_r8Uk4tbuxVE_3",
            r"Solve $y'' + 4y' + 13y = 0$. What is the general solution?",
            r"Complete the square or use the quadratic formula on $r^2 + 4r + 13 = 0$ to get $r = -2 \pm 3i$.",
            [
                C(r"$y = e^{-2x}(c_1 \cos 3x + c_2 \sin 3x)$", r"Correct. The roots $-2 \pm 3i$ give decay $e^{-2x}$ times oscillation at frequency $3$."),
                W(r"$y = e^{2x}(c_1 \cos 3x + c_2 \sin 3x)$", r"Check the real part of the roots. Is it $+2$ or $-2$?"),
                W(r"$y = e^{-2x}(c_1 \cos 2x + c_2 \sin 2x)$", r"The oscillation frequency is the imaginary part of the roots. Is it $2$ or $3$?"),
                W(r"$y = c_1 e^{-2x} + c_2 e^{3x}$", r"The roots are complex, so the solution combines decay and oscillation. What form does $-2 \pm 3i$ give?"),
            ],
        ),
        item(
            "mp_r8Uk4tbuxVE_4",
            r"For complex roots $\alpha \pm \beta i$, the real part $\alpha$ controls which feature of the solution?",
            r"Separate the solution into an exponential envelope and an oscillating factor.",
            [
                C(r"The exponential growth or decay envelope $e^{\alpha x}$", r"Yes. The real part sets the envelope $e^{\alpha x}$; the imaginary part sets the oscillation frequency."),
                W(r"The oscillation frequency", r"Frequency comes from the imaginary part $\beta$, not $\alpha$. What does the real part control?"),
                W(r"The period of the sine and cosine", r"The period is governed by $\beta$. What does $\alpha$ govern in $e^{\alpha x}$?"),
                W(r"The number of solutions", r"There are always two independent solutions. What growth or decay does $\alpha$ set?"),
            ],
        ),
        item(
            "mp_r8Uk4tbuxVE_5",
            r"Across the three cases, why does a repeated root require the extra factor $x$ in the second solution?",
            r"Without it, the two solutions for a double root would coincide.",
            [
                C(r"The two basic exponentials collapse into one, so $x e^{rx}$ supplies a second independent solution", r"Yes. A double root yields only one exponential, and reduction of order produces $x e^{rx}$ to complete the set."),
                W(r"Because $x$ makes the solution decay faster", r"The factor $x$ is about independence, not decay. What problem does a repeated root cause that $x$ fixes?"),
                W(r"Because complex roots demand it", r"Repeated real roots, not complex ones, call for the factor $x$. Why is a second independent solution needed?"),
                W(r"Because the equation becomes first order", r"The order does not change. Why does the repeated root leave only one exponential without the $x$ factor?"),
            ],
        ),
    ],
)

# === 9.7 video 1 (single-video module) ======================================
add_micro(
    "AMixzLG1h5E",
    'Unit 9, Module 9.7, video 1\n           "Cauchy-Euler equation, two real roots"',
    [
        item(
            "mp_AMixzLG1h5E_1",
            r"A Cauchy-Euler equation has the form $a x^2 y'' + b x y' + c y = 0$. What is the standard trial solution?",
            r"Match the powers of $x$ in the coefficients by choosing a power function.",
            [
                C(r"$y = x^r$", r"Yes. The power trial $x^r$ matches the $x^k$ coefficients and reduces the equation to an algebraic one in $r$."),
                W(r"$y = e^{rx}$", r"Exponentials suit constant-coefficient equations, not the $x^2, x$ coefficients here. What power trial fits?"),
                W(r"$y = r x$", r"A linear function does not capture the needed family. What trial of the form $x^{\text{power}}$ is used?"),
                W(r"$y = \ln x$", r"A logarithm is not the basic trial, though it can appear in the repeated-root case. What is the standard ansatz?"),
            ],
        ),
        item(
            "mp_AMixzLG1h5E_2",
            r"With $y = x^r$, the term $x^2 y''$ becomes which expression?",
            r"Differentiate $x^r$ twice, then multiply by $x^2$.",
            [
                C(r"$r(r-1)\,x^r$", r"Yes. $y'' = r(r-1)x^{r-2}$, so $x^2 y'' = r(r-1)x^r$."),
                W(r"$r^2 x^r$", r"That skips the $(r-1)$ factor from the second derivative. What is $\frac{d^2}{dx^2}x^r$ times $x^2$?"),
                W(r"$r(r-1)\,x^{r-2}$", r"You forgot to multiply by $x^2$. What does $x^2 \cdot r(r-1)x^{r-2}$ give?"),
                W(r"$r\,x^r$", r"That is closer to the $x y'$ term. What is the full second-derivative contribution $x^2 y''$?"),
            ],
        ),
        item(
            "mp_AMixzLG1h5E_3",
            r"Substituting $y = x^r$ into $x^2 y'' - 2x y' - 4y = 0$ gives which indicial equation?",
            r"Use $x^2 y'' = r(r-1)x^r$, $x y' = r x^r$, and collect.",
            [
                C(r"$r^2 - 3r - 4 = 0$", r"Correct. $r(r-1) - 2r - 4 = r^2 - 3r - 4 = 0$."),
                W(r"$r^2 - 2r - 4 = 0$", r"Recombine the linear terms: $-r$ from $r(r-1)$ and $-2r$ from $-2xy'$. What is their sum?"),
                W(r"$r^2 + 3r - 4 = 0$", r"Check the sign of the linear term after combining $-r$ and $-2r$. Is it $+3r$ or $-3r$?"),
                W(r"$r^2 - 3r + 4 = 0$", r"The constant term comes from $-4y$, so it should be $-4$. What is the correct constant?"),
            ],
        ),
        item(
            "mp_AMixzLG1h5E_4",
            r"The indicial equation $r^2 - 3r - 4 = 0$ has which roots, and what general solution do they give?",
            r"Factor $r^2 - 3r - 4 = (r-4)(r+1)$.",
            [
                C(r"$r = 4, -1$, so $y = c_1 x^4 + c_2 x^{-1}$", r"Correct. The distinct real roots give two independent power solutions $x^4$ and $x^{-1}$."),
                W(r"$r = 4, 1$, so $y = c_1 x^4 + c_2 x$", r"Recheck the factorization: $(r-4)(r+1)$ gives roots $4$ and $-1$. What is the second power?"),
                W(r"$r = -4, 1$, so $y = c_1 x^{-4} + c_2 x$", r"The factor $(r-4)$ gives $r = 4$, not $-4$. What are both roots?"),
                W(r"$r = 4, -1$, so $y = c_1 e^{4x} + c_2 e^{-x}$", r"Cauchy-Euler solutions are powers of $x$, not exponentials. What form do the roots give?"),
            ],
        ),
        item(
            "mp_AMixzLG1h5E_5",
            r"The substitution $t = \ln x$ converts a Cauchy-Euler equation into what kind of equation?",
            r"This change of variable removes the variable coefficients.",
            [
                C(r"A constant-coefficient linear equation in $t$", r"Yes. Setting $t = \ln x$ turns the Cauchy-Euler equation into a constant-coefficient one, explaining the power-law solutions."),
                W(r"A separable first-order equation", r"The order is preserved at two. What kind of second-order equation in $t$ results?"),
                W(r"A nonlinear equation", r"The transformation keeps the equation linear. What feature of the coefficients does it fix?"),
                W(r"An exact equation", r"Exactness is not the outcome. What property do the coefficients gain in the variable $t$?"),
            ],
        ),
    ],
)

# === 9.8 video 1 ============================================================
add_micro(
    "7vwDp94wEhg",
    'Unit 9, Module 9.8, video 1\n           "The Theory of Higher Order Differential Equations"',
    [
        item(
            "mp_7vwDp94wEhg_1",
            r"The general solution of an $n$-th order linear homogeneous equation is a combination of how many independent solutions?",
            r"The dimension of the solution space matches the order.",
            [
                C(r"$n$ independent solutions", r"Yes. An $n$-th order linear equation has an $n$-dimensional solution space spanned by $n$ independent solutions."),
                W(r"Two, regardless of $n$", r"Two is specific to second order. How does the count of independent solutions scale with the order?"),
                W(r"One", r"One solution cannot span a higher-order solution space. How many independent solutions does order $n$ require?"),
                W(r"$n - 1$", r"The count matches the order exactly, not one less. How many independent solutions are there?"),
            ],
        ),
        item(
            "mp_7vwDp94wEhg_2",
            r"How many initial conditions does a unique solution of an $n$-th order linear equation require?",
            r"Match the number of conditions to the number of arbitrary constants.",
            [
                C(r"$n$ conditions, typically $y, y', \dots, y^{(n-1)}$ at a point", r"Yes. The $n$ arbitrary constants need $n$ conditions, usually the function and its first $n-1$ derivatives at a point."),
                W(r"Two, the value and slope", r"Two conditions fit second order only. How many are needed for order $n$?"),
                W(r"$n + 1$", r"That is one too many for $n$ constants. How many conditions match $n$ constants?"),
                W(r"One condition per term", r"It is one condition per arbitrary constant, and there are $n$ of them. How many conditions total?"),
            ],
        ),
        item(
            "mp_7vwDp94wEhg_3",
            r"For $n$ functions, the Wronskian is the determinant of a matrix of what size?",
            r"Stack each function and its derivatives up to order $n-1$.",
            [
                C(r"An $n \times n$ matrix of the functions and derivatives up to order $n-1$", r"Yes. The rows run from the functions through their $(n-1)$-th derivatives, giving an $n \times n$ determinant."),
                W(r"A $2 \times 2$ matrix", r"That is the second-order case. How large is the determinant for $n$ functions?"),
                W(r"An $n \times 1$ matrix", r"A single column is not a determinant of independence. What square size does the Wronskian use?"),
                W(r"An $(n+1) \times (n+1)$ matrix", r"Derivatives only run up to order $n-1$, giving $n$ rows. What is the matrix size?"),
            ],
        ),
        item(
            "mp_7vwDp94wEhg_4",
            r"Does the superposition principle extend to higher-order linear homogeneous equations?",
            r"Linearity of the operator does not depend on the order being two.",
            [
                C(r"Yes, any linear combination of solutions is again a solution", r"Yes. Linearity holds at every order, so combinations of homogeneous solutions remain solutions."),
                W(r"No, it works only for second order", r"Order does not limit linearity. Why does superposition still apply at order $n$?"),
                W(r"Only for $n$ even", r"Parity of $n$ is irrelevant. What property of the operator guarantees superposition?"),
                W(r"Only if the coefficients are constant", r"Variable coefficients still give a linear operator. What underlies superposition regardless?"),
            ],
        ),
        item(
            "mp_7vwDp94wEhg_5",
            r"The existence and uniqueness theorem for an $n$-th order linear equation guarantees a unique solution provided what?",
            r"Generalize the second-order continuity hypothesis to all coefficient functions.",
            [
                C(r"All coefficient functions and the forcing are continuous on an interval containing $x_0$", r"Yes. Continuity of every coefficient and the forcing on an interval around $x_0$ guarantees a unique solution."),
                W(r"The equation is homogeneous", r"The theorem covers nonhomogeneous equations too. What continuity hypothesis is required?"),
                W(r"All coefficients are equal", r"Equality of coefficients is not needed. What property must they share on the interval?"),
                W(r"The order $n$ is at most two", r"The theorem holds at every order. What must be true of the coefficients near $x_0$?"),
            ],
        ),
    ],
)

# === 9.8 video 2 ============================================================
add_micro(
    "vA3MjD0cfS4",
    'Unit 9, Module 9.8, video 2\n           "Solving General High-Order, Linear Ordinary Differential Equations"',
    [
        item(
            "mp_vA3MjD0cfS4_1",
            r"For a constant-coefficient equation of order $n$, the characteristic equation is a polynomial of which degree?",
            r"Each derivative order contributes one power of $r$.",
            [
                C(r"Degree $n$", r"Yes. The characteristic polynomial has the same degree as the order of the equation."),
                W(r"Degree $2$ always", r"Degree two is the second-order case. How does the degree depend on the order $n$?"),
                W(r"Degree $n - 1$", r"The top derivative $y^{(n)}$ gives $r^n$, so the degree is $n$, not $n-1$. What degree results?"),
                W(r"Degree $1$", r"A degree-one polynomial would miss most roots. What degree matches an $n$-th order equation?"),
            ],
        ),
        item(
            "mp_vA3MjD0cfS4_2",
            r"Solve $y''' - y' = 0$. What is the general solution?",
            r"Factor the characteristic polynomial $r^3 - r = r(r-1)(r+1)$.",
            [
                C(r"$y = c_1 + c_2 e^{x} + c_3 e^{-x}$", r"Correct. Roots $0, 1, -1$ give the constant, $e^x$, and $e^{-x}$ solutions."),
                W(r"$y = c_1 e^{x} + c_2 e^{-x}$", r"That uses only two roots; the root $r = 0$ is missing. What solution corresponds to $r = 0$?"),
                W(r"$y = c_1 + c_2 x + c_3 x^2$", r"Those polynomials come from a repeated zero root, not from $r(r-1)(r+1)$. What roots does the cubic have?"),
                W(r"$y = (c_1 + c_2 x + c_3 x^2)e^{x}$", r"That form is for a triple root at $1$. What are the three distinct roots here?"),
            ],
        ),
        item(
            "mp_vA3MjD0cfS4_3",
            r"A root $r$ of multiplicity $m$ in the characteristic polynomial contributes which solutions?",
            r"Generalize the repeated-root rule from second order, adding one power of $x$ per repetition.",
            [
                C(r"$e^{rx}, x e^{rx}, \dots, x^{m-1} e^{rx}$", r"Yes. A root of multiplicity $m$ contributes $m$ independent solutions with powers of $x$ up to $x^{m-1}$."),
                W(r"Just $e^{rx}$, repeated $m$ times", r"Repeating the same function gives only one independent solution. What extra factors make them independent?"),
                W(r"$e^{rx}$ and $e^{-rx}$", r"Multiplicity does not introduce a sign flip in the exponent. What powers of $x$ appear instead?"),
                W(r"$m\,e^{rx}$", r"A constant multiple is still one solution. How many independent solutions, and of what form, does multiplicity $m$ give?"),
            ],
        ),
        item(
            "mp_vA3MjD0cfS4_4",
            r"In a constant-coefficient equation with real coefficients, complex roots must appear how?",
            r"Real polynomials have complex roots that come in conjugate pairs.",
            [
                C(r"In conjugate pairs $\alpha \pm \beta i$", r"Yes. Real coefficients force complex roots to occur in conjugate pairs, giving $e^{\alpha x}\cos\beta x$ and $e^{\alpha x}\sin\beta x$."),
                W(r"Singly, with no partner", r"A lone complex root would violate real coefficients. How must complex roots pair up?"),
                W(r"Only as purely imaginary numbers", r"The real part need not be zero. In what paired form do complex roots appear?"),
                W(r"As repeated real roots", r"Complex roots are not real. What conjugate structure do they have?"),
            ],
        ),
        item(
            "mp_vA3MjD0cfS4_5",
            r"Once you have $n$ independent solutions of an $n$-th order constant-coefficient equation, the general solution is what?",
            r"Combine all the independent pieces with arbitrary constants.",
            [
                C(r"A linear combination of all $n$ solutions with $n$ arbitrary constants", r"Yes. Summing the $n$ independent solutions, each with its own constant, gives the general solution."),
                W(r"The product of the $n$ solutions", r"Solutions combine by addition, not multiplication. How are the $n$ pieces assembled?"),
                W(r"Only the solution from the largest root", r"Every independent solution contributes. How many terms and constants appear?"),
                W(r"A combination of just two of them", r"Two terms suffice only at second order. How many independent solutions span order $n$?"),
            ],
        ),
    ],
)

# ============================================================================
# UNIT 10 MICRO PRACTICE
# ============================================================================

# === 10.1 video 1 ===========================================================
add_micro(
    "P3fc6v191mA",
    'Unit 10, Module 10.1, video 1\n           "Method of Undetermined Coefficients, Nonhomogeneous 2nd Order Differential Equations"',
    [
        item(
            "mp_P3fc6v191mA_1",
            r"The general solution of a nonhomogeneous linear equation $L[y] = g$ is written as which sum?",
            r"Combine the solution of the associated homogeneous equation with one particular solution.",
            [
                C(r"$y = y_h + y_p$, the complementary plus a particular solution", r"Yes. The complementary solution $y_h$ solves $L[y]=0$ and $y_p$ handles the forcing $g$."),
                W(r"$y = y_h \cdot y_p$", r"The two parts add, they do not multiply. How do the complementary and particular pieces combine?"),
                W(r"$y = y_p$ only", r"That omits the complementary solution and its constants. What must be added to $y_p$?"),
                W(r"$y = y_h$ only", r"The homogeneous part alone cannot match the forcing $g$. What extra piece is required?"),
            ],
        ),
        item(
            "mp_P3fc6v191mA_2",
            r"For the forcing $g(x) = e^{3x}$, the undetermined-coefficients guess for $y_p$ is which form (assuming no overlap)?",
            r"Choose a trial of the same exponential type with an unknown coefficient.",
            [
                C(r"$y_p = A e^{3x}$", r"Yes. An exponential forcing suggests a constant times the same exponential."),
                W(r"$y_p = A x e^{3x}$", r"The factor $x$ is needed only when $e^{3x}$ already solves the homogeneous equation. With no overlap, what is the plain guess?"),
                W(r"$y_p = A \cos 3x$", r"A trig guess matches sinusoidal forcing, not an exponential. What trial fits $e^{3x}$?"),
                W(r"$y_p = A x + B$", r"A polynomial guess fits polynomial forcing. What form matches an exponential input?"),
            ],
        ),
        item(
            "mp_P3fc6v191mA_3",
            r"For a polynomial forcing $g(x) = 4x^2$, what is the appropriate trial $y_p$?",
            r"Match a polynomial input with a full polynomial of the same degree, not just the leading term.",
            [
                C(r"$y_p = A x^2 + B x + C$", r"Yes. A degree-two forcing requires a complete quadratic trial so all derivative terms can be matched."),
                W(r"$y_p = A x^2$", r"Lower-degree terms can be generated by the derivatives, so the trial needs them too. What complete polynomial should you use?"),
                W(r"$y_p = A e^{x}$", r"An exponential guess does not match a polynomial input. What polynomial trial fits $4x^2$?"),
                W(r"$y_p = A x^3$", r"The trial should match the degree of the forcing, which is two. What degree polynomial is appropriate?"),
            ],
        ),
        item(
            "mp_P3fc6v191mA_4",
            r"Solve for $y_p$ in $y'' - y = e^{2x}$ using the guess $y_p = A e^{2x}$. What is $A$?",
            r"Compute $y_p'' = 4A e^{2x}$, substitute, and solve $4A - A = 1$.",
            [
                C(r"$A = \frac{1}{3}$", r"Correct. $4A e^{2x} - A e^{2x} = 3A e^{2x} = e^{2x}$, so $A = 1/3$."),
                W(r"$A = 1$", r"Substitute the guess: $4A - A = 3A$ must equal $1$. What is $A$?"),
                W(r"$A = \frac{1}{4}$", r"Do not forget the $-A$ from the $-y$ term. What is $4A - A$ set equal to $1$?"),
                W(r"$A = 3$", r"You may have inverted the relation. From $3A = 1$, what is $A$?"),
            ],
        ),
        item(
            "mp_P3fc6v191mA_5",
            r"Why does the method require adding the complementary solution $y_h$ even after finding a valid $y_p$?",
            r"Initial or boundary conditions must still be satisfiable, which needs free constants.",
            [
                C(r"Only $y_h + y_p$ contains the arbitrary constants needed to meet initial conditions", r"Yes. The particular solution alone has no free constants; $y_h$ supplies them to fit the data."),
                W(r"Because $y_p$ does not solve the equation", r"$y_p$ does solve $L[y] = g$. What does it lack that $y_h$ provides?"),
                W(r"Because $y_h$ cancels the forcing", r"The complementary solution solves the homogeneous equation; it does not cancel $g$. Why is it still needed?"),
                W(r"To make the solution unique without conditions", r"Adding $y_h$ introduces constants, making the family larger, not unique. Why are those constants necessary?"),
            ],
        ),
    ],
)

# === 10.1 video 2 ===========================================================
add_micro(
    "AgyeJEO2a-k",
    'Unit 10, Module 10.1, video 2\n           "Undetermined Coefficients, Solving non-homogeneous ODEs"',
    [
        item(
            "mp_AgyeJEO2a-k_1",
            r"For the forcing $g(x) = \cos 2x$, the undetermined-coefficients trial should include which terms?",
            r"Differentiating a cosine produces a sine, so both are usually required.",
            [
                C(r"$y_p = A \cos 2x + B \sin 2x$", r"Yes. Derivatives mix sine and cosine, so both must appear in the trial."),
                W(r"$y_p = A \cos 2x$ only", r"Differentiating cosine introduces a sine term to match. What second term must the trial include?"),
                W(r"$y_p = A \sin 2x$ only", r"A cosine forcing still generates cosine terms under differentiation. What pair should the trial use?"),
                W(r"$y_p = A e^{2x}$", r"An exponential guess does not match an oscillating input. What sinusoidal trial fits $\cos 2x$?"),
            ],
        ),
        item(
            "mp_AgyeJEO2a-k_2",
            r"When the trial guess already solves the homogeneous equation, what modification restores a valid particular solution?",
            r"You need to break the overlap so the trial is independent of the complementary solutions.",
            [
                C(r"Multiply the trial by $x$ (or a higher power if needed)", r"Yes. Multiplying by $x$ removes the overlap so substitution does not collapse to zero."),
                W(r"Divide the trial by $x$", r"Dividing does not remove the overlap and can introduce singularities. What operation breaks the overlap?"),
                W(r"Replace the trial with a constant", r"A constant rarely matches the forcing. What factor should multiply the trial?"),
                W(r"Discard the forcing term", r"The forcing must still be matched. What change to the trial handles the overlap?"),
            ],
        ),
        item(
            "mp_AgyeJEO2a-k_3",
            r"For $y'' + y = \cos x$, the natural guess $A\cos x + B\sin x$ fails because it solves the homogeneous equation. What is the corrected trial?",
            r"This is the resonance case; multiply the usual sinusoidal trial by $x$.",
            [
                C(r"$y_p = x(A\cos x + B\sin x)$", r"Correct. Since $\cos x$ and $\sin x$ already solve $y'' + y = 0$, the trial gains a factor of $x$."),
                W(r"$y_p = A\cos x + B\sin x$", r"This is exactly the homogeneous solution, so substitution gives zero. How do you modify it?"),
                W(r"$y_p = A x^2 \cos x$", r"One factor of $x$ suffices for a simple resonance, and the sine term is needed too. What is the correct form?"),
                W(r"$y_p = A e^{x}\cos x$", r"An exponential envelope is not called for here. What factor resolves the overlap with $\cos x, \sin x$?"),
            ],
        ),
        item(
            "mp_AgyeJEO2a-k_4",
            r"If the forcing is a sum $g_1 + g_2$, how should you form the particular solution?",
            r"Linearity lets you treat each forcing term separately.",
            [
                C(r"Find a particular solution for each piece and add them", r"Yes. By superposition for the nonhomogeneous equation, particular solutions for separate forcings add."),
                W(r"Use one guess covering both at once with a single coefficient", r"A single coefficient cannot match independent forcing terms. How does linearity let you split the work?"),
                W(r"Multiply the two particular solutions", r"Particular solutions add, they do not multiply, when forcings add. What is the correct combination?"),
                W(r"Ignore the smaller forcing term", r"Every forcing term contributes. How should the particular solutions for $g_1$ and $g_2$ combine?"),
            ],
        ),
        item(
            "mp_AgyeJEO2a-k_5",
            r"After choosing a trial, how do you find the undetermined coefficients?",
            r"The trial must satisfy the equation identically, term by term.",
            [
                C(r"Substitute the trial into the equation and match coefficients of like terms", r"Yes. Plugging in and equating coefficients of each function type yields equations for the unknowns."),
                W(r"Set the trial equal to the forcing directly", r"The trial must satisfy the whole differential equation, not just equal $g$. What do you substitute it into?"),
                W(r"Integrate the forcing twice", r"Direct integration is not the method here. What substitution and matching step fixes the coefficients?"),
                W(r"Take the Wronskian of the trial", r"The Wronskian is for independence, not for finding coefficients. What step determines the unknowns?"),
            ],
        ),
    ],
)

# === 10.2 video 1 ===========================================================
add_micro(
    "Ik3YW1JGr_A",
    'Unit 10, Module 10.2, video 1\n           "Variation of Parameters, Nonhomogeneous Second Order Differential Equations"',
    [
        item(
            "mp_Ik3YW1JGr_A_1",
            r"Variation of parameters seeks a particular solution of which form, using the fundamental solutions $y_1, y_2$?",
            r"Promote the constants in the complementary solution to functions of $x$.",
            [
                C(r"$y_p = u_1(x)\,y_1 + u_2(x)\,y_2$", r"Yes. The constants become functions $u_1, u_2$ to be determined."),
                W(r"$y_p = c_1 y_1 + c_2 y_2$", r"Those constants give only the homogeneous solution. What replaces the constants in this method?"),
                W(r"$y_p = u_1 y_1 \cdot u_2 y_2$", r"The terms add, they do not multiply. What is the correct combination of $u_i$ and $y_i$?"),
                W(r"$y_p = u_1(x) + u_2(x)$", r"The unknown functions multiply the fundamental solutions. What form does $y_p$ take?"),
            ],
        ),
        item(
            "mp_Ik3YW1JGr_A_2",
            r"To keep the system manageable, variation of parameters imposes which convenient constraint on $u_1', u_2'$?",
            r"The constraint eliminates the second derivatives of the unknown functions.",
            [
                C(r"$u_1' y_1 + u_2' y_2 = 0$", r"Yes. This first constraint simplifies $y_p'$ and avoids second derivatives of $u_1, u_2$."),
                W(r"$u_1' + u_2' = 0$", r"The constraint pairs each $u_i'$ with its solution $y_i$. What weighted sum is set to zero?"),
                W(r"$u_1' y_1' + u_2' y_2' = 0$", r"That combination is set equal to the forcing, not to zero. Which weighted sum vanishes?"),
                W(r"$u_1 y_1 + u_2 y_2 = 0$", r"The constraint involves the derivatives $u_i'$, not the functions themselves. What is the correct condition?"),
            ],
        ),
        item(
            "mp_Ik3YW1JGr_A_3",
            r"The second equation of the system (in standard form $y'' + p y' + q y = g$) sets which combination equal to $g$?",
            r"After using the first constraint, substituting into the equation leaves the derivatives of $y_1, y_2$.",
            [
                C(r"$u_1' y_1' + u_2' y_2' = g$", r"Yes. This pairs each $u_i'$ with the derivative $y_i'$ and equals the forcing $g$."),
                W(r"$u_1' y_1 + u_2' y_2 = g$", r"That expression is the first constraint, set to zero, not to $g$. Which derivatives appear in the second equation?"),
                W(r"$u_1 y_1' + u_2 y_2' = g$", r"The unknowns appear as derivatives $u_i'$, not as $u_i$. What is the correct second equation?"),
                W(r"$y_1' + y_2' = g$", r"The unknown coefficients $u_i'$ are missing. What weighted sum equals $g$?"),
            ],
        ),
        item(
            "mp_Ik3YW1JGr_A_4",
            r"Solving the two-equation system gives $u_1'$ and $u_2'$ in terms of the Wronskian. What is $u_1'$?",
            r"Use Cramer's rule on the system; the Wronskian $W = y_1 y_2' - y_2 y_1'$ is the determinant.",
            [
                C(r"$u_1' = -\frac{y_2\,g}{W}$", r"Yes. Cramer's rule gives $u_1' = -y_2 g / W$, which you then integrate."),
                W(r"$u_1' = \frac{y_2\,g}{W}$", r"Check the sign from Cramer's rule for the first unknown. Is it positive or negative?"),
                W(r"$u_1' = \frac{y_1\,g}{W}$", r"The numerator for $u_1'$ uses the other solution $y_2$, not $y_1$. Which solution appears, and with what sign?"),
                W(r"$u_1' = -\frac{y_1\,g}{W}$", r"You have the right sign but the wrong solution in the numerator. Which $y_i$ belongs there for $u_1'$?"),
            ],
        ),
        item(
            "mp_Ik3YW1JGr_A_5",
            r"What is the main advantage of variation of parameters over undetermined coefficients?",
            r"Think about which forcings each method can handle.",
            [
                C(r"It works for any continuous forcing $g$, not just exponentials, polynomials, and sinusoids", r"Yes. Variation of parameters handles general forcing such as $\tan x$ or $\sec x$, where guessing fails."),
                W(r"It avoids needing the homogeneous solutions", r"It actually requires the fundamental solutions $y_1, y_2$. What broader class of forcings does it handle?"),
                W(r"It never requires integration", r"It does require integrating $u_1'$ and $u_2'$. What is its real advantage over guessing?"),
                W(r"It only works for constant coefficients", r"It is more general than that. For what kinds of forcing does it succeed where guessing cannot?"),
            ],
        ),
    ],
)

# === 10.2 video 2 ===========================================================
add_micro(
    "wSMad7QpaqE",
    'Unit 10, Module 10.2, video 2\n           "Variation of Parameters, How to solve non-homogeneous ODEs"',
    [
        item(
            "mp_wSMad7QpaqE_1",
            r"The variation-of-parameters formula for $y_p$ can be written as which combination of integrals?",
            r"Each unknown function is the integral of its derivative found by Cramer's rule.",
            [
                C(r"$y_p = -y_1 \int \frac{y_2\,g}{W}\,dx + y_2 \int \frac{y_1\,g}{W}\,dx$", r"Yes. Integrating $u_1'$ and $u_2'$ and reassembling gives this standard formula."),
                W(r"$y_p = y_1 \int \frac{y_2\,g}{W}\,dx + y_2 \int \frac{y_1\,g}{W}\,dx$", r"Check the sign on the first integral, which comes from $u_1' = -y_2 g / W$. What sign should it carry?"),
                W(r"$y_p = -y_1 \int \frac{y_2\,g}{W}\,dx - y_2 \int \frac{y_1\,g}{W}\,dx$", r"The two integrals carry opposite signs. What is the sign of the $y_2$ term?"),
                W(r"$y_p = \int \frac{g}{W}\,dx$", r"The fundamental solutions $y_1, y_2$ must appear explicitly. What is the full two-integral formula?"),
            ],
        ),
        item(
            "mp_wSMad7QpaqE_2",
            r"Before reading off $g$ in the formula, why must the equation be put in standard form with leading coefficient one?",
            r"The forcing term in the formula must be the right-hand side after normalizing $y''$.",
            [
                C(r"The $g$ in the formula is the forcing after dividing through so the $y''$ coefficient is one", r"Yes. If you skip normalizing, $g$ is scaled incorrectly and the answer is wrong."),
                W(r"Because the Wronskian requires it", r"The Wronskian is computed from $y_1, y_2$ regardless of normalization. Why must $g$ specifically be normalized?"),
                W(r"Because otherwise $y_1, y_2$ change", r"The homogeneous solutions do not change under normalization. What quantity in the formula depends on it?"),
                W(r"It is not actually necessary", r"It is necessary for a correct $g$. What goes wrong if the leading coefficient is not one?"),
            ],
        ),
        item(
            "mp_wSMad7QpaqE_3",
            r"For $y'' + y = \sec x$, which method is appropriate and why?",
            r"Consider whether $\sec x$ has a finite family of derivatives.",
            [
                C(r"Variation of parameters, because $\sec x$ has no finite undetermined-coefficients guess", r"Yes. Since $\sec x$ does not fit the standard guess families, variation of parameters is the right tool."),
                W(r"Undetermined coefficients with guess $A\sec x$", r"The derivatives of $\sec x$ do not close into a finite set, so guessing fails. Which method handles it?"),
                W(r"Separation of variables", r"This is a second-order linear equation, not separable. Which method covers a forcing like $\sec x$?"),
                W(r"No method works", r"There is a method for general continuous forcing. Which one applies to $\sec x$?"),
            ],
        ),
        item(
            "mp_wSMad7QpaqE_4",
            r"In the variation-of-parameters formula, what role does the Wronskian $W$ play?",
            r"It appears in the denominator of each integrand.",
            [
                C(r"It is the denominator that normalizes the integrands for $u_1'$ and $u_2'$", r"Yes. $W$ in the denominator comes from solving the linear system by Cramer's rule."),
                W(r"It is the forcing term", r"The forcing is $g$, not $W$. Where in the formula does $W$ appear?"),
                W(r"It multiplies the final answer", r"$W$ divides, it does not multiply the result. In what position does it sit?"),
                W(r"It replaces $y_1$ and $y_2$", r"The solutions $y_1, y_2$ still appear; $W$ is separate. What is its role in the integrands?"),
            ],
        ),
        item(
            "mp_wSMad7QpaqE_5",
            r"After computing $y_p$ by variation of parameters, what is the full general solution?",
            r"The particular solution still needs the complementary part for the constants.",
            [
                C(r"$y = c_1 y_1 + c_2 y_2 + y_p$", r"Yes. The complementary solution supplies the constants, and $y_p$ handles the forcing."),
                W(r"$y = y_p$ alone", r"The arbitrary constants are missing. What homogeneous part must be added?"),
                W(r"$y = c_1 y_1 + c_2 y_2$", r"That ignores the forcing entirely. What particular piece must be included?"),
                W(r"$y = y_p \cdot (c_1 y_1 + c_2 y_2)$", r"The pieces add, they do not multiply. How are the complementary and particular parts combined?"),
            ],
        ),
    ],
)

# === 10.3 video 1 ===========================================================
add_micro(
    "gEJvwsMZ3lU",
    'Unit 10, Module 10.3, video 1\n           "Method of Undetermined Coefficients, Annihilator Approach"',
    [
        item(
            "mp_gEJvwsMZ3lU_1",
            r"In operator notation, $D$ stands for which operation?",
            r"It is shorthand for the basic calculus operation applied to a function.",
            [
                C(r"Differentiation, $D = \frac{d}{dx}$", r"Yes. $D$ denotes differentiation, so $D^2 y = y''$ and so on."),
                W(r"Integration", r"$D$ is the opposite of integration. Which operation does it denote?"),
                W(r"Multiplication by $x$", r"Multiplying by $x$ is a different operator. What calculus operation is $D$?"),
                W(r"Evaluation at a point", r"$D$ acts on functions to produce functions, not numbers. What operation is it?"),
            ],
        ),
        item(
            "mp_gEJvwsMZ3lU_2",
            r"Which operator annihilates $e^{3x}$, meaning it sends $e^{3x}$ to zero?",
            r"The operator should have $3$ as a root of its characteristic polynomial.",
            [
                C(r"$(D - 3)$", r"Yes. $(D-3)e^{3x} = 3e^{3x} - 3e^{3x} = 0$."),
                W(r"$(D + 3)$", r"Apply it: $(D+3)e^{3x} = 3e^{3x} + 3e^{3x} \neq 0$. What sign makes it vanish?"),
                W(r"$D^2$", r"$D^2 e^{3x} = 9 e^{3x} \neq 0$. Which first-order operator kills $e^{3x}$?"),
                W(r"$(D - 9)$", r"The exponent is $3$, so the root needed is $3$, not $9$. What operator annihilates $e^{3x}$?"),
            ],
        ),
        item(
            "mp_gEJvwsMZ3lU_3",
            r"Which operator annihilates the polynomial $x^2$?",
            r"Each differentiation lowers the degree by one; how many are needed to reach zero?",
            [
                C(r"$D^3$", r"Yes. Three derivatives of $x^2$ give zero, so $D^3$ annihilates it."),
                W(r"$D^2$", r"$D^2 x^2 = 2 \neq 0$. One more derivative is needed. Which power of $D$ works?"),
                W(r"$D$", r"$D x^2 = 2x \neq 0$. How many differentiations send $x^2$ to zero?"),
                W(r"$(D - 1)$", r"That operator suits $e^x$, not a polynomial. Which power of $D$ annihilates $x^2$?"),
            ],
        ),
        item(
            "mp_gEJvwsMZ3lU_4",
            r"Which operator annihilates $\cos 2x$ (and $\sin 2x$)?",
            r"Choose the operator whose roots are $\pm 2i$.",
            [
                C(r"$(D^2 + 4)$", r"Yes. $(D^2 + 4)\cos 2x = -4\cos 2x + 4\cos 2x = 0$, since the roots are $\pm 2i$."),
                W(r"$(D^2 - 4)$", r"That operator has real roots $\pm 2$ and suits $e^{\pm 2x}$. What sign gives the imaginary roots $\pm 2i$?"),
                W(r"$(D - 2)$", r"A single real root does not annihilate an oscillation. What second-order operator has roots $\pm 2i$?"),
                W(r"$(D^2 + 2)$", r"The roots of $D^2 + 2$ are $\pm \sqrt{2}\,i$, giving frequency $\sqrt{2}$, not $2$. What constant gives frequency $2$?"),
            ],
        ),
        item(
            "mp_gEJvwsMZ3lU_5",
            r"How does applying an annihilator to both sides of $L[y] = g$ help find the form of $y_p$?",
            r"Annihilating $g$ turns the problem into a larger homogeneous equation.",
            [
                C(r"It produces a higher-order homogeneous equation whose solutions reveal the correct trial form", r"Yes. The new homogeneous equation's solutions include the terms to use in the undetermined-coefficients guess."),
                W(r"It directly gives the values of the coefficients", r"The annihilator gives the form, not the numbers; you still substitute to find coefficients. What does it reveal?"),
                W(r"It removes the need for the complementary solution", r"The complementary solution is still required. What does annihilating $g$ provide instead?"),
                W(r"It makes the equation first order", r"Applying an annihilator raises the order. What kind of equation results, and what does it tell you?"),
            ],
        ),
    ],
)

# === 10.3 video 2 ===========================================================
add_micro(
    "LC6T-nUVJac",
    'Unit 10, Module 10.3, video 2\n           "Solving Differential Equations using Differential Operators, The Annihilator Approach"',
    [
        item(
            "mp_LC6T-nUVJac_1",
            r"The operator polynomial factor $(D - r)$ corresponds to which solution of the homogeneous equation?",
            r"Match the operator root to an exponential solution.",
            [
                C(r"$e^{rx}$", r"Yes. The factor $(D - r)$ is annihilated by $e^{rx}$, mirroring the characteristic root $r$."),
                W(r"$x^r$", r"Power solutions belong to Cauchy-Euler equations, not constant-coefficient operators. What exponential matches $(D - r)$?"),
                W(r"$\cos rx$", r"A real root gives an exponential, not an oscillation. What function does $(D - r)$ correspond to?"),
                W(r"$r e^{x}$", r"The root $r$ sits in the exponent, not as a multiplier. What is the matching solution?"),
            ],
        ),
        item(
            "mp_LC6T-nUVJac_2",
            r"To annihilate a sum like $e^{x} + \cos 2x$, what operator do you use?",
            r"Combine the annihilators of each piece.",
            [
                C(r"The product $(D - 1)(D^2 + 4)$", r"Yes. The product of the individual annihilators kills the whole sum."),
                W(r"The sum $(D - 1) + (D^2 + 4)$", r"Operators for separate terms multiply, they do not add. What composite operator annihilates both pieces?"),
                W(r"Only $(D - 1)$", r"That leaves $\cos 2x$ alive. What additional factor is needed?"),
                W(r"$(D - 1)(D - 2)$", r"The cosine needs roots $\pm 2i$, not a real root $2$. What second factor annihilates $\cos 2x$?"),
            ],
        ),
        item(
            "mp_LC6T-nUVJac_3",
            r"Which operator annihilates $e^{a x}\cos b x$ and $e^{a x}\sin b x$?",
            r"The roots needed are $a \pm b i$, so expand $(D - (a+bi))(D - (a-bi))$.",
            [
                C(r"$\big(D - a\big)^2 + b^2$, that is $D^2 - 2a D + (a^2 + b^2)$", r"Yes. Shifting the oscillator operator by $a$ gives the annihilator for the damped sinusoid."),
                W(r"$D^2 + b^2$", r"That handles $\cos bx$ with no exponential envelope. How do you shift it to include $e^{ax}$?"),
                W(r"$(D - a)^2$", r"A repeated real root gives $e^{ax}$ and $x e^{ax}$, not an oscillation. What term restores the frequency $b$?"),
                W(r"$D^2 - 2a D - (a^2 + b^2)$", r"Check the sign of the constant term, which should be $a^2 + b^2$. Is it positive or negative?"),
            ],
        ),
        item(
            "mp_LC6T-nUVJac_4",
            r"A repeated factor like $(D - 2)^2$ in the annihilator signals which solution terms?",
            r"Repeated operator roots behave like repeated characteristic roots.",
            [
                C(r"$e^{2x}$ and $x e^{2x}$", r"Yes. A squared factor gives both the exponential and its product with $x$."),
                W(r"$e^{2x}$ and $e^{-2x}$", r"The factor is repeated, not a $\pm$ pair. What second term accompanies $e^{2x}$?"),
                W(r"$e^{2x}$ only", r"A squared factor contributes two independent solutions. What is the second one?"),
                W(r"$\cos 2x$ and $\sin 2x$", r"The root here is real and repeated, not imaginary. What pair of solutions does $(D-2)^2$ give?"),
            ],
        ),
        item(
            "mp_LC6T-nUVJac_5",
            r"Why does the annihilator method justify the trial forms used in undetermined coefficients?",
            r"The method derives the guess instead of memorizing it.",
            [
                C(r"The annihilated homogeneous equation's solutions, minus the complementary solutions, give exactly the trial terms", r"Yes. The leftover solutions after removing $y_h$ are precisely the undetermined-coefficients trial."),
                W(r"Because annihilators are always exponentials", r"Annihilators include operators for polynomials and sinusoids too. How do their solutions justify the trial?"),
                W(r"Because it avoids the complementary solution", r"The complementary solution is subtracted, not avoided. What remains becomes the trial?"),
                W(r"It does not, the two methods are unrelated", r"They are closely linked. How does annihilating $g$ reproduce the guess form?"),
            ],
        ),
    ],
)

# === 10.4 video 1 ===========================================================
add_micro(
    "CB9I4mwpQ5E",
    'Unit 10, Module 10.4, video 1\n           "Response to Exponential Input"',
    [
        item(
            "mp_CB9I4mwpQ5E_1",
            r"For $p(D)\,y = e^{a t}$ with characteristic polynomial $p$, the exponential response formula gives $y_p$ equal to what, when $p(a) \neq 0$?",
            r"Substitute $e^{at}$ and use that $p(D)e^{at} = p(a)e^{at}$.",
            [
                C(r"$y_p = \frac{e^{a t}}{p(a)}$", r"Yes. Since $p(D)e^{at} = p(a)e^{at}$, dividing by $p(a)$ gives the particular solution."),
                W(r"$y_p = p(a)\,e^{a t}$", r"You multiplied instead of divided by $p(a)$. What operation isolates $y_p$?"),
                W(r"$y_p = \frac{e^{a t}}{p'(a)}$", r"The derivative $p'(a)$ enters only in the resonant case $p(a) = 0$. What denominator applies when $p(a) \neq 0$?"),
                W(r"$y_p = e^{a t}$", r"You forgot the factor $1/p(a)$. What does $p(D)e^{at}$ equal, and how do you invert it?"),
            ],
        ),
        item(
            "mp_CB9I4mwpQ5E_2",
            r"The key identity behind the exponential response formula is $p(D)\,e^{a t} = ?$",
            r"Each $D$ acting on $e^{at}$ brings down a factor of $a$.",
            [
                C(r"$p(a)\,e^{a t}$", r"Yes. Replacing $D$ with $a$ in the polynomial gives $p(a)$ times the exponential."),
                W(r"$p(D)\,a$", r"The operator acts on the function, producing $p(a)e^{at}$. What number multiplies $e^{at}$?"),
                W(r"$a\,e^{a t}$", r"Only a single factor of $a$ appears here, but $p$ may have higher powers. What does the full polynomial give?"),
                W(r"$e^{p(a) t}$", r"The exponent is unchanged; $p(a)$ appears as a multiplier, not in the exponent. What is the correct identity?"),
            ],
        ),
        item(
            "mp_CB9I4mwpQ5E_3",
            r"Solve $y'' + 3y' + 2y = e^{t}$ using the exponential response formula. What is $y_p$?",
            r"Compute $p(r) = r^2 + 3r + 2$ at $r = 1$.",
            [
                C(r"$y_p = \frac{e^{t}}{6}$", r"Correct. $p(1) = 1 + 3 + 2 = 6$, so $y_p = e^t / 6$."),
                W(r"$y_p = \frac{e^{t}}{2}$", r"Evaluate the full polynomial $r^2 + 3r + 2$ at $r = 1$, not just the constant term. What is $p(1)$?"),
                W(r"$y_p = 6 e^{t}$", r"The formula divides by $p(1)$, it does not multiply. What is $e^t / p(1)$?"),
                W(r"$y_p = \frac{e^{t}}{5}$", r"Recompute $1 + 3 + 2$. What does $p(1)$ equal?"),
            ],
        ),
        item(
            "mp_CB9I4mwpQ5E_4",
            r"When $p(a) = 0$, the basic exponential response formula fails. What does this situation represent?",
            r"A zero of $p$ at $a$ means $e^{at}$ already solves the homogeneous equation.",
            [
                C(r"Resonance, because $e^{a t}$ is a homogeneous solution", r"Yes. When $a$ is a characteristic root, the input resonates with the system and the simple formula breaks down."),
                W(r"That the input is zero", r"The input $e^{at}$ is not zero. What does $p(a) = 0$ say about $e^{at}$ relative to the homogeneous equation?"),
                W(r"That no solution exists", r"A solution still exists in a modified form. What special condition does $p(a) = 0$ signal?"),
                W(r"That the equation is nonlinear", r"The equation stays linear. What phenomenon occurs when $a$ is a characteristic root?"),
            ],
        ),
        item(
            "mp_CB9I4mwpQ5E_5",
            r"In the resonant case $p(a) = 0$ but $p'(a) \neq 0$, the corrected response is which form?",
            r"Multiply by $t$ and divide by the derivative of the characteristic polynomial.",
            [
                C(r"$y_p = \frac{t\,e^{a t}}{p'(a)}$", r"Yes. The simple-root resonance fix introduces a factor of $t$ and divides by $p'(a)$."),
                W(r"$y_p = \frac{e^{a t}}{p'(a)}$", r"The resonant fix needs an extra factor reflecting the overlap. What power of $t$ appears?"),
                W(r"$y_p = \frac{t^2\,e^{a t}}{p''(a)}$", r"That form is for a double root. For a simple root, what is the correct factor and denominator?"),
                W(r"$y_p = t\,e^{a t}$", r"The denominator $p'(a)$ is missing. What divides $t e^{at}$ in the corrected formula?"),
            ],
        ),
    ],
)

# === 10.4 video 2 ===========================================================
add_micro(
    "xw3ccgYhFis",
    'Unit 10, Module 10.4, video 2\n           "Response to Oscillating Input"',
    [
        item(
            "mp_xw3ccgYhFis_1",
            r"To find the steady response to a sinusoidal input $\cos \omega t$, a common strategy is to do what?",
            r"Replace the real sinusoid with a complex exponential, solve, then take a real part.",
            [
                C(r"Solve the equation with $e^{i\omega t}$ and take the real part of the result", r"Yes. Working with $e^{i\omega t}$ simplifies the algebra; the real part recovers the cosine response."),
                W(r"Differentiate the input twice and stop", r"Differentiating the input is not solving the equation. What complex substitution streamlines the work?"),
                W(r"Set $\omega = 0$", r"That removes the oscillation entirely. What complex exponential replaces $\cos\omega t$?"),
                W(r"Use separation of variables", r"This linear forced equation is not separable. What complex method handles the sinusoid?"),
            ],
        ),
        item(
            "mp_xw3ccgYhFis_2",
            r"The steady periodic response to a sinusoidal input has the same frequency as the input but generally differs in which two features?",
            r"A linear system reshapes a sinusoid only in size and timing.",
            [
                C(r"Amplitude and phase", r"Yes. A linear time-invariant system scales the amplitude and shifts the phase but keeps the frequency."),
                W(r"Frequency and amplitude", r"The frequency is preserved for a linear system. Which two features actually change?"),
                W(r"Frequency and phase", r"The driving frequency carries through unchanged. What besides phase is altered?"),
                W(r"Shape and frequency", r"The response stays sinusoidal at the same frequency. What two quantities are modified?"),
            ],
        ),
        item(
            "mp_xw3ccgYhFis_3",
            r"Resonance with a sinusoidal input occurs when the forcing frequency is near which value?",
            r"Resonance happens when the drive matches the system's own oscillation.",
            [
                C(r"The natural frequency of the undamped system", r"Yes. Driving near the natural frequency produces a large amplitude response, the hallmark of resonance."),
                W(r"Zero", r"A zero frequency is a constant input, not resonance. What internal frequency must the drive approach?"),
                W(r"Any frequency at all", r"Resonance is selective, not universal. Which special frequency triggers it?"),
                W(r"The amplitude of the input", r"Amplitude is not a frequency. What frequency match causes resonance?"),
            ],
        ),
        item(
            "mp_xw3ccgYhFis_4",
            r"The amplitude of the steady response, as a function of input frequency, is called what?",
            r"This frequency-dependent scaling factor describes how strongly the system responds.",
            [
                C(r"The gain or amplitude response", r"Yes. The gain measures the output amplitude per unit input amplitude across frequencies."),
                W(r"The phase lag", r"Phase lag is the timing shift, not the amplitude factor. What term names the amplitude ratio?"),
                W(r"The Wronskian", r"The Wronskian concerns independence of solutions, not frequency response. What is the amplitude factor called?"),
                W(r"The natural frequency", r"The natural frequency is a single value, not a response curve. What names the amplitude versus frequency?"),
            ],
        ),
        item(
            "mp_xw3ccgYhFis_5",
            r"Why is a sinusoidal input especially convenient for a linear constant-coefficient system?",
            r"Think about the form of the output a sinusoid produces.",
            [
                C(r"The steady output is another sinusoid at the same frequency, so only amplitude and phase need solving", r"Yes. Sinusoids are reshaped but not distorted by linear systems, reducing the work to two numbers."),
                W(r"The output is always zero", r"A nonzero sinusoid generally drives a nonzero response. What form does the output take?"),
                W(r"The output is a polynomial", r"A sinusoidal input yields a sinusoidal steady output, not a polynomial. What is preserved?"),
                W(r"The frequency doubles", r"A linear system does not create new frequencies. What stays the same in the output?"),
            ],
        ),
    ],
)

# === 10.5 video 1 ===========================================================
add_micro(
    "kIT2uMxYh6M",
    'Unit 10, Module 10.5, video 1\n           "Response to Complex Exponential"',
    [
        item(
            "mp_kIT2uMxYh6M_1",
            r"To handle $\cos \omega t$, you replace it with $\operatorname{Re}(e^{i\omega t})$. Why is this valid for a real linear equation?",
            r"A real linear operator commutes with taking the real part.",
            [
                C(r"The operator has real coefficients, so the real part of the complex solution solves the real problem", r"Yes. Taking the real part commutes with a real-coefficient linear operator, so the real part is the answer."),
                W(r"Because complex numbers are always real", r"Complex numbers are not real in general. What property of the operator lets you take the real part at the end?"),
                W(r"Because $\omega$ is imaginary", r"The frequency $\omega$ is real. What feature of the equation's coefficients justifies the real-part trick?"),
                W(r"Because $e^{i\omega t}$ equals $\cos\omega t$", r"By Euler's formula $e^{i\omega t} = \cos\omega t + i\sin\omega t$, not just the cosine. What makes extracting the real part legitimate?"),
            ],
        ),
        item(
            "mp_kIT2uMxYh6M_2",
            r"For $p(D)\,y = e^{i\omega t}$, the complex particular solution is $y_p = \frac{e^{i\omega t}}{p(i\omega)}$. The factor $\frac{1}{p(i\omega)}$ is called what?",
            r"This complex number encodes both the size and timing of the response.",
            [
                C(r"The complex gain (transfer function value)", r"Yes. The complex gain $1/p(i\omega)$ packages amplitude and phase into one complex number."),
                W(r"The Wronskian", r"The Wronskian concerns independence, not frequency response. What is $1/p(i\omega)$ called?"),
                W(r"The natural frequency", r"That is a single real value, not this complex factor. What name fits $1/p(i\omega)$?"),
                W(r"The forcing amplitude", r"The forcing here has unit amplitude; this factor is the system's response. What is it called?"),
            ],
        ),
        item(
            "mp_kIT2uMxYh6M_3",
            r"The amplitude of the steady sinusoidal response is given by which quantity?",
            r"Take the magnitude of the complex gain.",
            [
                C(r"$\left|\frac{1}{p(i\omega)}\right|$", r"Yes. The magnitude of the complex gain sets the output amplitude per unit input."),
                W(r"$\operatorname{Re}\!\left(\frac{1}{p(i\omega)}\right)$", r"The real part alone is not the amplitude. What operation on the complex gain gives the amplitude?"),
                W(r"$\arg\!\left(\frac{1}{p(i\omega)}\right)$", r"The argument gives the phase, not the amplitude. What gives the size of the response?"),
                W(r"$p(i\omega)$", r"That is the inverse of the gain. What magnitude sets the amplitude?"),
            ],
        ),
        item(
            "mp_kIT2uMxYh6M_4",
            r"The phase shift of the steady response is given by which quantity?",
            r"The argument of the complex gain encodes the timing shift.",
            [
                C(r"$\arg\!\left(\frac{1}{p(i\omega)}\right)$, equivalently $-\arg(p(i\omega))$", r"Yes. The argument of the complex gain is the phase the system imposes on the output."),
                W(r"$\left|\frac{1}{p(i\omega)}\right|$", r"The magnitude gives amplitude, not phase. What feature of a complex number gives the phase?"),
                W(r"$\operatorname{Re}(p(i\omega))$", r"A single real part is not the phase angle. What operation extracts the phase?"),
                W(r"$\omega$ itself", r"The drive frequency is not the phase shift. What property of the complex gain sets the phase?"),
            ],
        ),
        item(
            "mp_kIT2uMxYh6M_5",
            r"What is the practical payoff of using the complex exponential method over real undetermined coefficients for sinusoidal forcing?",
            r"Compare solving one complex algebraic equation against a real system of two.",
            [
                C(r"It replaces a two-equation real system with a single complex division", r"Yes. One complex evaluation $1/p(i\omega)$ delivers both amplitude and phase at once."),
                W(r"It avoids needing the characteristic polynomial", r"The polynomial $p$ is exactly what you evaluate at $i\omega$. What computational simplification does the method give?"),
                W(r"It gives an exact answer where the real method only approximates", r"Both methods are exact. What is the efficiency advantage of the complex approach?"),
                W(r"It removes the complementary solution", r"The complementary solution is still added. What does the complex method streamline?"),
            ],
        ),
    ],
)

# === 10.5 video 2 ===========================================================
add_micro(
    "0r2L3wTqkBc",
    'Unit 10, Module 10.5, video 2\n           "Solution for Any Input"',
    [
        item(
            "mp_0r2L3wTqkBc_1",
            r"For a linear system, if input $f_1$ produces response $y_1$ and input $f_2$ produces $y_2$, then input $f_1 + f_2$ produces what?",
            r"Linearity lets responses add just as inputs do.",
            [
                C(r"$y_1 + y_2$", r"Yes. Superposition for the forced response means responses add when inputs add."),
                W(r"$y_1 \cdot y_2$", r"Responses add under superposition, they do not multiply. What is the response to $f_1 + f_2$?"),
                W(r"$\frac{y_1 + y_2}{2}$", r"No averaging occurs. What does linearity give for the sum of inputs?"),
                W(r"Neither, the system must be resolved from scratch", r"Linearity avoids restarting. What simple combination gives the response?"),
            ],
        ),
        item(
            "mp_0r2L3wTqkBc_2",
            r"The idea of building the response to an arbitrary input by summing responses to simple pieces relies on which property?",
            r"This is the defining feature that makes decomposition work.",
            [
                C(r"Linearity (superposition)", r"Yes. Linearity lets you decompose any input and add the individual responses."),
                W(r"Nonlinearity", r"Nonlinearity would block this decomposition. What property enables it?"),
                W(r"Periodicity of the input", r"The input need not be periodic. What structural property of the system allows summing responses?"),
                W(r"Constant forcing", r"The forcing can vary arbitrarily. What property handles a general input by pieces?"),
            ],
        ),
        item(
            "mp_0r2L3wTqkBc_3",
            r"Breaking a general input into a continuum of impulses and summing the responses leads naturally to which construction?",
            r"A continuous sum of scaled, shifted impulse responses is an integral.",
            [
                C(r"A convolution integral with the impulse response", r"Yes. Summing impulse responses over a continuum gives the convolution of the input with the impulse response."),
                W(r"A characteristic polynomial", r"The characteristic polynomial comes from the homogeneous equation, not from summing impulses. What integral construction results?"),
                W(r"A Wronskian determinant", r"The Wronskian is unrelated to summing impulse responses. What integral does the continuum sum become?"),
                W(r"A separable equation", r"Separation is not involved. What integral expresses the response to a general input?"),
            ],
        ),
        item(
            "mp_0r2L3wTqkBc_4",
            r"Decomposing an input into sinusoids of many frequencies and summing the steady responses is the idea behind which tool?",
            r"Representing a signal as a sum of sinusoids is a classical analysis technique.",
            [
                C(r"Fourier analysis", r"Yes. Fourier methods write the input as a sum of sinusoids, each handled by the frequency response."),
                W(r"The Wronskian test", r"That tests independence, not frequency decomposition. What method sums sinusoidal responses?"),
                W(r"Reduction of order", r"Reduction of order finds a second homogeneous solution, unrelated to frequency content. What tool decomposes into sinusoids?"),
                W(r"Exactness testing", r"Exactness applies to first-order forms, not frequency decomposition. What analysis sums sinusoidal responses?"),
            ],
        ),
        item(
            "mp_0r2L3wTqkBc_5",
            r"Why can the response to a complicated input often be assembled from a small library of elementary responses?",
            r"The system's linearity means complex behavior is built from simple building blocks.",
            [
                C(r"Linearity lets you decompose the input into elementary parts and add their known responses", r"Yes. Because the system is linear, responses to simple inputs combine to give the full response."),
                W(r"Because all inputs are essentially the same", r"Inputs genuinely differ; the method handles that diversity. What property lets simple responses combine?"),
                W(r"Because the system ignores most of the input", r"The system responds to the whole input. What lets elementary responses be summed?"),
                W(r"Because nonlinear effects cancel", r"There are no nonlinear effects in a linear system. What underlies the decomposition?"),
            ],
        ),
    ],
)

# === 10.6 video 1 ===========================================================
add_micro(
    "S2-26LR8_Es",
    'Unit 10, Module 10.6, video 1\n           "Finding the Homogeneous (Transient) Solution"',
    [
        item(
            "mp_S2-26LR8_Es_1",
            r"In a stable forced system, the transient part of the solution corresponds to which piece?",
            r"The transient is the part that fades as time grows.",
            [
                C(r"The complementary (homogeneous) solution", r"Yes. The homogeneous solution is the transient, decaying away in a stable system."),
                W(r"The particular solution", r"The particular solution persists as the steady state, not the transient. Which piece decays?"),
                W(r"The forcing function", r"The forcing drives the response; it is not the transient itself. Which solution component fades?"),
                W(r"The Wronskian", r"The Wronskian is not a solution component. Which part of the solution is the transient?"),
            ],
        ),
        item(
            "mp_S2-26LR8_Es_2",
            r"Why is the homogeneous solution called transient in a stable system?",
            r"Stable means the characteristic roots have negative real parts.",
            [
                C(r"Its terms decay to zero as $t \to \infty$ because the roots have negative real parts", r"Yes. Negative real parts make the exponential terms vanish over time, so the homogeneous part is transient."),
                W(r"It grows without bound", r"In a stable system the homogeneous part decays, not grows. What happens to it as $t \to \infty$?"),
                W(r"It equals the forcing", r"The homogeneous part does not match the forcing. Why does it disappear over time?"),
                W(r"It is constant in time", r"It generally changes and decays. What feature of the roots makes it fade?"),
            ],
        ),
        item(
            "mp_S2-26LR8_Es_3",
            r"The transient solution is found from which equation?",
            r"Drop the forcing and solve what remains.",
            [
                C(r"The associated homogeneous equation $L[y] = 0$", r"Yes. Setting the forcing to zero and solving gives the transient via the characteristic equation."),
                W(r"The full nonhomogeneous equation $L[y] = g$", r"That gives the complete solution, not just the transient. What reduced equation isolates the transient?"),
                W(r"The equation $L[y] = g'$", r"Differentiating the forcing is not the method. What equation yields the homogeneous part?"),
                W(r"An algebraic equation with no derivatives", r"The transient comes from a differential equation. Which one, with the forcing removed?"),
            ],
        ),
        item(
            "mp_S2-26LR8_Es_4",
            r"Which part of the solution carries the dependence on the initial conditions in a stable forced system?",
            r"The arbitrary constants live in the transient piece.",
            [
                C(r"The transient (homogeneous) part", r"Yes. The arbitrary constants set by the initial data sit in the transient, which then decays."),
                W(r"The steady-state part", r"The steady state is fixed by the forcing, not the initial data. Which part holds the constants?"),
                W(r"Neither part depends on initial conditions", r"The initial data must enter somewhere. Which component carries the arbitrary constants?"),
                W(r"Both parts equally", r"The constants attach to one specific component. Which one holds the initial-condition dependence?"),
            ],
        ),
        item(
            "mp_S2-26LR8_Es_5",
            r"For $y'' + 5y' + 6y = g(t)$, the transient solution is built from which roots?",
            r"Solve the characteristic equation $r^2 + 5r + 6 = 0$.",
            [
                C(r"$r = -2$ and $r = -3$, giving $c_1 e^{-2t} + c_2 e^{-3t}$", r"Correct. Both roots are negative, so the transient $c_1 e^{-2t} + c_2 e^{-3t}$ decays."),
                W(r"$r = 2$ and $r = 3$, giving a growing solution", r"Check the signs of the roots of $r^2 + 5r + 6 = (r+2)(r+3)$. Are they positive or negative?"),
                W(r"$r = \pm i$, giving sustained oscillation", r"The discriminant here is positive, giving real roots. What are they?"),
                W(r"$r = -5, -6$", r"Those are not the roots of $r^2 + 5r + 6$. What does $(r+2)(r+3) = 0$ give?"),
            ],
        ),
    ],
)

# === 10.6 video 2 ===========================================================
add_micro(
    "GLd1MgiTne4",
    'Unit 10, Module 10.6, video 2\n           "Finding the Particular (Steady-State) Solution"',
    [
        item(
            "mp_GLd1MgiTne4_1",
            r"In a stable forced system, the steady-state response corresponds to which piece of the solution?",
            r"The steady state is what remains after the transient dies out.",
            [
                C(r"The particular solution", r"Yes. The particular solution is the persistent steady state once the transient has decayed."),
                W(r"The homogeneous solution", r"The homogeneous solution is the transient, which fades. Which piece persists?"),
                W(r"The initial condition", r"Initial data sets the transient, not the steady state. Which solution component remains long-term?"),
                W(r"The characteristic polynomial", r"That polynomial determines the transient roots, not the steady state. Which solution piece is steady?"),
            ],
        ),
        item(
            "mp_GLd1MgiTne4_2",
            r"For sinusoidal forcing in a stable system, the steady-state response is what kind of function?",
            r"A linear system reshapes a sinusoid into a sinusoid.",
            [
                C(r"A sinusoid at the forcing frequency, with shifted amplitude and phase", r"Yes. The steady state oscillates at the drive frequency, scaled and phase-shifted."),
                W(r"A decaying exponential", r"Decay belongs to the transient, not the steady state. What persistent form does sinusoidal forcing give?"),
                W(r"A constant", r"A sinusoidal drive yields an oscillating steady state, not a constant. What is its form?"),
                W(r"A growing oscillation", r"In a stable system, away from resonance, the steady state has bounded amplitude. What is its form?"),
            ],
        ),
        item(
            "mp_GLd1MgiTne4_3",
            r"Long after the start, why does the response become essentially independent of the initial conditions?",
            r"The initial-condition dependence lives in the transient.",
            [
                C(r"The transient carrying the initial-condition dependence has decayed away", r"Yes. Once the transient vanishes, only the steady state remains, which is set by the forcing."),
                W(r"Because the forcing also decays", r"The forcing persists; it is the transient that decays. Why does initial-condition dependence vanish?"),
                W(r"Because the steady state depends on initial data", r"The steady state is fixed by the forcing, not the initial data. What decays to remove that dependence?"),
                W(r"Because the system becomes nonlinear", r"The system stays linear. What component fades, leaving the forcing-driven response?"),
            ],
        ),
        item(
            "mp_GLd1MgiTne4_4",
            r"The complete solution of a stable forced system is best described as which combination?",
            r"Add the fading part to the persistent part.",
            [
                C(r"Transient plus steady-state", r"Yes. The full response is the decaying transient added to the persistent steady state."),
                W(r"Transient times steady-state", r"The two parts add, they do not multiply. How do they combine?"),
                W(r"Steady-state minus transient", r"The transient is added, not subtracted. What is the correct combination?"),
                W(r"Steady-state only", r"The transient is present early on, before it decays. What full combination describes the solution?"),
            ],
        ),
        item(
            "mp_GLd1MgiTne4_5",
            r"To find the steady-state response to a sinusoidal input, which technique is most direct?",
            r"Match the forcing with a guess of the same sinusoidal type, or use the complex gain.",
            [
                C(r"Undetermined coefficients or the complex gain $1/p(i\omega)$", r"Yes. A sinusoidal trial or the complex gain directly yields the steady-state amplitude and phase."),
                W(r"Solving the homogeneous equation", r"The homogeneous equation gives the transient, not the steady state. What targets the particular solution?"),
                W(r"Computing the Wronskian", r"The Wronskian addresses independence, not the steady state. What method finds the particular response?"),
                W(r"Reduction of order", r"That finds a second homogeneous solution. What method yields the steady-state particular solution?"),
            ],
        ),
    ],
)

# === 10.7 video 1 ===========================================================
add_micro(
    "LjqUV6vqwkg",
    'Unit 10, Module 10.7, video 1\n           "Unit Step and Impulse Response"',
    [
        item(
            "mp_LjqUV6vqwkg_1",
            r"The impulse response of a system is its response to which input?",
            r"It is the output when the system is driven by a unit impulse.",
            [
                C(r"The Dirac delta $\delta(t)$, a unit impulse", r"Yes. The impulse response is the output produced by a unit impulse $\delta(t)$ from rest."),
                W(r"The unit step $u(t)$", r"That gives the step response, a related but different quantity. What input defines the impulse response?"),
                W(r"A constant input", r"A constant is not an impulse. What sharp input defines the impulse response?"),
                W(r"A sinusoid", r"A sinusoid gives the frequency response. What input defines the impulse response?"),
            ],
        ),
        item(
            "mp_LjqUV6vqwkg_2",
            r"The unit step response and the impulse response are related how?",
            r"Recall the calculus relationship between the step and the delta.",
            [
                C(r"The step response is the integral of the impulse response", r"Yes. Since the step is the integral of the delta, the step response integrates the impulse response."),
                W(r"They are identical", r"They differ by a calculus operation. How is the step response obtained from the impulse response?"),
                W(r"The step response is the derivative of the impulse response", r"You have the operation reversed. Is the step the integral or the derivative of the delta?"),
                W(r"They are unrelated", r"They are closely linked through the step-delta relationship. What operation connects their responses?"),
            ],
        ),
        item(
            "mp_LjqUV6vqwkg_3",
            r"The Dirac delta $\delta(t)$ is related to the unit step $u(t)$ by which statement?",
            r"Think of the step as switching on, and its rate of change.",
            [
                C(r"$\delta(t)$ is the derivative of $u(t)$", r"Yes. The delta is the derivative of the step, concentrated at the jump."),
                W(r"$\delta(t)$ is the integral of $u(t)$", r"Integrating the step gives a ramp, not the delta. What derivative relationship holds?"),
                W(r"$\delta(t) = u(t)$", r"The two are different objects. How is the delta obtained from the step?"),
                W(r"$\delta(t) = u(t)^2$", r"Squaring is not the relationship. What calculus operation links them?"),
            ],
        ),
        item(
            "mp_LjqUV6vqwkg_4",
            r"Why is the impulse response so important for a linear time-invariant system?",
            r"Once you know it, general inputs can be handled by combining shifted copies.",
            [
                C(r"It lets you build the response to any input by convolution", r"Yes. The impulse response is the kernel that, convolved with the input, gives the full response."),
                W(r"It is the only solution the system has", r"Systems have many responses for different inputs. Why is the impulse response uniquely useful?"),
                W(r"It equals the forcing function", r"It is a response, not the forcing. What does knowing it let you compute for any input?"),
                W(r"It removes the need for initial conditions", r"Initial conditions still matter. What general construction does the impulse response enable?"),
            ],
        ),
        item(
            "mp_LjqUV6vqwkg_5",
            r"The impulse response is typically defined with which initial conditions?",
            r"The system should start from rest so the response is due only to the impulse.",
            [
                C(r"Rest initial conditions (zero state before the impulse)", r"Yes. Starting from rest isolates the response caused purely by the impulse."),
                W(r"Arbitrary nonzero initial conditions", r"Nonzero initial energy would mix in a transient unrelated to the impulse. What starting state isolates the impulse response?"),
                W(r"A steady sinusoidal state", r"That would not isolate the impulse effect. What rest condition is used?"),
                W(r"Conditions matching the forcing amplitude", r"The impulse response uses a standardized start. What initial state is that?"),
            ],
        ),
    ],
)

# === 10.7 video 2 ===========================================================
add_micro(
    "q0PxCQWG3ic",
    'Unit 10, Module 10.7, video 2\n           "Step and Delta Functions"',
    [
        item(
            "mp_q0PxCQWG3ic_1",
            r"The unit step function $u(t)$ is defined by which values?",
            r"It switches from off to on at $t = 0$.",
            [
                C(r"$u(t) = 0$ for $t < 0$ and $u(t) = 1$ for $t > 0$", r"Yes. The step is zero before the switch and one after."),
                W(r"$u(t) = 1$ for all $t$", r"A constant one does not switch on. What values does the step take before and after $t = 0$?"),
                W(r"$u(t) = t$ for $t > 0$", r"That describes a ramp, not a step. What constant value does the step hold for $t > 0$?"),
                W(r"$u(t) = 0$ for all $t$", r"A constant zero never turns on. What value does the step reach after $t = 0$?"),
            ],
        ),
        item(
            "mp_q0PxCQWG3ic_2",
            r"The total area under the Dirac delta $\delta(t)$ is what?",
            r"The delta is normalized to a unit impulse.",
            [
                C(r"$\int_{-\infty}^{\infty} \delta(t)\,dt = 1$", r"Yes. The delta integrates to one, encoding a unit impulse concentrated at a point."),
                W(r"$0$", r"A zero integral would carry no impulse. What normalization does the unit delta have?"),
                W(r"$\infty$", r"Despite its spike, the delta has finite unit area. What is that area?"),
                W(r"It depends on $t$", r"The total area is a single number, not a function of $t$. What is it?"),
            ],
        ),
        item(
            "mp_q0PxCQWG3ic_3",
            r"The sifting property of the delta states that $\int_{-\infty}^{\infty} f(t)\,\delta(t - a)\,dt$ equals what?",
            r"The delta picks out the value of $f$ at the spike location.",
            [
                C(r"$f(a)$", r"Yes. The delta samples $f$ at $t = a$, returning $f(a)$."),
                W(r"$f(0)$", r"The spike sits at $t = a$, not $t = 0$. What value of $f$ does it pick out?"),
                W(r"$\int f(t)\,dt$", r"The delta extracts a single value, not the full integral. What is $f$ evaluated at the spike?"),
                W(r"$a$", r"The result is the function value, not the location. What is $f(a)$ here?"),
            ],
        ),
        item(
            "mp_q0PxCQWG3ic_4",
            r"The delta function is best understood as an idealization of what?",
            r"Picture a tall, narrow pulse with fixed total area.",
            [
                C(r"A very short, very tall pulse with unit area, in the limit", r"Yes. The delta is the limit of pulses that grow taller and narrower while keeping area one."),
                W(r"A slowly varying smooth function", r"The delta is the opposite of slowly varying. What limiting shape does it idealize?"),
                W(r"A constant function", r"A constant has no spike. What concentrated pulse does the delta represent?"),
                W(r"A linear ramp", r"A ramp grows steadily, unlike the delta's spike. What pulse shape does it idealize?"),
            ],
        ),
        item(
            "mp_q0PxCQWG3ic_5",
            r"Modeling a sharp hammer strike on a mass-spring system as a delta input captures which physical idea?",
            r"The strike delivers its effect almost instantaneously.",
            [
                C(r"A large force applied over a vanishingly short time, delivering a finite impulse", r"Yes. The delta models a brief, intense force that imparts a finite impulse essentially at one instant."),
                W(r"A small force applied steadily forever", r"That is a constant input, not a strike. What brief, intense input does the delta model?"),
                W(r"A slowly increasing force", r"A gradual force is not a strike. What sudden input does the delta represent?"),
                W(r"No force at all", r"A strike is a real force. What idealized brief force does the delta capture?"),
            ],
        ),
    ],
)

# === 10.8 video 1 ===========================================================
add_micro(
    "MT2_9Ek9Y4o",
    'Unit 10, Module 10.8, video 1\n           "Duhamel\'s Principle, Physical and Mathematical Proofs"',
    [
        item(
            "mp_MT2_9Ek9Y4o_1",
            r"Duhamel's principle expresses the response to a general input $f(t)$ as which kind of integral involving the impulse response $w$?",
            r"It superposes scaled, shifted impulse responses over time.",
            [
                C(r"A convolution $\int_0^t w(t - \tau)\,f(\tau)\,d\tau$", r"Yes. Duhamel's principle convolves the input with the impulse response to give the forced response."),
                W(r"A product $w(t)\,f(t)$", r"The combination is a convolution integral, not a pointwise product. What integral form does Duhamel use?"),
                W(r"A derivative $\frac{d}{dt}\big(w f\big)$", r"Differentiation is not the construction. What integral superposes impulse responses?"),
                W(r"A sum $w(t) + f(t)$", r"The pieces are convolved, not added. What integral expresses the response?"),
            ],
        ),
        item(
            "mp_MT2_9Ek9Y4o_2",
            r"The physical idea behind Duhamel's principle is to view the input as what?",
            r"Decompose the continuous forcing into infinitesimal kicks.",
            [
                C(r"A continuous succession of small impulses, each producing a scaled impulse response", r"Yes. Breaking the input into impulses and summing their responses gives the convolution."),
                W(r"A single steady force", r"Duhamel handles time-varying inputs, not just a steady force. How is the input decomposed?"),
                W(r"A sum of homogeneous solutions", r"The decomposition is of the input, not of homogeneous solutions. Into what pieces is the input split?"),
                W(r"A constant times the impulse response", r"The input generally varies in time. What collection of impulses represents it?"),
            ],
        ),
        item(
            "mp_MT2_9Ek9Y4o_3",
            r"Duhamel's convolution formula is valid under which assumption about initial conditions?",
            r"The impulse response is defined from rest, so the forced response inherits that.",
            [
                C(r"The system starts from rest (zero initial conditions)", r"Yes. The convolution gives the forced response from rest; any initial energy is added separately."),
                W(r"The system starts at maximum displacement", r"A nonzero start adds a separate transient. What rest assumption underlies the convolution?"),
                W(r"The input is periodic", r"Periodicity is not required. What initial-state assumption is needed?"),
                W(r"The forcing is constant", r"Duhamel handles general forcing. What initial condition makes the convolution exact?"),
            ],
        ),
        item(
            "mp_MT2_9Ek9Y4o_4",
            r"Which two structural properties of the system make Duhamel's principle work?",
            r"Superposition and a fixed response to a shifted impulse are both needed.",
            [
                C(r"Linearity and time invariance", r"Yes. Linearity lets responses add, and time invariance makes the shifted impulse response depend only on $t - \tau$."),
                W(r"Nonlinearity and periodicity", r"Nonlinearity would break superposition. What two properties actually enable the convolution?"),
                W(r"Exactness and separability", r"Those are first-order concepts unrelated here. What properties does Duhamel require?"),
                W(r"Constant forcing and zero damping", r"Neither is required. What structural properties make convolution valid?"),
            ],
        ),
        item(
            "mp_MT2_9Ek9Y4o_5",
            r"In the convolution $\int_0^t w(t - \tau) f(\tau)\,d\tau$, what does the argument $t - \tau$ represent?",
            r"It measures how long ago each impulse was applied.",
            [
                C(r"The elapsed time since the impulse at time $\tau$ acted", r"Yes. The impulse response is evaluated at the time elapsed since each kick, namely $t - \tau$."),
                W(r"The total duration of the input", r"It is a per-impulse elapsed time, not the whole duration. What does $t - \tau$ measure for an impulse at $\tau$?"),
                W(r"The amplitude of the input", r"Amplitude is carried by $f(\tau)$, not by $t - \tau$. What time does the argument represent?"),
                W(r"The natural frequency", r"It is a time difference, not a frequency. What elapsed time does $t - \tau$ give?"),
            ],
        ),
    ],
)

# === 10.8 video 2 ===========================================================
add_micro(
    "Tv8vAhkrEXQ",
    'Unit 10, Module 10.8, video 2\n           "Duhamel\'s principle for an ODE"',
    [
        item(
            "mp_Tv8vAhkrEXQ_1",
            r"The impulse response $w(t)$ used in Duhamel's convolution is also known as which function?",
            r"It weights each past impulse in the convolution integral.",
            [
                C(r"The weight function (or Green's function for the initial-value problem)", r"Yes. The impulse response acts as the weight, or Green's function, in the convolution."),
                W(r"The characteristic polynomial", r"That is an algebraic object from the homogeneous equation, not a time response. What function weights the impulses?"),
                W(r"The forcing function", r"The forcing is $f$, separate from the weight. What is $w$ called?"),
                W(r"The Wronskian", r"The Wronskian measures independence, not impulse response. What name does $w$ carry?"),
            ],
        ),
        item(
            "mp_Tv8vAhkrEXQ_2",
            r"For a constant-coefficient second-order system, the impulse response $w(t)$ is built from which solutions?",
            r"It is a specific homogeneous solution satisfying impulse initial conditions.",
            [
                C(r"The homogeneous solutions, with constants fixed by the impulse (rest then unit jump in the derivative)", r"Yes. The impulse response is a homogeneous solution matched to the jump conditions an impulse imposes."),
                W(r"The forcing function alone", r"The forcing is convolved against $w$; it does not define $w$. What solutions build the impulse response?"),
                W(r"A particular solution for sinusoidal input", r"The impulse response is not tied to sinusoidal forcing. What homogeneous data defines it?"),
                W(r"The steady-state solution", r"The steady state depends on the forcing; $w$ is intrinsic to the system. What builds $w$?"),
            ],
        ),
        item(
            "mp_Tv8vAhkrEXQ_3",
            r"The lower limit $0$ and upper limit $t$ in $\int_0^t w(t-\tau)f(\tau)\,d\tau$ encode which principle?",
            r"Only inputs that have already occurred can affect the present.",
            [
                C(r"Causality, since only inputs up to the present time $t$ contribute", r"Yes. The response at time $t$ depends only on inputs from $0$ up to $t$, which is causality."),
                W(r"Periodicity", r"The limits are about cause and effect, not repetition. What principle restricts the integration to past inputs?"),
                W(r"Conservation of energy", r"Energy conservation is a different idea. What does integrating only up to $t$ express?"),
                W(r"Resonance", r"Resonance concerns frequency matching, not the integration limits. What principle do the limits encode?"),
            ],
        ),
        item(
            "mp_Tv8vAhkrEXQ_4",
            r"Duhamel's principle is one concrete realization of which general solution technique?",
            r"It builds solutions from a kernel convolved with the source.",
            [
                C(r"The Green's function method", r"Yes. The impulse response is the Green's function, and Duhamel's convolution is the Green's function solution."),
                W(r"Separation of variables", r"Separation is unrelated to convolving with an impulse response. What kernel method does Duhamel realize?"),
                W(r"Undetermined coefficients", r"That guesses a particular form; it is not a convolution. What general method underlies Duhamel?"),
                W(r"The characteristic equation method", r"That solves the homogeneous part algebraically. What kernel-based technique does Duhamel embody?"),
            ],
        ),
        item(
            "mp_Tv8vAhkrEXQ_5",
            r"What is the main advantage of the Duhamel convolution form for the particular solution?",
            r"One formula handles every forcing once the impulse response is known.",
            [
                C(r"It gives the response to any forcing $f$ with a single integral, once $w$ is known", r"Yes. With the impulse response in hand, any input is handled by one convolution, without re-guessing."),
                W(r"It eliminates the need to find the impulse response", r"The impulse response $w$ is exactly what the method needs first. What does it then let you do for any $f$?"),
                W(r"It only works for sinusoidal forcing", r"Duhamel handles general forcing, not just sinusoids. What broad capability does it provide?"),
                W(r"It removes all integration", r"It is built on an integral. What is its real advantage across different forcings?"),
            ],
        ),
    ],
)

# ============================================================================
# UNIT 9 MASTERY  (30 items, um_9_1 .. um_9_30)
# ============================================================================

m9(
    "um_9_1",
    r"What is the general form of a linear second-order differential equation?",
    r"Each of $y$, $y'$, $y''$ appears to the first power with coefficients in $x$.",
    [
        C(r"$a(x)\,y'' + b(x)\,y' + c(x)\,y = g(x)$", r"Yes. All derivative terms are first power with $x$-dependent coefficients and a forcing $g$."),
        W(r"$a(x)\,(y'')^2 + c(x)\,y = g(x)$", r"Squaring $y''$ breaks linearity. To what power may each derivative appear?"),
        W(r"$y'' = g(x,y,y')$ with $g$ nonlinear in $y$", r"Nonlinear dependence on $y$ is not allowed. How must $y$ and its derivatives enter?"),
        W(r"$a(x)\,y''' + c(x)\,y = g(x)$", r"A $y'''$ term makes it third order. What is the highest derivative in a second-order equation?"),
    ],
)

m9(
    "um_9_2",
    r"How many arbitrary constants does the general solution of a second-order linear equation contain?",
    r"Match the constant count to the order.",
    [
        C(r"Two", r"Yes. Order two gives two arbitrary constants, fixed by two side conditions."),
        W(r"One", r"One constant fits a first-order equation. How does the count relate to order two?"),
        W(r"Three", r"Three would suit third order. What is the order here?"),
        W(r"Zero", r"A general solution is a family with free parameters. How many for order two?"),
    ],
)

m9(
    "um_9_3",
    r"For $y'' + p(x)y' + q(x)y = g(x)$, the existence and uniqueness theorem guarantees a unique solution through $x_0$ when what holds?",
    r"The hypothesis is continuity of the coefficients and forcing on an interval around $x_0$.",
    [
        C(r"$p$, $q$, $g$ are continuous on an interval containing $x_0$", r"Yes. Continuity on an interval around $x_0$ guarantees a unique solution there."),
        W(r"$p$, $q$, $g$ are constants", r"Constancy is stronger than required. What weaker condition suffices?"),
        W(r"$g = 0$", r"The theorem covers nonhomogeneous equations. What must be true of $p$, $q$, $g$?"),
        W(r"The equation is exact", r"Exactness is a first-order concept. What continuity hypothesis is needed?"),
    ],
)

m9(
    "um_9_4",
    r"Why does superposition produce new solutions for $L[y]=0$ but not directly for $L[y]=g$ with $g \neq 0$?",
    r"Apply $L$ to the sum of two solutions in each case.",
    [
        C(r"Adding two solutions of $L[y]=g$ gives $L=2g$, while for $L[y]=0$ the sum still gives zero", r"Yes. Zero is preserved under addition, but a nonzero forcing doubles."),
        W(r"Superposition works the same for both", r"Test $L[y]=g$: the sum gives $2g$. Does that equal $g$?"),
        W(r"The nonhomogeneous equation has no solutions", r"It does. What goes wrong when you add two particular solutions?"),
        W(r"Because $g$ must be discontinuous", r"Continuity is not the issue. What value does $L$ give for the sum of two particular solutions?"),
    ],
)

m9(
    "um_9_5",
    r"Two solutions form a fundamental set for a second-order homogeneous equation precisely when they are what?",
    r"They must span the full two-parameter solution space.",
    [
        C(r"Linearly independent", r"Yes. Two independent solutions span every solution through linear combinations."),
        W(r"Proportional", r"Proportional solutions are dependent and span too little. What must they be instead?"),
        W(r"Both zero", r"The zero function carries no information. What independence is required?"),
        W(r"Equal", r"Equal solutions are dependent. What property defines a fundamental set?"),
    ],
)

m9(
    "um_9_6",
    r"The Wronskian of $y_1, y_2$ is which expression?",
    r"It is the determinant of functions over their first derivatives.",
    [
        C(r"$W = y_1 y_2' - y_2 y_1'$", r"Yes. The Wronskian is this determinant of the two solutions and their derivatives."),
        W(r"$W = y_1 y_2' + y_2 y_1'$", r"A determinant subtracts. Which sign joins the cross products?"),
        W(r"$W = y_1 y_2 - y_1' y_2'$", r"The pairing crosses functions with derivatives. What are the correct products?"),
        W(r"$W = y_1' y_2 - y_2' y_1$", r"That is the negative of the standard form; the conventional order pairs $y_1$ with $y_2'$ first. What is the usual definition?"),
    ],
)

m9(
    "um_9_7",
    r"Compute the Wronskian of $y_1 = e^{x}$ and $y_2 = e^{3x}$.",
    r"Use $W = y_1 y_2' - y_2 y_1'$ with $y_2' = 3e^{3x}$.",
    [
        C(r"$W = 2e^{4x}$", r"Correct. $e^x\cdot 3e^{3x} - e^{3x}\cdot e^x = 3e^{4x} - e^{4x} = 2e^{4x}$."),
        W(r"$W = e^{4x}$", r"Check the coefficient: $3e^{4x} - e^{4x}$. What is $3 - 1$ times $e^{4x}$?"),
        W(r"$W = 0$", r"These exponentials are independent. Recompute $y_1 y_2' - y_2 y_1'$."),
        W(r"$W = 4e^{4x}$", r"Add and subtract carefully: $3 - 1 = 2$, not $4$. What is the result?"),
    ],
)

m9(
    "um_9_8",
    r"A nonzero Wronskian on an interval establishes which property of the two functions?",
    r"Recall the conclusion a nonvanishing Wronskian supports.",
    [
        C(r"Linear independence", r"Yes. A nonzero Wronskian certifies independence."),
        W(r"Linear dependence", r"That is the opposite conclusion. What does $W \neq 0$ establish?"),
        W(r"They are equal", r"Equal functions give $W = 0$. What does a nonzero value imply?"),
        W(r"They are both constant", r"Constancy is unrelated. What independence does $W \neq 0$ give?"),
    ],
)

m9(
    "um_9_9",
    r"If two solutions of a homogeneous linear equation are linearly dependent, their Wronskian is what?",
    r"Dependence means one is a constant multiple of the other.",
    [
        C(r"Identically zero", r"Yes. Dependence forces the determinant to vanish everywhere."),
        W(r"Nonzero everywhere", r"Dependence makes $W$ vanish, not stay nonzero. What value does it take?"),
        W(r"Sometimes zero, sometimes not", r"For solutions, Abel's theorem forbids mixed behavior. What single value results from dependence?"),
        W(r"Equal to one", r"A dependent pair gives a vanishing determinant. What is $W$?"),
    ],
)

m9(
    "um_9_10",
    r"Abel's identity gives the Wronskian of solutions of $y'' + p y' + q y = 0$ as which expression?",
    r"The Wronskian solves $W' = -pW$.",
    [
        C(r"$W = W(x_0)\,\exp\!\left(-\int p\,dx\right)$", r"Yes. Abel's identity gives $W$ as a constant times $\exp(-\int p\,dx)$."),
        W(r"$W = W(x_0)\,\exp\!\left(\int p\,dx\right)$", r"Check the sign of the exponent. Is it $+\int p$ or $-\int p$?"),
        W(r"$W = W(x_0)\,\exp\!\left(-\int q\,dx\right)$", r"The exponent uses $p$, the $y'$ coefficient, not $q$. Which appears?"),
        W(r"$W = W(x_0) - \int p\,dx$", r"The dependence is exponential, not additive. What wraps the integral?"),
    ],
)

m9(
    "um_9_11",
    r"For $y'' - 3y' + 2y = 0$, Abel's identity gives the Wronskian proportional to which function?",
    r"Here $p = -3$, so the exponent is $-\int(-3)\,dx = 3x$.",
    [
        C(r"$e^{3x}$", r"Correct. With $p = -3$, $W \propto e^{3x}$."),
        W(r"$e^{-3x}$", r"Mind the double negative: $-\int(-3)\,dx$. What is the exponent?"),
        W(r"$e^{2x}$", r"The exponent comes from $p$, not from the constant term $2$. What is $-\int p\,dx$?"),
        W(r"a constant", r"A constant requires $p = 0$, but $p = -3$. What exponential results?"),
    ],
)

m9(
    "um_9_12",
    r"Reduction of order seeks a second solution in which form, given a known $y_1$?",
    r"Multiply the known solution by an unknown function.",
    [
        C(r"$y_2 = v(x)\,y_1$", r"Yes. Writing $y_2 = v y_1$ reduces the problem to first order in $v'$."),
        W(r"$y_2 = v(x) + y_1$", r"The method scales $y_1$, not adds to it. What product form is used?"),
        W(r"$y_2 = c\,y_1$ for a constant $c$", r"A constant multiple is dependent. What nonconstant multiplier is allowed?"),
        W(r"$y_2 = y_1^2$", r"Squaring is not the ansatz. What multiplicative unknown is introduced?"),
    ],
)

m9(
    "um_9_13",
    r"For $y'' - 2y' + y = 0$ with $y_1 = e^{x}$, reduction of order gives which second solution?",
    r"This is the repeated-root case, yielding the known exponential times $x$.",
    [
        C(r"$y_2 = x e^{x}$", r"Correct. The double root at $1$ gives $v = x$, so $y_2 = x e^x$."),
        W(r"$y_2 = e^{-x}$", r"The root here is repeated, not a $\pm$ pair. What factor times $e^x$ results?"),
        W(r"$y_2 = e^{2x}$", r"The repeated root is $1$, not $2$. What second solution does it give?"),
        W(r"$y_2 = x^2 e^{x}$", r"A simple double root adds one factor of $x$, not two. What is $y_2$?"),
    ],
)

m9(
    "um_9_14",
    r"Why must the function $v(x)$ in $y_2 = v y_1$ be nonconstant?",
    r"Consider what $y_2$ becomes if $v$ is constant.",
    [
        C(r"A constant $v$ makes $y_2$ proportional to $y_1$, hence dependent", r"Yes. Only a nonconstant $v$ yields an independent second solution."),
        W(r"A constant $v$ makes $y_2$ undefined", r"$y_2$ stays defined; it is just not new. What dependence issue arises?"),
        W(r"A constant $v$ changes the equation", r"The equation is unchanged. What happens to independence if $v$ is constant?"),
        W(r"It need not be nonconstant", r"It must be, for independence. What does a constant $v$ do to $y_2$?"),
    ],
)

m9(
    "um_9_15",
    r"The reduction-of-order integrand $\exp(-\int p\,dx)/y_1^2$ contains the factor $\exp(-\int p\,dx)$, which is proportional to what?",
    r"Recall Abel's identity.",
    [
        C(r"The Wronskian of the two solutions", r"Yes. Abel's identity makes that factor proportional to $W$, which is why it appears."),
        W(r"The known solution $y_1$", r"It is not $y_1$ itself. Which Wronskian quantity is it?"),
        W(r"The coefficient $q$", r"It is built from $p$, not $q$. What is it proportional to?"),
        W(r"Always one", r"It equals one only when $p = 0$. In general, what does it represent?"),
    ],
)

m9(
    "um_9_16",
    r"Substituting $y = e^{rx}$ into $a y'' + b y' + c y = 0$ yields which characteristic equation?",
    r"Each derivative brings a factor of $r$, and $e^{rx}$ cancels.",
    [
        C(r"$a r^2 + b r + c = 0$", r"Yes. The exponential cancels, leaving this quadratic in $r$."),
        W(r"$a r + b = 0$", r"That ignores the second derivative. What quadratic results?"),
        W(r"$a r^2 - b r + c = 0$", r"The sign on $br$ should match $b$. What is the correct quadratic?"),
        W(r"$r^2 + 1 = 0$", r"The coefficients are $a, b, c$, not fixed numbers. What is the general form?"),
    ],
)

m9(
    "um_9_17",
    r"Solve $y'' - 5y' + 6y = 0$. What is the general solution?",
    r"Factor $r^2 - 5r + 6 = (r-2)(r-3)$.",
    [
        C(r"$y = c_1 e^{2x} + c_2 e^{3x}$", r"Correct. Distinct roots $2, 3$ give two independent exponentials."),
        W(r"$y = c_1 e^{-2x} + c_2 e^{-3x}$", r"Check the signs of the roots of $(r-2)(r-3)$. Are they positive?"),
        W(r"$y = (c_1 + c_2 x)e^{2x}$", r"That is the repeated-root form. Are the roots equal here?"),
        W(r"$y = c_1\cos 2x + c_2\sin 3x$", r"Trig forms need complex roots. Are these roots real?"),
    ],
)

m9(
    "um_9_18",
    r"Solve $y'' - 4y' + 4y = 0$. What is the general solution?",
    r"The characteristic equation is a perfect square $(r-2)^2$.",
    [
        C(r"$y = (c_1 + c_2 x)\,e^{2x}$", r"Correct. The double root $2$ gives the factor $x$ on the second solution."),
        W(r"$y = c_1 e^{2x} + c_2 e^{-2x}$", r"The root is repeated, not a $\pm$ pair. What form fits a double root?"),
        W(r"$y = c_1 e^{2x} + c_2 e^{4x}$", r"The equation is $(r-2)^2$, not $(r-2)(r-4)$. What single root repeats?"),
        W(r"$y = e^{2x}\cos 2x$", r"The root is real and repeated, not complex. What is the correct form?"),
    ],
)

m9(
    "um_9_19",
    r"Solve $y'' + 4y' + 13y = 0$. What is the general solution?",
    r"The roots are $r = -2 \pm 3i$.",
    [
        C(r"$y = e^{-2x}(c_1\cos 3x + c_2\sin 3x)$", r"Correct. The complex roots give decay $e^{-2x}$ and oscillation at frequency $3$."),
        W(r"$y = e^{2x}(c_1\cos 3x + c_2\sin 3x)$", r"Check the real part of the roots. Is it $+2$ or $-2$?"),
        W(r"$y = e^{-2x}(c_1\cos 2x + c_2\sin 2x)$", r"The frequency is the imaginary part. Is it $2$ or $3$?"),
        W(r"$y = c_1 e^{-2x} + c_2 e^{3x}$", r"Complex roots give oscillation, not two real exponentials. What form results?"),
    ],
)

m9(
    "um_9_20",
    r"Which quantity of the characteristic equation decides whether you get distinct real, repeated, or complex roots?",
    r"The discriminant of the quadratic governs the cases.",
    [
        C(r"The discriminant $b^2 - 4ac$", r"Yes. Positive, zero, or negative discriminant gives distinct real, repeated, or complex roots."),
        W(r"The sign of $c$ alone", r"The constant term alone does not classify the roots. What governs the cases?"),
        W(r"Whether $a = 1$", r"Normalizing does not change the root type. What quantity decides it?"),
        W(r"The value of $y(0)$", r"Initial data does not affect the roots. What part of the quadratic does?"),
    ],
)

m9(
    "um_9_21",
    r"For complex roots $\alpha \pm \beta i$, what does the real part $\alpha$ control in the solution?",
    r"Split the solution into an envelope and an oscillation.",
    [
        C(r"The exponential growth or decay envelope $e^{\alpha x}$", r"Yes. The real part sets the envelope; the imaginary part sets the frequency."),
        W(r"The oscillation frequency", r"Frequency comes from $\beta$. What does $\alpha$ control?"),
        W(r"The period of the sinusoid", r"The period depends on $\beta$. What does $\alpha$ set?"),
        W(r"The number of solutions", r"There are always two. What growth or decay does $\alpha$ govern?"),
    ],
)

m9(
    "um_9_22",
    r"A Cauchy-Euler equation $a x^2 y'' + b x y' + c y = 0$ uses which trial solution?",
    r"Match the powers of $x$ in the coefficients.",
    [
        C(r"$y = x^r$", r"Yes. The power trial $x^r$ matches the $x^k$ coefficients and gives an indicial equation."),
        W(r"$y = e^{rx}$", r"Exponentials suit constant coefficients, not these $x$-powers. What trial fits?"),
        W(r"$y = \ln x$", r"A logarithm appears only in the repeated-root case. What is the basic trial?"),
        W(r"$y = r x + c$", r"A linear trial misses the needed family. What power trial is standard?"),
    ],
)

m9(
    "um_9_23",
    r"Substituting $y = x^r$ into $x^2 y'' - 2x y' - 4y = 0$ gives which indicial equation?",
    r"Use $x^2 y'' = r(r-1)x^r$ and $x y' = r x^r$.",
    [
        C(r"$r^2 - 3r - 4 = 0$", r"Correct. $r(r-1) - 2r - 4 = r^2 - 3r - 4$."),
        W(r"$r^2 - 2r - 4 = 0$", r"Combine $-r$ and $-2r$ from the first two terms. What is their sum?"),
        W(r"$r^2 + 3r - 4 = 0$", r"Check the sign of the linear term after combining. Is it $+3r$ or $-3r$?"),
        W(r"$r^2 - 3r + 4 = 0$", r"The constant from $-4y$ is $-4$. What is the correct constant?"),
    ],
)

m9(
    "um_9_24",
    r"The indicial equation $r^2 - 3r - 4 = 0$ gives which general solution?",
    r"Factor $(r-4)(r+1)$.",
    [
        C(r"$y = c_1 x^4 + c_2 x^{-1}$", r"Correct. Roots $4$ and $-1$ give the power solutions $x^4$ and $x^{-1}$."),
        W(r"$y = c_1 x^4 + c_2 x$", r"The root $-1$ gives $x^{-1}$, not $x$. What is the second power?"),
        W(r"$y = c_1 e^{4x} + c_2 e^{-x}$", r"Cauchy-Euler solutions are powers, not exponentials. What form results?"),
        W(r"$y = c_1 x^{-4} + c_2 x$", r"The factor $(r-4)$ gives $r = 4$, so $x^4$, not $x^{-4}$. What are the powers?"),
    ],
)

m9(
    "um_9_25",
    r"How many independent solutions span the solution space of an $n$-th order linear homogeneous equation?",
    r"The dimension equals the order.",
    [
        C(r"$n$", r"Yes. The solution space has dimension $n$, spanned by $n$ independent solutions."),
        W(r"Two, regardless of $n$", r"Two is the second-order case. How does it scale with $n$?"),
        W(r"$n - 1$", r"The count equals the order, not one less. How many?"),
        W(r"One", r"One cannot span a higher-dimensional space. How many independent solutions?"),
    ],
)

m9(
    "um_9_26",
    r"How many initial conditions does a unique solution of an $n$-th order linear equation require?",
    r"Match conditions to arbitrary constants.",
    [
        C(r"$n$, typically $y, y', \dots, y^{(n-1)}$ at a point", r"Yes. The $n$ constants need $n$ conditions."),
        W(r"Two", r"Two fits second order only. How many for order $n$?"),
        W(r"$n + 1$", r"That is one too many. How many match $n$ constants?"),
        W(r"One", r"One leaves most constants undetermined. How many are needed?"),
    ],
)

m9(
    "um_9_27",
    r"A root of multiplicity $m$ in a constant-coefficient characteristic polynomial contributes which solutions?",
    r"Add one power of $x$ per repetition.",
    [
        C(r"$e^{rx}, x e^{rx}, \dots, x^{m-1} e^{rx}$", r"Yes. Multiplicity $m$ gives $m$ independent solutions with powers up to $x^{m-1}$."),
        W(r"$e^{rx}$ repeated $m$ times", r"Repeating one function gives one independent solution. What factors make them independent?"),
        W(r"$e^{rx}$ and $e^{-rx}$", r"Multiplicity does not flip the sign of the exponent. What powers of $x$ appear?"),
        W(r"$m\,e^{rx}$", r"A constant multiple is still one solution. What independent set does multiplicity $m$ give?"),
    ],
)

m9(
    "um_9_28",
    r"Solve $y''' - y' = 0$. What is the general solution?",
    r"Factor $r^3 - r = r(r-1)(r+1)$.",
    [
        C(r"$y = c_1 + c_2 e^{x} + c_3 e^{-x}$", r"Correct. Roots $0, 1, -1$ give the constant, $e^x$, and $e^{-x}$."),
        W(r"$y = c_1 e^{x} + c_2 e^{-x}$", r"The root $r = 0$ is missing. What solution corresponds to it?"),
        W(r"$y = c_1 + c_2 x + c_3 x^2$", r"Those come from a repeated zero root, not $r(r-1)(r+1)$. What are the roots?"),
        W(r"$y = (c_1 + c_2 x + c_3 x^2)e^{x}$", r"That is for a triple root at $1$. What are the three distinct roots?"),
    ],
)

m9(
    "um_9_29",
    r"In a constant-coefficient equation with real coefficients, complex roots must appear how?",
    r"Real polynomials have complex roots in conjugate pairs.",
    [
        C(r"In conjugate pairs $\alpha \pm \beta i$", r"Yes. Real coefficients force conjugate pairs, giving $e^{\alpha x}\cos\beta x$ and $e^{\alpha x}\sin\beta x$."),
        W(r"Singly, with no partner", r"A lone complex root violates real coefficients. How must they pair?"),
        W(r"Only as purely imaginary numbers", r"The real part need not vanish. In what form do they appear?"),
        W(r"As repeated real roots", r"Complex roots are not real. What conjugate structure do they have?"),
    ],
)

m9(
    "um_9_30",
    r"Does superposition extend to higher-order linear homogeneous equations?",
    r"Linearity does not depend on the order being two.",
    [
        C(r"Yes, any linear combination of solutions is again a solution", r"Yes. Linearity holds at every order, so combinations of homogeneous solutions remain solutions."),
        W(r"No, only for second order", r"Order does not limit linearity. Why does superposition persist?"),
        W(r"Only for even $n$", r"Parity is irrelevant. What property guarantees superposition?"),
        W(r"Only with constant coefficients", r"Variable coefficients still give a linear operator. What underlies superposition?"),
    ],
)

# ============================================================================
# UNIT 10 MASTERY  (30 items, um_10_1 .. um_10_30)
# ============================================================================

m10(
    "um_10_1",
    r"The general solution of a nonhomogeneous linear equation $L[y] = g$ is which sum?",
    r"Combine the homogeneous solution with one particular solution.",
    [
        C(r"$y = y_h + y_p$", r"Yes. The complementary solution $y_h$ solves $L[y]=0$ and $y_p$ handles the forcing."),
        W(r"$y = y_h \cdot y_p$", r"The parts add, they do not multiply. How do they combine?"),
        W(r"$y = y_p$ only", r"The arbitrary constants are missing. What must be added?"),
        W(r"$y = y_h$ only", r"That cannot match the forcing. What extra piece is needed?"),
    ],
)

m10(
    "um_10_2",
    r"For forcing $g(x) = e^{3x}$ with no overlap, the undetermined-coefficients trial is what?",
    r"Match an exponential input with the same exponential type.",
    [
        C(r"$y_p = A e^{3x}$", r"Yes. An exponential forcing suggests a constant times the same exponential."),
        W(r"$y_p = A x e^{3x}$", r"The factor $x$ is needed only on overlap with the homogeneous solution. What is the plain guess?"),
        W(r"$y_p = A\cos 3x$", r"A trig guess matches sinusoids, not exponentials. What fits $e^{3x}$?"),
        W(r"$y_p = A x + B$", r"A polynomial guess matches polynomial forcing. What matches an exponential?"),
    ],
)

m10(
    "um_10_3",
    r"Solve for $A$ in $y'' - y = e^{2x}$ using $y_p = A e^{2x}$.",
    r"Compute $y_p'' = 4A e^{2x}$ and solve $4A - A = 1$.",
    [
        C(r"$A = \frac{1}{3}$", r"Correct. $4A - A = 3A = 1$, so $A = 1/3$."),
        W(r"$A = 1$", r"Substitute: $3A = 1$. What is $A$?"),
        W(r"$A = \frac{1}{4}$", r"Do not forget the $-A$ from $-y$. What is $4A - A$ set to $1$?"),
        W(r"$A = 3$", r"You may have inverted the relation. From $3A = 1$, what is $A$?"),
    ],
)

m10(
    "um_10_4",
    r"For $y'' + y = \cos x$, why does the trial $A\cos x + B\sin x$ fail, and what is the fix?",
    r"This is resonance: the guess already solves the homogeneous equation.",
    [
        C(r"It solves $y'' + y = 0$, so multiply by $x$: $y_p = x(A\cos x + B\sin x)$", r"Yes. The overlap forces a factor of $x$ to produce a valid particular solution."),
        W(r"It fails for no reason; keep $A\cos x + B\sin x$", r"Substituting the homogeneous solution gives zero. What modification is required?"),
        W(r"Replace it with $A e^{x}$", r"An exponential does not match a cosine input. What factor resolves the resonance?"),
        W(r"Divide the guess by $x$", r"Dividing does not remove the overlap. What operation does?"),
    ],
)

m10(
    "um_10_5",
    r"If the forcing is a sum $g_1 + g_2$, how do you build the particular solution?",
    r"Linearity lets you treat each piece separately.",
    [
        C(r"Find a particular solution for each piece and add them", r"Yes. Superposition for the forced equation lets particular solutions add."),
        W(r"Use one guess for both with a single coefficient", r"A single coefficient cannot match independent terms. How does linearity split the work?"),
        W(r"Multiply the two particular solutions", r"They add, not multiply. What is the correct combination?"),
        W(r"Ignore the smaller term", r"Every term contributes. How should the particular solutions combine?"),
    ],
)

m10(
    "um_10_6",
    r"Variation of parameters seeks a particular solution of which form?",
    r"Promote the constants in the complementary solution to functions.",
    [
        C(r"$y_p = u_1(x)\,y_1 + u_2(x)\,y_2$", r"Yes. The constants become functions $u_1, u_2$ to be found."),
        W(r"$y_p = c_1 y_1 + c_2 y_2$", r"Those constants give only the homogeneous solution. What replaces them?"),
        W(r"$y_p = u_1 y_1 \cdot u_2 y_2$", r"The terms add, not multiply. What is the correct form?"),
        W(r"$y_p = u_1 + u_2$", r"The unknowns multiply the fundamental solutions. What form is used?"),
    ],
)

m10(
    "um_10_7",
    r"In variation of parameters, the convenient constraint imposed on $u_1', u_2'$ is what?",
    r"It eliminates second derivatives of the unknown functions.",
    [
        C(r"$u_1' y_1 + u_2' y_2 = 0$", r"Yes. This constraint simplifies $y_p'$ and avoids second derivatives of $u_i$."),
        W(r"$u_1' + u_2' = 0$", r"Each $u_i'$ pairs with its solution $y_i$. What weighted sum vanishes?"),
        W(r"$u_1' y_1' + u_2' y_2' = 0$", r"That combination equals the forcing, not zero. Which one is set to zero?"),
        W(r"$u_1 y_1 + u_2 y_2 = 0$", r"The constraint uses the derivatives $u_i'$. What is the correct condition?"),
    ],
)

m10(
    "um_10_8",
    r"The variation-of-parameters formula gives $u_1'$ as which expression, with Wronskian $W$?",
    r"Cramer's rule on the two-equation system gives the result.",
    [
        C(r"$u_1' = -\frac{y_2\,g}{W}$", r"Yes. Cramer's rule gives $u_1' = -y_2 g / W$."),
        W(r"$u_1' = \frac{y_2\,g}{W}$", r"Check the sign from Cramer's rule. Positive or negative?"),
        W(r"$u_1' = \frac{y_1\,g}{W}$", r"The numerator for $u_1'$ uses $y_2$. Which solution appears, and with what sign?"),
        W(r"$u_1' = -\frac{g}{W}$", r"The solution $y_2$ must appear in the numerator. What is the full expression?"),
    ],
)

m10(
    "um_10_9",
    r"What is the main advantage of variation of parameters over undetermined coefficients?",
    r"Consider which forcings each method handles.",
    [
        C(r"It works for any continuous forcing, including $\tan x$ and $\sec x$", r"Yes. It handles general forcing where the guessing method has no finite trial."),
        W(r"It avoids needing the homogeneous solutions", r"It requires $y_1, y_2$. What broader capability does it offer?"),
        W(r"It never requires integration", r"It integrates $u_1', u_2'$. What is its real advantage?"),
        W(r"It only works for constant coefficients", r"It is more general. For what forcings does it succeed?"),
    ],
)

m10(
    "um_10_10",
    r"Before using the variation-of-parameters formula, why must the equation be in standard form with leading coefficient one?",
    r"The $g$ in the formula is the right-hand side after normalizing $y''$.",
    [
        C(r"So that $g$ in the formula is correctly scaled", r"Yes. Skipping normalization scales $g$ wrongly and gives an incorrect answer."),
        W(r"So the Wronskian is defined", r"The Wronskian comes from $y_1, y_2$ regardless. What quantity needs normalizing?"),
        W(r"So $y_1, y_2$ stay the same", r"The homogeneous solutions are unaffected by normalization. What does it fix?"),
        W(r"It is not necessary", r"It is necessary. What goes wrong if the leading coefficient is not one?"),
    ],
)

m10(
    "um_10_11",
    r"In operator notation, which operator annihilates $e^{3x}$?",
    r"The operator's root should be $3$.",
    [
        C(r"$(D - 3)$", r"Yes. $(D-3)e^{3x} = 0$."),
        W(r"$(D + 3)$", r"Apply it: $(D+3)e^{3x} \neq 0$. What sign makes it vanish?"),
        W(r"$D^2$", r"$D^2 e^{3x} = 9e^{3x} \neq 0$. Which operator kills $e^{3x}$?"),
        W(r"$(D - 9)$", r"The exponent is $3$, not $9$. What operator works?"),
    ],
)

m10(
    "um_10_12",
    r"Which operator annihilates $\cos 2x$ and $\sin 2x$?",
    r"The roots needed are $\pm 2i$.",
    [
        C(r"$(D^2 + 4)$", r"Yes. The roots $\pm 2i$ annihilate the frequency-$2$ sinusoids."),
        W(r"$(D^2 - 4)$", r"That has real roots $\pm 2$, suiting $e^{\pm 2x}$. What sign gives $\pm 2i$?"),
        W(r"$(D - 2)$", r"A single real root does not annihilate an oscillation. What second-order operator works?"),
        W(r"$(D^2 + 2)$", r"That gives frequency $\sqrt{2}$. What constant gives frequency $2$?"),
    ],
)

m10(
    "um_10_13",
    r"For $p(D)\,y = e^{a t}$ with $p(a) \neq 0$, the exponential response formula gives $y_p$ equal to what?",
    r"Use $p(D)e^{at} = p(a)e^{at}$.",
    [
        C(r"$y_p = \frac{e^{a t}}{p(a)}$", r"Yes. Dividing by $p(a)$ inverts the operator on the exponential."),
        W(r"$y_p = p(a)\,e^{a t}$", r"You multiplied instead of divided. What isolates $y_p$?"),
        W(r"$y_p = \frac{e^{a t}}{p'(a)}$", r"The derivative enters only when $p(a) = 0$. What denominator applies here?"),
        W(r"$y_p = e^{a t}$", r"The factor $1/p(a)$ is missing. How do you invert $p(D)$?"),
    ],
)

m10(
    "um_10_14",
    r"Solve $y'' + 3y' + 2y = e^{t}$ using the exponential response formula.",
    r"Evaluate $p(r) = r^2 + 3r + 2$ at $r = 1$.",
    [
        C(r"$y_p = \frac{e^{t}}{6}$", r"Correct. $p(1) = 1 + 3 + 2 = 6$, so $y_p = e^t / 6$."),
        W(r"$y_p = \frac{e^{t}}{2}$", r"Use the full polynomial at $r = 1$, not just the constant. What is $p(1)$?"),
        W(r"$y_p = 6 e^{t}$", r"The formula divides by $p(1)$. What is $e^t / 6$?"),
        W(r"$y_p = \frac{e^{t}}{5}$", r"Recompute $1 + 3 + 2$. What is $p(1)$?"),
    ],
)

m10(
    "um_10_15",
    r"When $p(a) = 0$ in $p(D)y = e^{at}$, what does this represent?",
    r"A zero of $p$ at $a$ means $e^{at}$ solves the homogeneous equation.",
    [
        C(r"Resonance, since $e^{a t}$ is a homogeneous solution", r"Yes. The input matches a natural mode, so the simple formula fails and a factor of $t$ enters."),
        W(r"That the input is zero", r"The input is not zero. What does $p(a) = 0$ say about $e^{at}$?"),
        W(r"That no solution exists", r"A modified solution exists. What phenomenon does $p(a) = 0$ signal?"),
        W(r"That the equation is nonlinear", r"It stays linear. What occurs when $a$ is a characteristic root?"),
    ],
)

m10(
    "um_10_16",
    r"The steady response of a linear system to a sinusoidal input has the same frequency but generally differs in which features?",
    r"A linear system reshapes a sinusoid only in size and timing.",
    [
        C(r"Amplitude and phase", r"Yes. A linear system scales the amplitude and shifts the phase while preserving the frequency."),
        W(r"Frequency and amplitude", r"Frequency is preserved. Which two features change?"),
        W(r"Frequency and phase", r"The frequency carries through. What besides phase changes?"),
        W(r"Shape and frequency", r"The response stays sinusoidal at the same frequency. What two quantities change?"),
    ],
)

m10(
    "um_10_17",
    r"For $p(D)y = e^{i\omega t}$, the complex gain $\frac{1}{p(i\omega)}$ encodes which information?",
    r"A complex number carries a magnitude and an angle.",
    [
        C(r"Both the amplitude (its magnitude) and phase (its argument) of the response", r"Yes. The magnitude gives amplitude and the argument gives phase, in one complex number."),
        W(r"Only the amplitude", r"It carries phase too, in its argument. What else does it encode?"),
        W(r"Only the frequency", r"The frequency is the input $\omega$; the gain encodes the response. What two features?"),
        W(r"The transient decay rate", r"That comes from the homogeneous roots, not the gain. What does the gain encode?"),
    ],
)

m10(
    "um_10_18",
    r"Why is replacing $\cos\omega t$ with $\operatorname{Re}(e^{i\omega t})$ valid for a real linear equation?",
    r"A real-coefficient operator commutes with taking the real part.",
    [
        C(r"The operator has real coefficients, so the real part of the complex solution solves the real problem", r"Yes. Taking the real part commutes with a real-coefficient linear operator."),
        W(r"Because $e^{i\omega t} = \cos\omega t$", r"Euler's formula adds an imaginary sine term too. What property justifies extracting the real part?"),
        W(r"Because $\omega$ is imaginary", r"The frequency is real. What feature of the coefficients matters?"),
        W(r"Because complex numbers are real", r"They are not in general. What lets you take the real part at the end?"),
    ],
)

m10(
    "um_10_19",
    r"For a linear system, the response to $f_1 + f_2$ (given responses $y_1, y_2$) is what?",
    r"Linearity lets responses add as inputs do.",
    [
        C(r"$y_1 + y_2$", r"Yes. Superposition for the forced response means responses add when inputs add."),
        W(r"$y_1 \cdot y_2$", r"Responses add, not multiply. What is the response?"),
        W(r"$\frac{y_1 + y_2}{2}$", r"No averaging occurs. What does linearity give?"),
        W(r"It must be solved from scratch", r"Linearity avoids that. What simple combination works?"),
    ],
)

m10(
    "um_10_20",
    r"Decomposing a general input into a continuum of impulses and summing the responses leads to which construction?",
    r"A continuous sum of shifted impulse responses is an integral.",
    [
        C(r"A convolution integral with the impulse response", r"Yes. Summing impulse responses over a continuum gives a convolution."),
        W(r"A characteristic polynomial", r"That is algebraic, from the homogeneous equation. What integral results?"),
        W(r"A Wronskian", r"The Wronskian is unrelated. What construction results?"),
        W(r"A separable equation", r"Separation is not involved. What integral form appears?"),
    ],
)

m10(
    "um_10_21",
    r"In a stable forced system, which part of the solution is the transient?",
    r"The transient is the part that fades as time grows.",
    [
        C(r"The complementary (homogeneous) solution", r"Yes. The homogeneous solution decays away in a stable system."),
        W(r"The particular solution", r"That persists as the steady state. Which part decays?"),
        W(r"The forcing function", r"The forcing drives the response; it is not the transient. Which part fades?"),
        W(r"The initial condition", r"That is data, not a solution component. Which part is transient?"),
    ],
)

m10(
    "um_10_22",
    r"Why is the homogeneous solution called transient in a stable system?",
    r"Stable means the roots have negative real parts.",
    [
        C(r"Its terms decay to zero as $t \to \infty$", r"Yes. Negative real parts make the exponential terms vanish over time."),
        W(r"It grows without bound", r"In a stable system it decays. What happens as $t \to \infty$?"),
        W(r"It equals the forcing", r"It does not match the forcing. Why does it disappear?"),
        W(r"It is constant", r"It generally decays. What feature of the roots causes that?"),
    ],
)

m10(
    "um_10_23",
    r"For $y'' + 5y' + 6y = g(t)$, the transient is built from which roots?",
    r"Solve $r^2 + 5r + 6 = (r+2)(r+3) = 0$.",
    [
        C(r"$r = -2, -3$, giving $c_1 e^{-2t} + c_2 e^{-3t}$", r"Correct. Both roots are negative, so the transient decays."),
        W(r"$r = 2, 3$, giving growth", r"Check the signs of the roots of $(r+2)(r+3)$. Positive or negative?"),
        W(r"$r = \pm i$, giving oscillation", r"The discriminant is positive, giving real roots. What are they?"),
        W(r"$r = -5, -6$", r"Those are not roots of $r^2 + 5r + 6$. What does $(r+2)(r+3)=0$ give?"),
    ],
)

m10(
    "um_10_24",
    r"In a stable forced system, why does the long-term response become independent of the initial conditions?",
    r"The initial-condition dependence lives in the transient.",
    [
        C(r"The transient carrying the initial-condition dependence has decayed away", r"Yes. Once the transient vanishes, only the forcing-driven steady state remains."),
        W(r"Because the forcing also decays", r"The forcing persists; the transient decays. Why does the dependence vanish?"),
        W(r"Because the steady state depends on initial data", r"It depends on the forcing, not the initial data. What decays?"),
        W(r"Because the system becomes nonlinear", r"It stays linear. What component fades?"),
    ],
)

m10(
    "um_10_25",
    r"The impulse response of a system is its response to which input?",
    r"It is the output for a unit impulse from rest.",
    [
        C(r"The Dirac delta $\delta(t)$", r"Yes. The impulse response is the output produced by a unit impulse from rest."),
        W(r"The unit step $u(t)$", r"That gives the step response. What input defines the impulse response?"),
        W(r"A constant input", r"A constant is not an impulse. What sharp input is used?"),
        W(r"A sinusoid", r"A sinusoid gives the frequency response. What input defines the impulse response?"),
    ],
)

m10(
    "um_10_26",
    r"How are the unit step and Dirac delta related?",
    r"Recall the calculus link between switching on and its rate of change.",
    [
        C(r"$\delta(t)$ is the derivative of $u(t)$", r"Yes. The delta is the derivative of the step, and the step is the integral of the delta."),
        W(r"$\delta(t)$ is the integral of $u(t)$", r"Integrating the step gives a ramp. What derivative relation holds?"),
        W(r"They are identical", r"They are different objects. How is the delta obtained from the step?"),
        W(r"$\delta(t) = u(t)^2$", r"Squaring is not the relationship. What operation links them?"),
    ],
)

m10(
    "um_10_27",
    r"The sifting property states that $\int_{-\infty}^{\infty} f(t)\,\delta(t - a)\,dt$ equals what?",
    r"The delta samples $f$ at the spike location.",
    [
        C(r"$f(a)$", r"Yes. The delta picks out the value of $f$ at $t = a$."),
        W(r"$f(0)$", r"The spike is at $t = a$, not $0$. What value is picked out?"),
        W(r"$\int f(t)\,dt$", r"The delta extracts a single value, not the whole integral. What is it?"),
        W(r"$a$", r"The result is the function value, not the location. What is $f(a)$?"),
    ],
)

m10(
    "um_10_28",
    r"Duhamel's principle expresses the response to input $f$ as which integral involving the impulse response $w$?",
    r"It superposes scaled, shifted impulse responses.",
    [
        C(r"$\int_0^t w(t - \tau)\,f(\tau)\,d\tau$", r"Yes. The forced response is the convolution of $f$ with the impulse response."),
        W(r"$w(t)\,f(t)$", r"It is a convolution, not a pointwise product. What integral is it?"),
        W(r"$\frac{d}{dt}(w f)$", r"Differentiation is not the construction. What integral superposes impulse responses?"),
        W(r"$w(t) + f(t)$", r"The pieces are convolved, not added. What integral is correct?"),
    ],
)

m10(
    "um_10_29",
    r"Which two structural properties make Duhamel's principle valid?",
    r"Superposition and a shift-invariant impulse response are both needed.",
    [
        C(r"Linearity and time invariance", r"Yes. Linearity lets responses add; time invariance makes the shifted impulse response depend only on $t - \tau$."),
        W(r"Nonlinearity and periodicity", r"Nonlinearity breaks superposition. What two properties are needed?"),
        W(r"Exactness and separability", r"Those are first-order concepts. What properties does Duhamel require?"),
        W(r"Constant forcing and zero damping", r"Neither is required. What structural properties matter?"),
    ],
)

m10(
    "um_10_30",
    r"The lower and upper limits $0$ and $t$ in the Duhamel convolution encode which principle?",
    r"Only inputs that have already occurred can affect the present.",
    [
        C(r"Causality, since only inputs up to time $t$ contribute", r"Yes. The response at time $t$ depends only on inputs from $0$ up to $t$."),
        W(r"Periodicity", r"The limits concern cause and effect, not repetition. What principle do they encode?"),
        W(r"Conservation of energy", r"That is a different idea. What does integrating only up to $t$ express?"),
        W(r"Resonance", r"Resonance is about frequency matching. What principle do the limits reflect?"),
    ],
)

# <<<CONTENT_INSERTION_POINT>>>


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
    unit_new = (emit_unit_block(UNIT9_TITLE, MASTERY_9) + ",\n\n"
                + emit_unit_block(UNIT10_TITLE, MASTERY_10))
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
    data["unit_mastery"][UNIT9_TITLE] = [strip_item(it) for it in MASTERY_9]
    data["unit_mastery"][UNIT10_TITLE] = [strip_item(it) for it in MASTERY_10]

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
    for it in MASTERY_9 + MASTERY_10:
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
    assert len(MICRO) == 31, "expected 31 micro videos, got %d" % len(MICRO)
    assert len(MASTERY_9) == 30, "Unit 9 mastery not 30 items, got %d" % len(MASTERY_9)
    assert len(MASTERY_10) == 30, "Unit 10 mastery not 30 items, got %d" % len(MASTERY_10)
    one_correct(MASTERY_9, "mastery9")
    one_correct(MASTERY_10, "mastery10")
    for it in MASTERY_9 + MASTERY_10:
        assert it["id"] not in seen_ids, "duplicate id %s" % it["id"]
        seen_ids.add(it["id"])

    if bad:
        for where, s in bad:
            print("[!] FORBIDDEN CHAR in", where, "->", s)
        raise SystemExit("Validation failed: forbidden characters present")
    print("[+] validation passed: %d micro videos, %d + %d mastery items, copy rules OK"
          % (len(MICRO), len(MASTERY_9), len(MASTERY_10)))


if __name__ == "__main__":
    validate()
    update_js()
    update_json()
    print("[+] Unit 9 and Unit 10 quiz generation complete")
