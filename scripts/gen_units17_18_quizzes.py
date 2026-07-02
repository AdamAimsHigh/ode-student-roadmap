#!/usr/bin/env python3
"""
Generate Unit 17 (Boundary Value Problems and Sturm-Liouville Theory) and
Unit 18 (Fourier Series and Partial Differential Equations) interactive quizzes
in a single batch. This is the final content batch (the curriculum runs Unit 0
through Unit 18).

Authors the 24 video micro-practice quizzes (five items each) and the two 30
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
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS_PATH = os.path.join(ROOT, "app", "js", "quiz-data.js")
JSON_PATH = os.path.join(ROOT, "app", "data", "quizzes.json")

UNIT17_TITLE = "Unit 17: Boundary Value Problems and Sturm-Liouville Theory"
UNIT18_TITLE = "Unit 18: Fourier Series and Partial Differential Equations"


def C(text, rationale):
    return {"text": text, "correct": True, "rationale": rationale}


def W(text, rationale):
    return {"text": text, "rationale": rationale}


def item(qid, prompt, hint, options):
    return {"id": qid, "prompt": prompt, "hint": hint, "answerOptions": options}


MICRO = []  # list of (video_id, comment_line, [items])


def add_micro(video_id, comment, items):
    MICRO.append((video_id, comment, items))


MASTERY_17 = []
MASTERY_18 = []


def m17(qid, prompt, hint, options):
    MASTERY_17.append(item(qid, prompt, hint, options))


def m18(qid, prompt, hint, options):
    MASTERY_18.append(item(qid, prompt, hint, options))


# ============================================================================
# CONTENT
# ============================================================================

# ============================================================================
# UNIT 17 MICRO PRACTICE
# ============================================================================

# === 17.1 video 1 ===========================================================
add_micro(
    "Izmkk1Ry3Wc",
    'Unit 17, Module 17.1, video 1\n           "Initial Value Problem vs Boundary Value Problem"',
    [
        item(
            "mp_Izmkk1Ry3Wc_1",
            r"What is the defining difference between an initial value problem and a boundary value problem?",
            r"Think about where along the interval the side conditions are imposed.",
            [
                C(r"An IVP gives all conditions at one point; a BVP gives conditions at two different points", r"Yes. An initial value problem fixes the state at a single point, while a boundary value problem imposes conditions at two endpoints."),
                W(r"An IVP is linear and a BVP is nonlinear", r"Linearity is unrelated to this distinction; both kinds can be linear. Where are the conditions specified in each?"),
                W(r"An IVP has no solution but a BVP always does", r"Existence is not the dividing line, and BVPs need not have solutions. What about the location of the conditions?"),
                W(r"An IVP is first order and a BVP is second order", r"Order does not separate them; both can be second order. What distinguishes where conditions are placed?"),
            ],
        ),
        item(
            "mp_Izmkk1Ry3Wc_2",
            r"Which side conditions on $y'' + y = 0$ make it a boundary value problem?",
            r"Look for conditions imposed at two distinct values of the variable.",
            [
                C(r"$y(0) = 1$ and $y(\pi) = 2$", r"Yes. Conditions at the two separate points $0$ and $\pi$ make this a boundary value problem."),
                W(r"$y(0) = 1$ and $y'(0) = 2$", r"Both of these are imposed at the single point $0$. Does that match an IVP or a BVP?"),
                W(r"$y(0) = 1$ only", r"One condition underdetermines a second-order equation, and it sits at one point. What setup uses two endpoints?"),
                W(r"$y'(0) = 1$ and $y''(0) = 2$", r"These are both at $0$ and use derivatives at one point. Which option places conditions at two points?"),
            ],
        ),
        item(
            "mp_Izmkk1Ry3Wc_3",
            r"How many side conditions does a second-order linear equation require to single out a particular solution?",
            r"The number of conditions matches the order of the equation.",
            [
                C(r"Two", r"Yes. A second-order equation has two arbitrary constants, so two conditions are needed."),
                W(r"One", r"One condition leaves an arbitrary constant unfixed. How many constants does the general solution carry?"),
                W(r"Three", r"That exceeds the number of arbitrary constants. How many constants does a second-order general solution have?"),
                W(r"Zero", r"Without conditions the solution stays general. How many constants must be pinned down?"),
            ],
        ),
        item(
            "mp_Izmkk1Ry3Wc_4",
            r"Compared with initial value problems, what is true of existence and uniqueness for boundary value problems?",
            r"Recall the IVP guarantee, then ask whether the two-endpoint setup keeps it.",
            [
                C(r"A BVP may have no solution, one solution, or infinitely many", r"Yes. Unlike the IVP guarantee, a boundary value problem can fail to have a solution or can have many."),
                W(r"A BVP always has exactly one solution", r"The clean IVP uniqueness does not carry over. What range of outcomes is possible at two endpoints?"),
                W(r"A BVP never has a solution", r"Many boundary value problems do have solutions. What set of outcomes is actually possible?"),
                W(r"A BVP has the same guarantee as an IVP", r"The two-endpoint structure breaks the IVP guarantee. What outcomes become possible?"),
            ],
        ),
        item(
            "mp_Izmkk1Ry3Wc_5",
            r"The problem $y'' + y = 0$ with $y(0) = 0$ and $y'(0) = 1$ is which type?",
            r"Check whether both conditions sit at the same point.",
            [
                C(r"An initial value problem", r"Yes. Both conditions are given at the single point $0$, so it is an initial value problem."),
                W(r"A boundary value problem", r"A BVP needs conditions at two different points. Are these at one point or two?"),
                W(r"Neither, since it has two conditions", r"Two conditions are exactly right for second order. Where are they placed here?"),
                W(r"A partial differential equation", r"There is one independent variable, so it is an ODE. Where are its conditions located?"),
            ],
        ),
    ],
)

# === 17.1 video 2 ===========================================================
add_micro(
    "E97SZm2ZrBo",
    'Unit 17, Module 17.1, video 2\n           "Boundary Conditions Replace Initial Conditions"',
    [
        item(
            "mp_E97SZm2ZrBo_1",
            r"On an interval $[a, b]$, a typical pair of boundary conditions specifies what?",
            r"Boundary conditions live at the ends of the spatial interval.",
            [
                C(r"Values (or derivative values) of $y$ at $x = a$ and at $x = b$", r"Yes. Boundary conditions constrain the solution at the two endpoints of the interval."),
                W(r"The value and first derivative of $y$ at $x = a$ only", r"That is the initial-value pattern at one end. Where does the other condition belong for a BVP?"),
                W(r"The values of $y$ at infinitely many interior points", r"Two conditions suffice for second order, placed at the ends. Which points carry them?"),
                W(r"The coefficients of the differential equation", r"Coefficients define the equation, not the side conditions. What do boundary conditions constrain?"),
            ],
        ),
        item(
            "mp_E97SZm2ZrBo_2",
            r"A Dirichlet boundary condition specifies which quantity at an endpoint?",
            r"Dirichlet fixes the function value itself.",
            [
                C(r"The value of $y$", r"Yes. A Dirichlet condition prescribes the value of the unknown function at the endpoint."),
                W(r"The value of $y'$", r"Prescribing the derivative is a different (Neumann) condition. What does Dirichlet fix directly?"),
                W(r"The value of $y''$", r"Second derivatives are not what boundary conditions usually set. Which quantity does Dirichlet name?"),
                W(r"The integral of $y$ over the interval", r"An integral constraint is a different kind of condition. What pointwise value does Dirichlet give?"),
            ],
        ),
        item(
            "mp_E97SZm2ZrBo_3",
            r"A Neumann boundary condition specifies which quantity at an endpoint?",
            r"Neumann constrains the slope of the solution.",
            [
                C(r"The value of the derivative $y'$", r"Yes. A Neumann condition prescribes the derivative of the function at the endpoint."),
                W(r"The value of $y$", r"Fixing the value itself is the Dirichlet condition. What does Neumann fix instead?"),
                W(r"The product $y \, y'$", r"No nonlinear product is involved. Which single derivative does Neumann set?"),
                W(r"The second derivative $y''$", r"Boundary conditions normally use $y$ or $y'$. Which one does Neumann name?"),
            ],
        ),
        item(
            "mp_E97SZm2ZrBo_4",
            r"A steady temperature distribution in a rod with both ends held at fixed temperatures is modeled by which kind of problem?",
            r"Conditions are imposed at the two ends of the rod.",
            [
                C(r"A boundary value problem", r"Yes. Fixing the temperature at each end of the rod imposes conditions at two points, a boundary value problem."),
                W(r"An initial value problem", r"The conditions are at the two ends in space, not at a single starting instant. What type is that?"),
                W(r"A problem with no conditions", r"Two fixed end temperatures are two conditions. Where in the domain do they sit?"),
                W(r"A purely algebraic equation", r"The model is a differential equation in position. What kind of side conditions does it carry?"),
            ],
        ),
        item(
            "mp_E97SZm2ZrBo_5",
            r"In many boundary value problems the independent variable represents what?",
            r"Boundary conditions are tied to the ends of a physical region.",
            [
                C(r"A spatial position", r"Yes. Boundary value problems typically involve a spatial variable with conditions at the edges of the region."),
                W(r"Always time", r"Time-based conditions at one instant give initial value problems. What variable do endpoints usually represent?"),
                W(r"A probability", r"The variable is a physical coordinate, not a probability. What does it usually measure?"),
                W(r"A dimensionless constant", r"The variable ranges over an interval with two ends. What does that interval usually represent?"),
            ],
        ),
    ],
)

# === 17.2 video 1 ===========================================================
add_micro(
    "AnyGw-gOY0U",
    'Unit 17, Module 17.2, video 1\n           "Intro to Boundary Value Problems"',
    [
        item(
            "mp_AnyGw-gOY0U_1",
            r"Solve $y'' = 0$ with $y(0) = 0$ and $y(1) = 2$.",
            r"The general solution of $y'' = 0$ is a straight line; fit the two endpoints.",
            [
                C(r"$y = 2x$", r"Correct. The general solution is $y = c_1 + c_2 x$; $y(0) = 0$ gives $c_1 = 0$ and $y(1) = 2$ gives $c_2 = 2$."),
                W(r"$y = 2$", r"A constant cannot satisfy both $y(0) = 0$ and $y(1) = 2$. What linear function fits both ends?"),
                W(r"$y = x^2$", r"The general solution of $y'' = 0$ is linear, not quadratic. What line passes through $(0,0)$ and $(1,2)$?"),
                W(r"$y = x$", r"This gives $y(1) = 1$, not $2$. What slope makes $y(1) = 2$ with $y(0) = 0$?"),
            ],
        ),
        item(
            "mp_AnyGw-gOY0U_2",
            r"What is the standard procedure for solving a linear two-point boundary value problem?",
            r"Find every solution first, then use the endpoints.",
            [
                C(r"Find the general solution, then apply both boundary conditions to fix the constants", r"Yes. You build the general solution and then impose the two endpoint conditions to determine the constants."),
                W(r"Apply the boundary conditions before solving the equation", r"You need the general solution in hand before the constants can be fixed. What comes first?"),
                W(r"Differentiate the boundary conditions", r"The conditions are used as given, not differentiated. What do you do with the general solution?"),
                W(r"Guess the answer and check only one endpoint", r"Both endpoints must be satisfied. What systematic procedure uses the general solution?"),
            ],
        ),
        item(
            "mp_AnyGw-gOY0U_3",
            r"Solve $y'' + y = 0$ with $y(0) = 0$ and $y(\pi/2) = 1$.",
            r"The general solution is $y = A\cos x + B\sin x$; apply each condition.",
            [
                C(r"$y = \sin x$", r"Correct. $y(0) = 0$ forces $A = 0$, and $y(\pi/2) = B = 1$, so $y = \sin x$."),
                W(r"$y = \cos x$", r"Then $y(0) = 1$, violating $y(0) = 0$. Which trig function vanishes at $0$?"),
                W(r"$y = \sin x + \cos x$", r"The cosine term makes $y(0) = 1 \neq 0$. Which term must drop out?"),
                W(r"$y = \cos x - \sin x$", r"The cosine piece breaks $y(0) = 0$. What remains after $A = 0$?"),
            ],
        ),
        item(
            "mp_AnyGw-gOY0U_4",
            r"A homogeneous boundary value problem such as $y'' + \lambda y = 0$, $y(0) = y(L) = 0$ always admits which solution?",
            r"Ask what happens if the function is identically zero.",
            [
                C(r"The trivial solution $y \equiv 0$", r"Yes. The zero function satisfies the equation and both homogeneous boundary conditions for every $\lambda$."),
                W(r"A unique nonzero solution for every $\lambda$", r"Nonzero solutions appear only for special $\lambda$. What solution works for all $\lambda$?"),
                W(r"No solution at all", r"At least one solution always exists here. Which simple function always fits?"),
                W(r"A constant nonzero solution", r"A nonzero constant cannot meet $y(0) = y(L) = 0$. What function does?"),
            ],
        ),
        item(
            "mp_AnyGw-gOY0U_5",
            r"For the homogeneous problem $y'' + \lambda y = 0$, $y(0) = y(L) = 0$, nontrivial solutions exist only when what holds?",
            r"Only special separation values let a nonzero solution meet both ends.",
            [
                C(r"$\lambda$ takes one of certain special (eigenvalue) values", r"Yes. Nonzero solutions occur only at the discrete eigenvalues of the problem."),
                W(r"$\lambda$ is any real number", r"Most values give only the trivial solution. What kind of values allow nonzero solutions?"),
                W(r"$\lambda$ is negative", r"Negative $\lambda$ yields only the trivial solution for these conditions. What special values work?"),
                W(r"$\lambda$ equals zero", r"At $\lambda = 0$ the only solution is trivial here. Which discrete values permit nonzero solutions?"),
            ],
        ),
    ],
)

# === 17.2 video 2 ===========================================================
add_micro(
    "8y0IcYqPIgA",
    'Unit 17, Module 17.2, video 2\n           "Two-Point Boundary Value Problems"',
    [
        item(
            "mp_8y0IcYqPIgA_1",
            r"How many boundary conditions does a second-order two-point boundary value problem carry?",
            r"The count matches the order of the differential equation.",
            [
                C(r"Two, one at each endpoint", r"Yes. A second-order equation needs two conditions, here placed one at each end."),
                W(r"One, at the left endpoint", r"One condition underdetermines second order. How many endpoints carry a condition?"),
                W(r"Three, two at one end and one at the other", r"That exceeds the number of constants to fix. How many conditions does second order need?"),
                W(r"Four, two at each endpoint", r"Only two constants exist to determine. How many conditions are required?"),
            ],
        ),
        item(
            "mp_8y0IcYqPIgA_2",
            r"Solve $y'' = 6x$ with $y(0) = 0$ and $y(1) = 1$.",
            r"Integrate twice to get $y = x^3 + c_1 x + c_2$, then apply the endpoints.",
            [
                C(r"$y = x^3$", r"Correct. Integrating gives $y = x^3 + c_1 x + c_2$; $y(0) = 0$ gives $c_2 = 0$ and $y(1) = 1 + c_1 = 1$ gives $c_1 = 0$."),
                W(r"$y = x^3 + x$", r"Then $y(1) = 2$, not $1$. What value of $c_1$ makes $y(1) = 1$?"),
                W(r"$y = 3x^2$", r"That is $y'$, not the solution of $y'' = 6x$. What do you get after integrating twice?"),
                W(r"$y = x^3 + 1$", r"This violates $y(0) = 0$. What constant term satisfies the left endpoint?"),
            ],
        ),
        item(
            "mp_8y0IcYqPIgA_3",
            r"The problem $y'' + y = 0$ with $y(0) = 0$ and $y(\pi) = 0$ has how many solutions?",
            r"Apply $y(0) = 0$ to $y = A\cos x + B\sin x$, then test the second condition.",
            [
                C(r"Infinitely many, $y = B\sin x$ for any $B$", r"Yes. $y(0) = 0$ gives $A = 0$, and $y(\pi) = B\sin\pi = 0$ holds for every $B$, so all $B\sin x$ work."),
                W(r"Exactly one, $y \equiv 0$", r"The second condition is satisfied automatically by $\sin x$. What family of nonzero solutions survives?"),
                W(r"None", r"At least $y \equiv 0$ works, and in fact more do. What does $y(\pi) = B\sin\pi = 0$ allow?"),
                W(r"Exactly two", r"The free constant $B$ is unrestricted here. How many values can $B$ take?"),
            ],
        ),
        item(
            "mp_8y0IcYqPIgA_4",
            r"When a homogeneous two-point problem yields only $y \equiv 0$, the boundary value problem is called what?",
            r"Compare with the eigenvalue case where nonzero solutions appear.",
            [
                C(r"It has only the trivial solution (the value is not an eigenvalue)", r"Yes. If the parameter is not an eigenvalue, the trivial solution is the only one."),
                W(r"It has infinitely many solutions", r"Infinitely many appear only at eigenvalues. What is true when only zero solves it?"),
                W(r"It is an initial value problem", r"It is still a boundary value problem. What does getting only $y \equiv 0$ tell you about the parameter?"),
                W(r"It is unsolvable", r"The zero function is a valid solution. What name fits when it is the only one?"),
            ],
        ),
        item(
            "mp_8y0IcYqPIgA_5",
            r"For $y'' + \lambda y = 0$ with $y(0) = 0$ and $y(L) = 0$, the parameter values giving nonzero solutions are which?",
            r"The sine must vanish at $x = L$, forcing $\sqrt{\lambda}\,L$ to be a multiple of $\pi$.",
            [
                C(r"$\lambda_n = \left(\frac{n\pi}{L}\right)^2$ for $n = 1, 2, 3, \dots$", r"Correct. With $A = 0$, requiring $\sin(\sqrt{\lambda}\,L) = 0$ gives $\sqrt{\lambda}\,L = n\pi$, so $\lambda_n = (n\pi/L)^2$."),
                W(r"$\lambda_n = \frac{n\pi}{L}$", r"The condition $\sin(\sqrt{\lambda}\,L) = 0$ involves the square root of $\lambda$. What must you square to solve for $\lambda$?"),
                W(r"$\lambda_n = n\pi L$", r"Solve $\sqrt{\lambda}\,L = n\pi$ for $\lambda$, dividing by $L$ first. What expression results?"),
                W(r"$\lambda_n = n^2$ for any $L$", r"That only holds when $L = \pi$. How does the length $L$ enter the formula?"),
            ],
        ),
    ],
)

# === 17.3 video 1 ===========================================================
add_micro(
    "vGwyyXWGR3Y",
    'Unit 17, Module 17.3, video 1\n           "Introduction to Finding Eigenvalues and Eigenfunctions of Boundary Value Problems"',
    [
        item(
            "mp_vGwyyXWGR3Y_1",
            r"For $y'' + \lambda y = 0$ with $y(0) = 0$ and $y(L) = 0$, what are the eigenvalues?",
            r"Nontrivial sines must vanish at both ends.",
            [
                C(r"$\lambda_n = \left(\frac{n\pi}{L}\right)^2$, $n = 1, 2, 3, \dots$", r"Correct. The condition $\sin(\sqrt{\lambda}\,L) = 0$ gives $\sqrt{\lambda}\,L = n\pi$, hence $\lambda_n = (n\pi/L)^2$."),
                W(r"$\lambda_n = n\pi/L$", r"You must square the relation $\sqrt{\lambda}\,L = n\pi$. What is $\lambda$ itself?"),
                W(r"$\lambda_n = -\left(\frac{n\pi}{L}\right)^2$", r"Negative values give only the trivial solution here. What sign of $\lambda$ produces oscillating sines?"),
                W(r"$\lambda_n = (n\pi)^2$", r"The interval length $L$ must appear. How does $L$ enter the eigenvalue?"),
            ],
        ),
        item(
            "mp_vGwyyXWGR3Y_2",
            r"The eigenfunctions of $y'' + \lambda y = 0$, $y(0) = y(L) = 0$ are which functions?",
            r"They must vanish at both endpoints.",
            [
                C(r"$y_n(x) = \sin\!\left(\frac{n\pi x}{L}\right)$", r"Correct. These sines vanish at $x = 0$ and $x = L$, matching the boundary conditions."),
                W(r"$y_n(x) = \cos\!\left(\frac{n\pi x}{L}\right)$", r"Cosine does not vanish at $x = 0$. Which function is zero at both ends?"),
                W(r"$y_n(x) = e^{n x}$", r"Exponentials do not satisfy these zero boundary conditions. What oscillatory function does?"),
                W(r"$y_n(x) = x^n$", r"Powers of $x$ do not vanish at $x = L$ in general. What sine fits both endpoints?"),
            ],
        ),
        item(
            "mp_vGwyyXWGR3Y_3",
            r"For the interval length $L = \pi$, the eigenvalues of $y'' + \lambda y = 0$, $y(0) = y(\pi) = 0$ are which numbers?",
            r"Set $L = \pi$ in $\lambda_n = (n\pi/L)^2$.",
            [
                C(r"$\lambda_n = n^2$, $n = 1, 2, 3, \dots$", r"Correct. With $L = \pi$, $(n\pi/\pi)^2 = n^2$."),
                W(r"$\lambda_n = n$", r"The formula squares the index. What is $(n\pi/\pi)^2$?"),
                W(r"$\lambda_n = \pi^2 n^2$", r"The factors of $\pi$ cancel when $L = \pi$. What is left after cancelling?"),
                W(r"$\lambda_n = 2n$", r"There is no factor of $2$ here. What does $n^2$ give for the eigenvalues?"),
            ],
        ),
        item(
            "mp_vGwyyXWGR3Y_4",
            r"For $y'' + \lambda y = 0$, $y(0) = y(L) = 0$, what do $\lambda = 0$ and $\lambda < 0$ produce?",
            r"Check whether linear or exponential solutions can vanish at both ends.",
            [
                C(r"Only the trivial solution $y \equiv 0$", r"Yes. For $\lambda \le 0$ the solutions are lines or hyperbolic functions, which cannot vanish at both ends except trivially."),
                W(r"New families of nonzero eigenfunctions", r"Nonzero solutions need oscillation, which requires positive $\lambda$. What do nonpositive $\lambda$ give?"),
                W(r"Infinitely many sine modes", r"Sine modes require $\lambda > 0$. What is the only solution when $\lambda \le 0$?"),
                W(r"Complex eigenfunctions", r"The solutions here are real. What real solution survives for $\lambda \le 0$?"),
            ],
        ),
        item(
            "mp_vGwyyXWGR3Y_5",
            r"An eigenvalue of a boundary value problem is best defined as what?",
            r"It is the parameter value that unlocks a nonzero solution.",
            [
                C(r"A value of $\lambda$ for which the problem has a nontrivial solution", r"Yes. Eigenvalues are exactly the parameter values admitting a nonzero solution."),
                W(r"Any root of the differential equation", r"The equation has no roots in that sense; the parameter is what matters. What does an eigenvalue unlock?"),
                W(r"The slope of the solution at the origin", r"A slope is not a parameter value. What property of $\lambda$ defines an eigenvalue?"),
                W(r"The maximum value of the solution", r"The peak value is not the definition. What must exist for $\lambda$ to be an eigenvalue?"),
            ],
        ),
    ],
)

# === 17.3 video 2 ===========================================================
add_micro(
    "Elk0gjSd4c8",
    'Unit 17, Module 17.3, video 2\n           "Two-point boundary value problem, introduction and examples"',
    [
        item(
            "mp_Elk0gjSd4c8_1",
            r"For $y'' + \lambda y = 0$ with Neumann conditions $y'(0) = 0$ and $y'(L) = 0$, the eigenfunctions are which functions?",
            r"The derivative must vanish at both ends.",
            [
                C(r"$y_n(x) = \cos\!\left(\frac{n\pi x}{L}\right)$, $n = 0, 1, 2, \dots$", r"Correct. Cosines have zero slope at $x = 0$ and $x = L$, and $n = 0$ gives the constant mode."),
                W(r"$y_n(x) = \sin\!\left(\frac{n\pi x}{L}\right)$", r"Sine has nonzero slope at $x = 0$. Which function has zero derivative there?"),
                W(r"$y_n(x) = e^{-n x}$", r"Exponentials do not meet zero-slope conditions at both ends. What oscillatory function does?"),
                W(r"$y_n(x) = x\cos(n x)$", r"A bare factor of $x$ spoils the slope condition at $0$. What pure cosine works?"),
            ],
        ),
        item(
            "mp_Elk0gjSd4c8_2",
            r"For $y'' + \lambda y = 0$, $y(0) = y(\pi) = 0$, what is the smallest eigenvalue and its eigenfunction?",
            r"Use $n = 1$ with $L = \pi$.",
            [
                C(r"$\lambda_1 = 1$ with eigenfunction $\sin x$", r"Correct. The lowest mode is $n = 1$, giving $\lambda_1 = 1$ and $\sin x$."),
                W(r"$\lambda_1 = 0$ with eigenfunction $1$", r"The constant function cannot vanish at the ends. What is the lowest sine mode?"),
                W(r"$\lambda_1 = \pi$ with eigenfunction $\sin(\pi x)$", r"With $L = \pi$ the eigenvalues are $n^2$. What does $n = 1$ give?"),
                W(r"$\lambda_1 = 2$ with eigenfunction $\sin 2x$", r"That is the $n$ such that $n^2 = 4$ would not give $2$ either; check $n = 1$. What is $\lambda_1$?"),
            ],
        ),
        item(
            "mp_Elk0gjSd4c8_3",
            r"How many eigenvalues does a regular two-point eigenvalue problem have?",
            r"Think about whether the modes ever stop.",
            [
                C(r"Infinitely many, forming an increasing sequence", r"Yes. The eigenvalues form an infinite sequence increasing without bound."),
                W(r"Exactly two", r"There is no fixed small count; the modes continue indefinitely. How many are there?"),
                W(r"A single eigenvalue", r"One mode is far too few; higher harmonics exist. How many eigenvalues appear?"),
                W(r"Finitely many, depending on $L$", r"The length scales the eigenvalues but does not cap their number. How many are there in total?"),
            ],
        ),
        item(
            "mp_Elk0gjSd4c8_4",
            r"As the mode number $n$ increases, the eigenvalues $\lambda_n = (n\pi/L)^2$ do what?",
            r"Track the behavior of $n^2$.",
            [
                C(r"Increase without bound", r"Yes. Since $\lambda_n$ grows like $n^2$, the eigenvalues tend to infinity."),
                W(r"Approach a finite limit", r"There is no ceiling on $n^2$. What happens to $\lambda_n$ as $n$ grows?"),
                W(r"Decrease toward zero", r"Larger $n$ makes $(n\pi/L)^2$ larger, not smaller. Which direction do they move?"),
                W(r"Oscillate up and down", r"The sequence is monotonic in $n$. What single trend does $n^2$ follow?"),
            ],
        ),
        item(
            "mp_Elk0gjSd4c8_5",
            r"For $y'' + \lambda y = 0$ with $y(0) = 0$ and $y(2) = 0$, the eigenvalues are which?",
            r"Set $L = 2$ in $\lambda_n = (n\pi/L)^2$.",
            [
                C(r"$\lambda_n = \left(\frac{n\pi}{2}\right)^2$", r"Correct. With $L = 2$, the eigenvalues are $(n\pi/2)^2$ for $n = 1, 2, 3, \dots$"),
                W(r"$\lambda_n = (n\pi)^2$", r"The length $L = 2$ divides inside the square. Where does the $2$ go?"),
                W(r"$\lambda_n = \frac{n\pi}{2}$", r"You must square the quantity $n\pi/2$. What is its square?"),
                W(r"$\lambda_n = n^2$", r"That corresponds to $L = \pi$, not $L = 2$. How does $L = 2$ change the formula?"),
            ],
        ),
    ],
)

# === 17.4 video 1 ===========================================================
add_micro(
    "qIfxydBEdzg",
    'Unit 17, Module 17.4, video 1\n           "Shooting Method for Boundary Value Problems"',
    [
        item(
            "mp_qIfxydBEdzg_1",
            r"The core idea of the shooting method is to convert a boundary value problem into what?",
            r"It replaces a far-end condition with a guess at the start.",
            [
                C(r"An initial value problem with a guessed initial slope", r"Yes. The method guesses the missing initial slope and integrates forward as an IVP."),
                W(r"A system of algebraic equations only", r"Integration of an IVP is still required. What kind of problem does shooting solve repeatedly?"),
                W(r"A partial differential equation", r"No new independent variable is introduced. What single-point problem replaces the BVP?"),
                W(r"A purely graphical sketch", r"The method computes numerically, not by sketching. What initial-value form does it use?"),
            ],
        ),
        item(
            "mp_qIfxydBEdzg_2",
            r"In the shooting method, what is adjusted until the far boundary condition is met?",
            r"You vary the quantity you had to guess at the start.",
            [
                C(r"The guessed initial slope (or missing initial value)", r"Yes. You tune the guessed initial slope until the solution hits the target at the far end."),
                W(r"The differential equation itself", r"The equation stays fixed; only the guess changes. What unknown starting quantity is tuned?"),
                W(r"The length of the interval", r"The interval is given by the problem. What free starting value do you adjust?"),
                W(r"The order of the equation", r"The order is fixed. Which guessed initial datum gets varied?"),
            ],
        ),
        item(
            "mp_qIfxydBEdzg_3",
            r"Finding the correct initial slope amounts to solving which kind of problem?",
            r"You want the far-end mismatch to be zero.",
            [
                C(r"A root-finding problem for the boundary mismatch as a function of the guess", r"Yes. You seek the guess that makes the endpoint error zero, a root-finding problem."),
                W(r"A maximization problem", r"You want zero error, not a maximum. What value of the mismatch are you seeking?"),
                W(r"An integration-by-parts problem", r"No integration by parts is involved. What condition on the mismatch must hold?"),
                W(r"A matrix diagonalization", r"Diagonalization is not the tool here. What numerical goal does the slope satisfy?"),
            ],
        ),
        item(
            "mp_qIfxydBEdzg_4",
            r"For a linear boundary value problem, how many shots are needed to find the exact slope by interpolation?",
            r"Linear dependence on the guess means a straight-line fit.",
            [
                C(r"Two shots, then linear interpolation", r"Yes. The endpoint value depends linearly on the guess, so two shots determine the exact slope by interpolation."),
                W(r"A single shot", r"One shot gives one data point, not enough to interpolate. How many are needed for a line?"),
                W(r"Infinitely many shots", r"Linearity makes the process finite. How many points define the needed line?"),
                W(r"Exactly ten shots", r"There is no fixed count like ten; linearity needs only enough for a line. How many is that?"),
            ],
        ),
        item(
            "mp_qIfxydBEdzg_5",
            r"Each shot in the shooting method is carried out using what?",
            r"Forward integration of an initial value problem needs a numerical integrator.",
            [
                C(r"A standard initial value problem solver such as Runge-Kutta", r"Yes. Each shot integrates the IVP numerically, typically with a Runge-Kutta method."),
                W(r"A symbolic factoring routine", r"The steps are numerical integrations, not symbolic factoring. What solver advances each shot?"),
                W(r"A Fourier series expansion", r"Fourier methods are not used for a single shot. What numerical integrator is used?"),
                W(r"A determinant calculation", r"No determinant is computed per shot. What kind of solver integrates the IVP?"),
            ],
        ),
    ],
)

# === 17.4 video 2 ===========================================================
add_micro(
    "tMO28AakkZ8",
    'Unit 17, Module 17.4, video 2\n           "Boundary and Initial Value Problems"',
    [
        item(
            "mp_tMO28AakkZ8_1",
            r"If $y(b; s)$ is the computed endpoint value for guessed slope $s$ and the target is $\beta$, what equation does shooting solve?",
            r"You want the computed endpoint to match the target.",
            [
                C(r"$F(s) = y(b; s) - \beta = 0$", r"Yes. The mismatch $F(s) = y(b; s) - \beta$ is driven to zero to satisfy the far boundary condition."),
                W(r"$F(s) = y(b; s) + \beta = 0$", r"The condition is a match, so you subtract the target. What sign relates $y(b; s)$ and $\beta$?"),
                W(r"$F(s) = s - \beta = 0$", r"The guess $s$ is a slope, not directly the endpoint value. What computed quantity must equal $\beta$?"),
                W(r"$F(s) = y(b; s)\,\beta = 0$", r"A product is not the condition. What difference should vanish?"),
            ],
        ),
        item(
            "mp_tMO28AakkZ8_2",
            r"For a nonlinear boundary value problem, the root $F(s) = 0$ is typically found using what?",
            r"Nonlinear mismatch functions call for iterative root finders.",
            [
                C(r"An iterative method such as Newton's method or bisection", r"Yes. Nonlinear mismatch functions require iterative root finding like Newton or bisection."),
                W(r"A single linear interpolation", r"Linear interpolation is exact only for linear problems. What is needed when $F$ is nonlinear?"),
                W(r"Direct substitution with no iteration", r"A nonlinear root rarely yields to one substitution. What iterative tool is used?"),
                W(r"Separation of variables", r"That technique applies to certain ODEs, not to root finding. What numerical iteration solves $F(s) = 0$?"),
            ],
        ),
        item(
            "mp_tMO28AakkZ8_3",
            r"A practical advantage of the shooting method is that it lets you reuse what?",
            r"It leans on machinery already built for one-point problems.",
            [
                C(r"Robust, well-developed initial value problem integrators", r"Yes. Shooting reduces a BVP to repeated IVPs, reusing mature initial value solvers."),
                W(r"Exact closed-form solution formulas", r"Closed forms are usually unavailable; the method is numerical. What existing solvers does it reuse?"),
                W(r"A table of Fourier coefficients", r"No Fourier table is required. What kind of solver does shooting build on?"),
                W(r"Matrix inversion of the boundary data", r"Direct inversion is a different approach. What IVP machinery does shooting exploit?"),
            ],
        ),
        item(
            "mp_tMO28AakkZ8_4",
            r"How do boundary value problems differ from initial value problems in where conditions are imposed?",
            r"Compare a single starting point with two separated points.",
            [
                C(r"BVP conditions are split across two endpoints; IVP conditions are all at one point", r"Yes. That split is exactly what forces the indirect shooting approach."),
                W(r"BVP and IVP conditions are imposed identically", r"If they were the same, no special method would be needed. How are they placed differently?"),
                W(r"BVP conditions are imposed at infinitely many points", r"Two endpoints carry the conditions, not infinitely many. How are they distributed?"),
                W(r"IVP conditions are imposed at two endpoints", r"That describes a BVP. Where are IVP conditions actually placed?"),
            ],
        ),
        item(
            "mp_tMO28AakkZ8_5",
            r"Why can a single forward integration not directly solve a two-point boundary value problem?",
            r"One end is missing a needed starting datum.",
            [
                C(r"The initial data needed to start the integration is incomplete at one end", r"Yes. One endpoint lacks the slope (or value) needed to begin, so the missing datum must be guessed."),
                W(r"Forward integration is always unstable", r"Instability is not the central issue here. What starting information is missing?"),
                W(r"The equation has no solution", r"The problem can be perfectly solvable. What prevents a direct single integration?"),
                W(r"Boundary value problems are not differential equations", r"They certainly are differential equations. What initial datum is unavailable at one end?"),
            ],
        ),
    ],
)

# === 17.5 video 1 ===========================================================
add_micro(
    "J3S4lBADQVw",
    'Unit 17, Module 17.5, video 1\n           "Orthogonal Functions"',
    [
        item(
            "mp_J3S4lBADQVw_1",
            r"The inner product of two functions $f$ and $g$ on $[a, b]$ is defined as which expression?",
            r"It generalizes the dot product to functions by integrating their product.",
            [
                C(r"$\int_a^b f(x)\,g(x)\,dx$", r"Yes. The function inner product integrates the product of $f$ and $g$ over the interval."),
                W(r"$f(b)\,g(b) - f(a)\,g(a)$", r"That is a boundary difference, not an integral. What operation over $[a,b]$ defines the inner product?"),
                W(r"$\int_a^b \big(f(x) + g(x)\big)\,dx$", r"You multiply the functions, not add them. What integrand appears in the inner product?"),
                W(r"$\frac{f(x)}{g(x)}$ evaluated at $x = a$", r"A pointwise quotient is not an inner product. What integral of a product is used?"),
            ],
        ),
        item(
            "mp_J3S4lBADQVw_2",
            r"Two functions are orthogonal on $[a, b]$ when which quantity equals zero?",
            r"Orthogonality is the function analog of perpendicular vectors.",
            [
                C(r"Their inner product $\int_a^b f g\,dx$", r"Yes. Orthogonality means the inner product, the integral of the product, vanishes."),
                W(r"Their sum $f + g$", r"A zero sum would make them negatives, not orthogonal. What integral must vanish?"),
                W(r"Their difference at the endpoints", r"Endpoint differences are unrelated to orthogonality. What integral equals zero?"),
                W(r"Their pointwise product at every $x$", r"The product need not vanish pointwise, only its integral. What integral is zero?"),
            ],
        ),
        item(
            "mp_J3S4lBADQVw_3",
            r"For integers $m \neq n$, what is $\int_{-\pi}^{\pi} \sin(mx)\sin(nx)\,dx$?",
            r"Distinct sine harmonics are mutually orthogonal on this interval.",
            [
                C(r"$0$", r"Correct. Different sine harmonics are orthogonal on $[-\pi, \pi]$, so the integral is zero."),
                W(r"$\pi$", r"A nonzero value occurs only when $m = n$. What is the integral when $m \neq n$?"),
                W(r"$2\pi$", r"That is closer to a normalization for $m = n$ in a different convention. What does orthogonality give for $m \neq n$?"),
                W(r"$1$", r"The integral is not normalized to one here. What value reflects orthogonality?"),
            ],
        ),
        item(
            "mp_J3S4lBADQVw_4",
            r"What is $\int_0^L \sin\!\left(\frac{n\pi x}{L}\right)\sin\!\left(\frac{m\pi x}{L}\right)dx$ when $m = n$?",
            r"The same harmonic against itself gives the squared norm.",
            [
                C(r"$\frac{L}{2}$", r"Correct. The integral of $\sin^2(n\pi x/L)$ over $[0, L]$ equals $L/2$."),
                W(r"$0$", r"A zero value happens only when $m \neq n$. What is the self inner product when $m = n$?"),
                W(r"$L$", r"The average of $\sin^2$ is $1/2$, so the integral is $L/2$, not $L$. What halves it?"),
                W(r"$\frac{L}{4}$", r"The mean value of $\sin^2$ over a full set of modes is $1/2$. What does that give over length $L$?"),
            ],
        ),
        item(
            "mp_J3S4lBADQVw_5",
            r"The norm of a function $f$ with respect to the inner product is defined as what?",
            r"It is the function analog of vector length.",
            [
                C(r"$\sqrt{\int_a^b f(x)^2\,dx}$", r"Yes. The norm is the square root of the inner product of $f$ with itself."),
                W(r"$\int_a^b f(x)\,dx$", r"That is the plain integral, not the norm. What square root of a self inner product is used?"),
                W(r"$\max_{[a,b]} |f(x)|$", r"The peak value is a different norm; here we use the integral form. What square root defines it?"),
                W(r"$f(b) - f(a)$", r"An endpoint difference is unrelated to length. What integral expression gives the norm?"),
            ],
        ),
    ],
)

# === 17.5 video 2 ===========================================================
add_micro(
    "ZYf0tz9oVz8",
    'Unit 17, Module 17.5, video 2\n           "Linear Algebra: Orthogonal Functions"',
    [
        item(
            "mp_ZYf0tz9oVz8_1",
            r"Why is orthogonality so useful for expanding a function in a series of basis functions?",
            r"Orthogonality decouples one coefficient from all the others.",
            [
                C(r"It lets each coefficient be computed independently by a single inner product", r"Yes. Orthogonality isolates each coefficient through one inner product, with no coupling between terms."),
                W(r"It makes the basis functions identical", r"Orthogonal functions are distinct, not identical. What does orthogonality let you compute term by term?"),
                W(r"It removes the need for any integration", r"Coefficients still come from integrals; orthogonality just decouples them. What does it isolate?"),
                W(r"It guarantees a finite number of terms", r"Series can still be infinite. What computational simplification does orthogonality provide?"),
            ],
        ),
        item(
            "mp_ZYf0tz9oVz8_2",
            r"For integers $m \neq n$, what is $\int_{-\pi}^{\pi} \cos(mx)\cos(nx)\,dx$?",
            r"Distinct cosine harmonics are orthogonal on this interval.",
            [
                C(r"$0$", r"Correct. Different cosine harmonics are orthogonal on $[-\pi, \pi]$."),
                W(r"$\pi$", r"A nonzero value arises only for $m = n$. What is the integral when $m \neq n$?"),
                W(r"$2\pi$", r"That would relate to the $m = n = 0$ case. What does orthogonality give for distinct nonzero harmonics?"),
                W(r"$-\pi$", r"Orthogonality gives a clean zero, not a negative value. What is the integral for $m \neq n$?"),
            ],
        ),
        item(
            "mp_ZYf0tz9oVz8_3",
            r"For all integers $m$ and $n$, what is $\int_{-\pi}^{\pi} \sin(mx)\cos(nx)\,dx$?",
            r"Sines are odd and cosines are even; consider the parity of the product.",
            [
                C(r"$0$", r"Correct. The product of a sine and a cosine integrates to zero over the symmetric interval, so sines and cosines are mutually orthogonal."),
                W(r"$\pi$ when $m = n$", r"Sine against cosine never matches the way sine against sine does. What is the integral for every $m$ and $n$?"),
                W(r"$1$ for all $m, n$", r"The integral is not normalized to one. What value reflects sine-cosine orthogonality?"),
                W(r"Undefined", r"The integral is perfectly well defined. What value does the odd integrand give?"),
            ],
        ),
        item(
            "mp_ZYf0tz9oVz8_4",
            r"The set $\{1, \cos x, \sin x, \cos 2x, \sin 2x, \dots\}$ has which property on $[-\pi, \pi]$?",
            r"Every distinct pair integrates to zero against each other.",
            [
                C(r"It is an orthogonal set", r"Yes. Every distinct pair from this set is orthogonal on $[-\pi, \pi]$, which underlies Fourier series."),
                W(r"It is linearly dependent", r"These functions are independent. What stronger relation does pairwise zero inner product give?"),
                W(r"Every pair has inner product $1$", r"Distinct pairs integrate to zero, not one. What name describes that?"),
                W(r"It spans only constant functions", r"The set reaches far beyond constants. What orthogonality property does it have?"),
            ],
        ),
        item(
            "mp_ZYf0tz9oVz8_5",
            r"An orthonormal set of functions is an orthogonal set with which extra property?",
            r"Normalize each function to unit length.",
            [
                C(r"Each function has norm equal to one", r"Yes. Orthonormal means orthogonal plus every function having unit norm."),
                W(r"Each function integrates to zero", r"Many useful functions do not integrate to zero. What normalization makes a set orthonormal?"),
                W(r"All functions are equal", r"Orthonormal functions are distinct. What unit property is added to orthogonality?"),
                W(r"The functions are all polynomials", r"Orthonormality is not about being polynomial. What norm condition is required?"),
            ],
        ),
    ],
)

# === 17.6 video 1 ===========================================================
add_micro(
    "Oz_cnaz9zSo",
    'Unit 17, Module 17.6, video 1\n           "Sturm Liouville Problem: introduction and meaning"',
    [
        item(
            "mp_Oz_cnaz9zSo_1",
            r"A Sturm-Liouville equation is written in which standard form?",
            r"It packages the derivative terms into a single divergence-style expression.",
            [
                C(r"$\big(p(x)\,y'\big)' + \big(q(x) + \lambda\, w(x)\big)y = 0$", r"Yes. The self-adjoint Sturm-Liouville form collects the second-order term as $(p y')'$ with a weight $w$ multiplying $\lambda$."),
                W(r"$y'' + \lambda^2 y = 0$ only", r"That is one special case, not the general form. What general structure with $p$, $q$, and $w$ is used?"),
                W(r"$p(x)\,y'' + \lambda y = q(x)$", r"The leading term must be the derivative of $p y'$, not $p y''$. What self-adjoint form is standard?"),
                W(r"$y' = \lambda w(x) y$", r"A first-order form does not capture Sturm-Liouville problems. What second-order self-adjoint form is correct?"),
            ],
        ),
        item(
            "mp_Oz_cnaz9zSo_2",
            r"A regular Sturm-Liouville problem is posed on a finite interval with which kind of boundary conditions?",
            r"The conditions act separately at each endpoint.",
            [
                C(r"Separated boundary conditions at each endpoint", r"Yes. A regular problem uses separated conditions, one at each end, with $p$ and $w$ positive on the interval."),
                W(r"No boundary conditions at all", r"Boundary conditions are essential to the eigenvalue problem. What separated conditions are imposed?"),
                W(r"Conditions only at the left endpoint", r"Both ends must be constrained. What kind of conditions does a regular problem use?"),
                W(r"Periodic conditions only", r"Periodic conditions define a different (periodic) Sturm-Liouville problem. What does the regular case use?"),
            ],
        ),
        item(
            "mp_Oz_cnaz9zSo_3",
            r"For a regular Sturm-Liouville problem, the eigenvalues are guaranteed to be what?",
            r"A key theorem rules out complex eigenvalues.",
            [
                C(r"Real", r"Yes. The self-adjoint structure guarantees that all eigenvalues are real."),
                W(r"Always complex", r"The self-adjoint form forbids genuinely complex eigenvalues. What kind must they be?"),
                W(r"Always negative", r"Eigenvalues are not forced to be negative. What property is actually guaranteed?"),
                W(r"Always equal to one", r"There is no such normalization. What does the theory guarantee about the eigenvalues?"),
            ],
        ),
        item(
            "mp_Oz_cnaz9zSo_4",
            r"Eigenfunctions of a Sturm-Liouville problem belonging to distinct eigenvalues are what?",
            r"They satisfy a weighted orthogonality relation.",
            [
                C(r"Orthogonal with respect to the weight $w(x)$", r"Yes. Distinct-eigenvalue eigenfunctions are orthogonal under the weighted inner product with weight $w$."),
                W(r"Always identical", r"Distinct eigenvalues give distinct eigenfunctions. What relation holds between them?"),
                W(r"Parallel (scalar multiples)", r"They are not multiples of one another. What weighted relation do they satisfy?"),
                W(r"Orthogonal only without any weight", r"The orthogonality uses the weight $w$, not the unweighted inner product. What weight appears?"),
            ],
        ),
        item(
            "mp_Oz_cnaz9zSo_5",
            r"The eigenvalues of a regular Sturm-Liouville problem form which kind of sequence?",
            r"They line up in order and never stop increasing.",
            [
                C(r"An increasing sequence tending to infinity", r"Yes. The eigenvalues are real, simple, ordered, and grow without bound."),
                W(r"A finite list", r"The eigenvalues do not stop after finitely many. How many are there, and how are they ordered?"),
                W(r"A decreasing sequence toward zero", r"They increase rather than decrease. Which direction does the sequence go?"),
                W(r"A random unordered set", r"They follow a strict increasing order. What pattern does the sequence have?"),
            ],
        ),
    ],
)

# === 17.6 video 2 ===========================================================
add_micro(
    "l9Dc1ab9RaU",
    'Unit 17, Module 17.6, video 2\n           "What is a Sturm-Liouville problem? (Intro)"',
    [
        item(
            "mp_l9Dc1ab9RaU_1",
            r"Writing $y'' + \lambda y = 0$ in Sturm-Liouville form $(p y')' + (q + \lambda w)y = 0$ uses which functions?",
            r"Match the plain second derivative to $(p y')'$ with no extra factors.",
            [
                C(r"$p = 1$, $q = 0$, $w = 1$", r"Correct. With $p = 1$ the term $(p y')' = y''$, and $q = 0$, $w = 1$ recover $y'' + \lambda y = 0$."),
                W(r"$p = 0$, $q = 1$, $w = 1$", r"If $p = 0$ the second-derivative term disappears. What value of $p$ gives $(p y')' = y''$?"),
                W(r"$p = x$, $q = 0$, $w = 1$", r"A nonconstant $p$ would introduce a $y'$ term. What constant $p$ reproduces $y''$?"),
                W(r"$p = 1$, $q = \lambda$, $w = 0$", r"With $w = 0$ the eigenvalue term vanishes. Which function should multiply $\lambda$?"),
            ],
        ),
        item(
            "mp_l9Dc1ab9RaU_2",
            r"In a Sturm-Liouville problem, the weight function $w(x)$ does what?",
            r"It appears inside the inner product that defines orthogonality.",
            [
                C(r"Defines the weighted inner product under which eigenfunctions are orthogonal", r"Yes. The weight $w$ sets the inner product $\int f g\, w\, dx$ that makes the eigenfunctions orthogonal."),
                W(r"Multiplies the highest derivative", r"That role belongs to $p$, not $w$. Where does the weight $w$ appear?"),
                W(r"Sets the boundary conditions", r"Boundary conditions are imposed separately. What integral structure does $w$ define?"),
                W(r"Has no effect on the problem", r"The weight is central to orthogonality. What inner product does it determine?"),
            ],
        ),
        item(
            "mp_l9Dc1ab9RaU_3",
            r"The orthogonality of Sturm-Liouville eigenfunctions ultimately follows from which structural property?",
            r"The operator equals its own adjoint.",
            [
                C(r"The self-adjoint (symmetric) form of the operator", r"Yes. Writing the operator in self-adjoint form is exactly what forces real eigenvalues and orthogonal eigenfunctions."),
                W(r"The nonlinearity of the equation", r"Sturm-Liouville problems are linear. What symmetry of the operator drives orthogonality?"),
                W(r"The absence of boundary conditions", r"Boundary conditions are required and help establish self-adjointness. What operator property is key?"),
                W(r"The presence of a forcing term", r"These eigenvalue problems are homogeneous. What structural property guarantees orthogonality?"),
            ],
        ),
        item(
            "mp_l9Dc1ab9RaU_4",
            r"A central payoff of Sturm-Liouville theory is that the eigenfunctions form what?",
            r"Any reasonable function can be expanded in them.",
            [
                C(r"A complete basis for expanding functions in eigenfunction series", r"Yes. The eigenfunctions are complete, so general functions can be expanded in eigenfunction (generalized Fourier) series."),
                W(r"A finite set spanning only polynomials", r"The set is infinite and far richer than polynomials. What expansion property do they provide?"),
                W(r"A basis only for the constant functions", r"They represent much more than constants. What completeness do they have?"),
                W(r"A set that cannot represent any function", r"They can represent broad classes of functions. What basis property do they possess?"),
            ],
        ),
        item(
            "mp_l9Dc1ab9RaU_5",
            r"How does the Dirichlet eigenvalue problem $y'' + \lambda y = 0$, $y(0) = y(L) = 0$ relate to Sturm-Liouville theory?",
            r"Recognize it as a particular choice of $p$, $q$, and $w$.",
            [
                C(r"It is a special case of a regular Sturm-Liouville problem", r"Yes. It is the Sturm-Liouville problem with $p = 1$, $q = 0$, $w = 1$ and separated conditions."),
                W(r"It is unrelated to Sturm-Liouville theory", r"It fits the framework exactly. Which choice of $p$, $q$, $w$ makes it Sturm-Liouville?"),
                W(r"It is a nonlinear exception", r"The problem is linear and self-adjoint. How does it sit inside the theory?"),
                W(r"It is a first-order example", r"The equation is second order. What kind of Sturm-Liouville case is it?"),
            ],
        ),
    ],
)

# ============================================================================
# UNIT 18 MICRO PRACTICE
# ============================================================================

# === 18.1 video 1 ===========================================================
add_micro(
    "r6sGWTCMz2k",
    'Unit 18, Module 18.1, video 1\n           "But what is a Fourier series? From heat flow to drawing with circles, DE4"',
    [
        item(
            "mp_r6sGWTCMz2k_1",
            r"A Fourier series represents a periodic function as a sum of what?",
            r"Think about the building-block waves with integer-multiple frequencies.",
            [
                C(r"Sines and cosines of integer-multiple frequencies", r"Yes. A Fourier series builds a periodic function from sines and cosines whose frequencies are integer multiples of a base frequency."),
                W(r"Powers of $x$", r"Power series use powers of $x$; Fourier series use waves. What oscillating functions are summed?"),
                W(r"Exponentials with random frequencies", r"The frequencies are integer multiples of a fundamental, not random. What waves are used?"),
                W(r"A single sine wave", r"One wave cannot capture a general periodic shape. What collection of waves is summed?"),
            ],
        ),
        item(
            "mp_r6sGWTCMz2k_2",
            r"In a Fourier series, the higher-frequency terms are called what?",
            r"They are integer multiples of the fundamental frequency.",
            [
                C(r"Harmonics", r"Yes. The higher terms are harmonics, with frequencies that are integer multiples of the fundamental."),
                W(r"Residues", r"Residues belong to complex analysis, not Fourier harmonics. What are integer-multiple frequency terms called?"),
                W(r"Eigenvectors", r"Eigenvectors are vectors, not series terms here. What name fits the higher frequency waves?"),
                W(r"Asymptotes", r"Asymptotes describe limiting lines, not series terms. What are the multiples of the fundamental called?"),
            ],
        ),
        item(
            "mp_r6sGWTCMz2k_3",
            r"The visual intuition in the video draws a Fourier series as what kind of construction?",
            r"Picture vectors of fixed lengths turning at steady rates.",
            [
                C(r"Rotating vectors (epicycles) adding tip to tail", r"Yes. Each term is a rotating vector, and summing them tip to tail traces the target curve."),
                W(r"A single straight arrow", r"One fixed arrow cannot trace a curve. What turning construction is shown?"),
                W(r"A bar chart of values", r"The picture is of rotating arrows, not bars. What spinning objects are added?"),
                W(r"A static grid of points", r"The construction is dynamic and rotational. What rotating objects build the curve?"),
            ],
        ),
        item(
            "mp_r6sGWTCMz2k_4",
            r"Why does representing a square wave by a Fourier series require infinitely many terms?",
            r"A finite sum of smooth waves stays smooth.",
            [
                C(r"Its sharp jumps cannot be matched exactly by any finite sum of smooth sinusoids", r"Yes. The discontinuities of a square wave need infinitely many harmonics to approach, and finitely many always fall short."),
                W(r"Because sines and cosines are not periodic", r"Sines and cosines are periodic; that is why they are used. Why are infinitely many needed for a square wave?"),
                W(r"Because the square wave is not periodic", r"A square wave is periodic. What feature of it demands infinitely many terms?"),
                W(r"Because each term has the same frequency", r"The terms have distinct harmonic frequencies. What property of the square wave forces an infinite series?"),
            ],
        ),
        item(
            "mp_r6sGWTCMz2k_5",
            r"Historically, Fourier introduced these series while studying which physical problem?",
            r"The video opens with this classic application.",
            [
                C(r"Heat flow", r"Yes. Fourier developed his series to analyze the flow of heat in solid bodies."),
                W(r"Planetary orbits", r"Orbital mechanics is a different lineage. What heat-related problem motivated Fourier?"),
                W(r"Population growth", r"Population models came from other work. Which physical flow did Fourier study?"),
                W(r"Electrical circuits", r"Circuit analysis came later. What thermal problem did Fourier originally address?"),
            ],
        ),
    ],
)

# === 18.1 video 2 ===========================================================
add_micro(
    "spUNpyF58BY",
    'Unit 18, Module 18.1, video 2\n           "But what is the Fourier Transform? A visual introduction."',
    [
        item(
            "mp_spUNpyF58BY_1",
            r"The Fourier transform decomposes a (generally non-periodic) signal into what?",
            r"It reports how much of each frequency is present, across a continuum.",
            [
                C(r"A continuous spectrum of frequencies", r"Yes. The transform expresses a signal as a continuous distribution over all frequencies."),
                W(r"A finite list of integer harmonics", r"A discrete harmonic list is the Fourier series picture. What continuum does the transform produce?"),
                W(r"A single dominant frequency only", r"Even one peak sits within a full spectrum. What continuous object does the transform give?"),
                W(r"A polynomial in time", r"The output lives in frequency, not as a time polynomial. What spectrum results?"),
            ],
        ),
        item(
            "mp_spUNpyF58BY_2",
            r"The video's winding intuition detects a frequency by watching what quantity?",
            r"The wound-up graph has a center of mass that moves.",
            [
                C(r"The center of mass of the wound-up signal", r"Yes. When the winding frequency matches a present frequency, the center of mass swings far from the origin, marking a peak."),
                W(r"The slope of the signal at the origin", r"The detector is the center of mass, not a slope. What moving quantity signals a match?"),
                W(r"The number of zero crossings", r"Zero crossings are not the winding detector. What center-of-mass behavior marks a frequency?"),
                W(r"The maximum height of the signal", r"Peak height alone is not the detector. What quantity of the wound graph is tracked?"),
            ],
        ),
        item(
            "mp_spUNpyF58BY_3",
            r"The Fourier transform maps a signal between which two domains?",
            r"It trades a description in one variable for one in frequency.",
            [
                C(r"The time domain and the frequency domain", r"Yes. The transform converts between a time-domain signal and its frequency-domain spectrum."),
                W(r"The position domain and the momentum domain only in physics", r"While related in physics, the general statement is about time and frequency. Which two domains does it connect?"),
                W(r"The real axis and the complex plane", r"That is not the transform's domain pairing. What two physical domains does it relate?"),
                W(r"The discrete and continuous integers", r"Integers are not the domains here. What time and what other domain are linked?"),
            ],
        ),
        item(
            "mp_spUNpyF58BY_4",
            r"When is a Fourier series used rather than a Fourier transform?",
            r"Series handle one class of signals, transforms the other.",
            [
                C(r"For periodic signals (the transform suits non-periodic signals)", r"Yes. Fourier series represent periodic signals with discrete harmonics; the transform handles non-periodic signals with a continuous spectrum."),
                W(r"For non-periodic signals only", r"Non-periodic signals are the transform's domain. Which class does the series serve?"),
                W(r"For signals defined only at integers", r"That describes a different (discrete) tool. Which periodicity does the series require?"),
                W(r"For constant signals only", r"Constants are a trivial case, not the general rule. What kind of signals does the series represent?"),
            ],
        ),
        item(
            "mp_spUNpyF58BY_5",
            r"In the transform's spectrum, a frequency strongly present in the signal shows up as what?",
            r"A strong match makes the detector respond sharply.",
            [
                C(r"A peak (spike) at that frequency", r"Yes. A frequency that is strongly present produces a pronounced peak in the spectrum."),
                W(r"A zero at that frequency", r"A present frequency gives a large response, not a zero. What feature marks it?"),
                W(r"A flat region everywhere", r"A flat spectrum would mean no dominant frequency. What localized feature appears?"),
                W(r"A vertical asymptote in time", r"The feature lives in the frequency spectrum, not in time. What does a present frequency produce there?"),
            ],
        ),
    ],
)

# === 18.2 video 1 ===========================================================
add_micro(
    "wmCIrpLBFds",
    'Unit 18, Module 18.2, video 1\n           "Intro to FOURIER SERIES: The Big Idea"',
    [
        item(
            "mp_wmCIrpLBFds_1",
            r"For a function of period $2L$ written as $f(x) = \tfrac{a_0}{2} + \sum_{n=1}^\infty \big(a_n\cos\tfrac{n\pi x}{L} + b_n\sin\tfrac{n\pi x}{L}\big)$, the constant $a_0$ is given by which formula?",
            r"The constant term measures the average; integrate $f$ over a full period.",
            [
                C(r"$a_0 = \frac{1}{L}\int_{-L}^{L} f(x)\,dx$", r"Correct. Integrating $f$ over a full period and dividing by $L$ gives $a_0$, and $a_0/2$ is the average value."),
                W(r"$a_0 = \int_{-L}^{L} f(x)\,dx$", r"You must divide by the interval factor $L$. What normalization belongs in front of the integral?"),
                W(r"$a_0 = \frac{1}{2L}\int_{-L}^{L} f(x)\,dx$", r"That formula would compute the average directly, but the convention puts $a_0/2$ as the average. What prefactor defines $a_0$ itself?"),
                W(r"$a_0 = \frac{1}{L}\int_{-L}^{L} f(x)\cos x\,dx$", r"The constant term carries no cosine factor. What integrand gives $a_0$?"),
            ],
        ),
        item(
            "mp_wmCIrpLBFds_2",
            r"The cosine coefficients are given by which formula?",
            r"Project $f$ onto the matching cosine harmonic.",
            [
                C(r"$a_n = \frac{1}{L}\int_{-L}^{L} f(x)\cos\!\frac{n\pi x}{L}\,dx$", r"Correct. Each cosine coefficient is the inner product of $f$ with $\cos(n\pi x/L)$, normalized by $L$."),
                W(r"$a_n = \frac{1}{L}\int_{-L}^{L} f(x)\sin\!\frac{n\pi x}{L}\,dx$", r"That projects onto sine, giving $b_n$. Which trig function pairs with $a_n$?"),
                W(r"$a_n = \int_{-L}^{L} f(x)\,dx$", r"The harmonic factor is missing and so is the normalization. What integrand isolates the cosine coefficient?"),
                W(r"$a_n = \frac{1}{L}\,f\!\left(\frac{n\pi}{L}\right)$", r"Coefficients come from integrals, not point evaluations. What integral defines $a_n$?"),
            ],
        ),
        item(
            "mp_wmCIrpLBFds_3",
            r"The sine coefficients are given by which formula?",
            r"Project $f$ onto the matching sine harmonic.",
            [
                C(r"$b_n = \frac{1}{L}\int_{-L}^{L} f(x)\sin\!\frac{n\pi x}{L}\,dx$", r"Correct. Each sine coefficient is the inner product of $f$ with $\sin(n\pi x/L)$, normalized by $L$."),
                W(r"$b_n = \frac{1}{L}\int_{-L}^{L} f(x)\cos\!\frac{n\pi x}{L}\,dx$", r"That projects onto cosine, giving $a_n$. Which trig function pairs with $b_n$?"),
                W(r"$b_n = \frac{1}{2L}\int_{-L}^{L} f(x)\sin\!\frac{n\pi x}{L}\,dx$", r"The normalization for the harmonics is $1/L$, not $1/(2L)$. What prefactor is correct?"),
                W(r"$b_n = f'\!\left(\frac{n\pi}{L}\right)$", r"Coefficients are integrals, not derivative values. What integral defines $b_n$?"),
            ],
        ),
        item(
            "mp_wmCIrpLBFds_4",
            r"If a function has period $2L$, what is its fundamental period in the Fourier series convention above?",
            r"The basic repeat length is the full interval from $-L$ to $L$.",
            [
                C(r"$2L$", r"Correct. The function repeats over a length of $2L$, matching the harmonics $\cos(n\pi x/L)$ and $\sin(n\pi x/L)$."),
                W(r"$L$", r"The half-length $L$ is not the full repeat length. What is the distance over which $f$ repeats?"),
                W(r"$\pi$", r"The period need not equal $\pi$; that is only the special case $L = \pi/?$. What is the period in terms of $L$?"),
                W(r"$\frac{1}{2L}$", r"That is a frequency-like quantity, not a period. What length is the fundamental period?"),
            ],
        ),
        item(
            "mp_wmCIrpLBFds_5",
            r"The Fourier coefficient formulas follow directly from which property of the sine and cosine basis?",
            r"Each coefficient is isolated by integrating against one basis function.",
            [
                C(r"Orthogonality of the harmonics over a period", r"Yes. Because distinct harmonics are orthogonal, integrating $f$ against one of them isolates its coefficient."),
                W(r"The harmonics all being equal", r"The harmonics are distinct, not equal. What relation between them isolates each coefficient?"),
                W(r"The harmonics being polynomials", r"Sines and cosines are not polynomials. What orthogonality property is used?"),
                W(r"The function being a single sine", r"The formulas apply to general $f$, not just one sine. What basis property makes them work?"),
            ],
        ),
    ],
)

# === 18.2 video 2 ===========================================================
add_micro(
    "ijQaTAT3kOg",
    'Unit 18, Module 18.2, video 2\n           "How to Compute a FOURIER SERIES: Formulas and Full Example"',
    [
        item(
            "mp_ijQaTAT3kOg_1",
            r"For an odd function on $[-L, L]$, which Fourier coefficients vanish?",
            r"Cosine is even, so an odd function has no overlap with it.",
            [
                C(r"All the cosine coefficients $a_n$ (including $a_0$)", r"Correct. An odd function is orthogonal to every cosine, so only sine terms survive."),
                W(r"All the sine coefficients $b_n$", r"Sine matches an odd function, so the sine terms remain. Which coefficients drop out?"),
                W(r"Only $a_0$, with the other $a_n$ kept", r"Every cosine coefficient vanishes for an odd function, not just $a_0$. Which whole family disappears?"),
                W(r"None of them vanish", r"Parity forces half the coefficients to zero. Which family vanishes for an odd function?"),
            ],
        ),
        item(
            "mp_ijQaTAT3kOg_2",
            r"For an even function on $[-L, L]$, which Fourier coefficients vanish?",
            r"Sine is odd, so an even function has no overlap with it.",
            [
                C(r"All the sine coefficients $b_n$", r"Correct. An even function is orthogonal to every sine, so only cosine terms survive."),
                W(r"All the cosine coefficients $a_n$", r"Cosines match an even function, so they remain. Which family vanishes instead?"),
                W(r"Only $b_1$", r"Every sine coefficient vanishes for an even function, not just the first. Which whole family disappears?"),
                W(r"The constant $a_0$ only", r"The constant term survives for an even function. Which family drops to zero?"),
            ],
        ),
        item(
            "mp_ijQaTAT3kOg_3",
            r"The Fourier series of $f(x) = x^2$ on $[-\pi, \pi]$ contains which terms?",
            r"Determine the parity of $x^2$ first.",
            [
                C(r"A constant and cosine terms only", r"Correct. Since $x^2$ is even, its sine coefficients vanish, leaving the constant and cosine terms."),
                W(r"Sine terms only", r"Sine terms vanish for an even function. What kind of terms survive for $x^2$?"),
                W(r"Both sine and cosine terms equally", r"The odd sine terms drop out for an even function. Which terms remain?"),
                W(r"No terms at all", r"A nonzero function has a nonzero series. Which terms does an even function keep?"),
            ],
        ),
        item(
            "mp_ijQaTAT3kOg_4",
            r"The average value of $f$ over one period equals which part of its Fourier series?",
            r"The oscillating terms average to zero over a full period.",
            [
                C(r"The constant term $a_0/2$", r"Correct. Every sine and cosine averages to zero over a period, leaving $a_0/2$ as the mean."),
                W(r"The first sine coefficient $b_1$", r"Sinusoids average to zero, so $b_1$ does not give the mean. What constant remains?"),
                W(r"The largest coefficient", r"Size of a harmonic does not set the average. What term survives averaging?"),
                W(r"Zero, always", r"The mean is zero only if $a_0 = 0$. What term equals the average in general?"),
            ],
        ),
        item(
            "mp_ijQaTAT3kOg_5",
            r"At a jump discontinuity of $f$, the Fourier series converges to what value?",
            r"It splits the difference between the two one-sided limits.",
            [
                C(r"The midpoint (average) of the left-hand and right-hand limits", r"Correct. At a jump the series converges to the average of the one-sided limits."),
                W(r"The left-hand limit only", r"It does not favor one side. What combination of the two limits does it pick?"),
                W(r"The larger of the two limits", r"It is not the maximum. What average value does the series take?"),
                W(r"Zero", r"The value is generally nonzero. What average of the side limits results?"),
            ],
        ),
    ],
)

# === 18.3 video 1 ===========================================================
add_micro(
    "JaiSBThC6wM",
    'Unit 18, Module 18.3, video 1\n           "Fourier Series"',
    [
        item(
            "mp_JaiSBThC6wM_1",
            r"The full Fourier series on $[-L, L]$ uses which set of basis functions?",
            r"Both even and odd harmonics participate.",
            [
                C(r"Both cosines and sines, plus a constant", r"Yes. The full series combines a constant, cosine harmonics, and sine harmonics."),
                W(r"Only cosines", r"Cosine-only series are the half-range cosine case. What does the full series also include?"),
                W(r"Only sines", r"Sine-only series are the half-range sine case. What additional terms does the full series carry?"),
                W(r"Only the constant term", r"A single constant cannot represent a general function. What harmonics are also included?"),
            ],
        ),
        item(
            "mp_JaiSBThC6wM_2",
            r"To apply a Fourier series to a function defined only on $[-L, L]$, what is assumed about $f$ outside that interval?",
            r"The series itself is periodic, so it repeats the data.",
            [
                C(r"It is extended periodically with period $2L$", r"Yes. The Fourier series represents the periodic extension of $f$ with period $2L$."),
                W(r"It is set to zero outside the interval", r"The series repeats the data rather than zeroing it. What extension does the series build?"),
                W(r"It grows linearly outside the interval", r"Fourier series are bounded and periodic, not linearly growing. What periodic behavior is assumed?"),
                W(r"It is undefined outside the interval", r"The series is defined for all $x$. How does it continue $f$?"),
            ],
        ),
        item(
            "mp_JaiSBThC6wM_3",
            r"A Fourier series of a piecewise smooth function is guaranteed to converge under which classical result?",
            r"Piecewise smoothness is the key hypothesis.",
            [
                C(r"It converges to $f$ at points of continuity and to the midpoint at jumps", r"Yes. The convergence theorem gives $f$ where it is continuous and the average of the side limits at jumps."),
                W(r"It diverges everywhere", r"Piecewise smooth functions have convergent series. Where does it converge?"),
                W(r"It converges only at the endpoints", r"Convergence holds throughout, not just at the ends. What does it converge to at interior points?"),
                W(r"It converges only if $f$ is a polynomial", r"Polynomials are not required. What smoothness hypothesis guarantees convergence?"),
            ],
        ),
        item(
            "mp_JaiSBThC6wM_4",
            r"The overshoot of a Fourier partial sum near a jump discontinuity is known as what?",
            r"It is a famous named artifact at discontinuities.",
            [
                C(r"The Gibbs phenomenon", r"Yes. The persistent overshoot near a jump is called the Gibbs phenomenon."),
                W(r"The Runge phenomenon", r"Runge's phenomenon concerns polynomial interpolation, not Fourier sums. What is the Fourier overshoot called?"),
                W(r"Resonance", r"Resonance is a forcing effect, not the jump overshoot. What name applies to the Fourier overshoot?"),
                W(r"Aliasing", r"Aliasing is a sampling effect. What is the named overshoot near a jump?"),
            ],
        ),
        item(
            "mp_JaiSBThC6wM_5",
            r"Fourier series are useful for solving linear differential equations with which kind of forcing?",
            r"Periodic forcing can be broken into harmonics.",
            [
                C(r"Periodic forcing, by solving for each harmonic and superposing", r"Yes. A periodic forcing is expanded in harmonics, each handled separately, then superposed."),
                W(r"Only constant forcing", r"Constant forcing is a trivial single term. What broader periodic forcing do Fourier methods address?"),
                W(r"Only impulsive forcing", r"Impulses are the Laplace or Green's-function setting. What periodic forcing suits Fourier series?"),
                W(r"No forcing can be handled", r"Periodic forcing is a prime use case. What forcing does the harmonic approach handle?"),
            ],
        ),
    ],
)

# === 18.3 video 2 ===========================================================
add_micro(
    "jDLCxErtwTs",
    'Unit 18, Module 18.3, video 2\n           "Fourier Cosine and Sine Series"',
    [
        item(
            "mp_jDLCxErtwTs_1",
            r"A half-range sine series represents a function on $[0, L]$ using which extension?",
            r"Sines are odd, so the matching extension is odd.",
            [
                C(r"The odd periodic extension, giving only sine terms", r"Yes. Extending $f$ as an odd function produces a pure sine series on $[0, L]$."),
                W(r"The even periodic extension", r"Even extension yields cosines, not sines. What parity gives a sine series?"),
                W(r"A constant extension", r"A constant extension does not produce sine harmonics. What odd extension does?"),
                W(r"No extension is needed", r"The series is built from a specific extension. Which odd extension gives sines?"),
            ],
        ),
        item(
            "mp_jDLCxErtwTs_2",
            r"A half-range cosine series represents a function on $[0, L]$ using which extension?",
            r"Cosines are even, so the matching extension is even.",
            [
                C(r"The even periodic extension, giving only cosine terms", r"Yes. Extending $f$ as an even function produces a pure cosine series on $[0, L]$."),
                W(r"The odd periodic extension", r"Odd extension yields sines, not cosines. What parity gives a cosine series?"),
                W(r"A linear extension", r"A linear ramp is not how the cosine series is built. What even extension does?"),
                W(r"A random extension", r"The extension is specifically even. Which extension yields cosine terms?"),
            ],
        ),
        item(
            "mp_jDLCxErtwTs_3",
            r"A sine series is the natural choice for a heat problem with which boundary conditions?",
            r"Sine vanishes at both ends.",
            [
                C(r"Fixed (zero) temperature at both ends, $u(0) = u(L) = 0$", r"Yes. Sine harmonics vanish at both ends, matching fixed-temperature (Dirichlet) conditions."),
                W(r"Insulated ends, $u_x(0) = u_x(L) = 0$", r"Insulated ends suit cosines, whose slope vanishes. What conditions do sines satisfy?"),
                W(r"No boundary conditions", r"The choice is driven by the boundary conditions. Which conditions do sines match?"),
                W(r"A fixed slope at both ends", r"Sines match fixed values, not fixed slopes. What boundary values do they satisfy?"),
            ],
        ),
        item(
            "mp_jDLCxErtwTs_4",
            r"A cosine series is the natural choice for a problem with which boundary conditions?",
            r"Cosine has zero slope at both ends.",
            [
                C(r"Insulated ends, $u_x(0) = u_x(L) = 0$", r"Yes. Cosine harmonics have vanishing derivative at both ends, matching insulated (Neumann) conditions."),
                W(r"Fixed zero temperature at both ends", r"Fixed values suit sines, whose value vanishes. What slope condition do cosines satisfy?"),
                W(r"A fixed nonzero value at one end only", r"Cosine series handle symmetric slope conditions. Which derivative conditions do they match?"),
                W(r"Periodic conditions only", r"Half-range cosine series target Neumann conditions. Which slope conditions do they satisfy?"),
            ],
        ),
        item(
            "mp_jDLCxErtwTs_5",
            r"The coefficients of a half-range sine series are given by which formula?",
            r"Project onto $\sin(n\pi x/L)$ over $[0, L]$ with the half-range normalization.",
            [
                C(r"$b_n = \frac{2}{L}\int_0^L f(x)\sin\!\frac{n\pi x}{L}\,dx$", r"Correct. The half-range sine coefficient integrates over $[0, L]$ with the factor $2/L$."),
                W(r"$b_n = \frac{1}{L}\int_0^L f(x)\sin\!\frac{n\pi x}{L}\,dx$", r"The half-range convention uses $2/L$, not $1/L$. What prefactor is correct?"),
                W(r"$b_n = \frac{2}{L}\int_0^L f(x)\cos\!\frac{n\pi x}{L}\,dx$", r"Sine coefficients pair with sine, not cosine. Which trig function belongs in the integrand?"),
                W(r"$b_n = \frac{2}{L}\int_{-L}^L f(x)\sin\!\frac{n\pi x}{L}\,dx$", r"The half-range integral runs over $[0, L]$, not $[-L, L]$. What limits are correct?"),
            ],
        ),
    ],
)

# === 18.4 video 1 ===========================================================
add_micro(
    "dIsxevQhzic",
    'Unit 18, Module 18.4, video 1\n           "Separable Partial Differential Equations"',
    [
        item(
            "mp_dIsxevQhzic_1",
            r"The method of separation of variables seeks a solution of the form what?",
            r"Split the dependence on each variable into its own factor.",
            [
                C(r"$u(x, t) = X(x)\,T(t)$, a product of single-variable functions", r"Yes. Separation of variables assumes the solution factors into a function of $x$ times a function of $t$."),
                W(r"$u(x, t) = X(x) + T(t)$, a sum", r"Separation uses a product, not a sum. How are the single-variable factors combined?"),
                W(r"$u(x, t) = X(x)\,T(x)$, both in $x$", r"One factor must depend on $t$. Which variables do the two factors use?"),
                W(r"$u(x, t) = X(t)\,T(x)$ with swapped variables", r"Each factor should carry its own variable, $X$ in $x$ and $T$ in $t$. What is the correct product form?"),
            ],
        ),
        item(
            "mp_dIsxevQhzic_2",
            r"After substituting $u = X(x)T(t)$ and dividing, each side of the equation depends on a single variable. What does this force?",
            r"If a function of $x$ equals a function of $t$ for all $x$ and $t$, both must be constant.",
            [
                C(r"Both sides equal a common constant (the separation constant)", r"Yes. A function of $x$ alone equal to a function of $t$ alone must be constant, the separation constant."),
                W(r"Both sides equal zero", r"They equal a shared constant, not necessarily zero. What common value must they take?"),
                W(r"The variables become dependent", r"The point is that the sides are independent yet equal. What must each side then be?"),
                W(r"The equation has no solution", r"Separation succeeds precisely here. What common quantity do the two sides share?"),
            ],
        ),
        item(
            "mp_dIsxevQhzic_3",
            r"Separation of variables turns one partial differential equation into what?",
            r"Each single-variable factor obeys its own equation.",
            [
                C(r"Two ordinary differential equations", r"Yes. The separation produces an ODE for $X(x)$ and an ODE for $T(t)$."),
                W(r"One larger partial differential equation", r"Separation reduces, not enlarges, the problem. What simpler equations result?"),
                W(r"A single algebraic equation", r"Derivatives remain, so the results are differential. How many ODEs appear?"),
                W(r"An integral equation", r"No integral equation is produced. What kind of equations does separation yield?"),
            ],
        ),
        item(
            "mp_dIsxevQhzic_4",
            r"In the separated heat equation, the spatial factor $X(x)$ together with the boundary conditions forms what?",
            r"The constant ties $X$ to an eigenvalue problem.",
            [
                C(r"A boundary value eigenvalue problem", r"Yes. The spatial ODE plus boundary conditions is exactly an eigenvalue problem whose eigenvalues are the allowed separation constants."),
                W(r"An initial value problem", r"The spatial part carries boundary conditions, not initial data. What kind of problem does $X$ solve?"),
                W(r"A purely algebraic identity", r"Derivatives in $x$ remain. What boundary-condition problem does $X$ satisfy?"),
                W(r"A nonlinear system", r"The separated spatial equation is linear. What linear eigenvalue problem results?"),
            ],
        ),
        item(
            "mp_dIsxevQhzic_5",
            r"The role of the separation constant in the spatial equation is to play the part of what?",
            r"It is the value that the boundary conditions quantize.",
            [
                C(r"An eigenvalue selected by the boundary conditions", r"Yes. The boundary conditions admit only discrete separation constants, the eigenvalues of the spatial problem."),
                W(r"An arbitrary integration constant", r"It is constrained, not free; the boundary conditions pin it. What does it become?"),
                W(r"The initial temperature", r"The constant is not the initial data. What spectral quantity does it represent?"),
                W(r"The wave speed", r"It is not a speed. What eigenvalue role does the separation constant take?"),
            ],
        ),
    ],
)

# === 18.4 video 2 ===========================================================
add_micro(
    "17WkgjkENV0",
    'Unit 18, Module 18.4, video 2\n           "Classical PDEs and Boundary-Value Problems"',
    [
        item(
            "mp_17WkgjkENV0_1",
            r"The one-dimensional heat equation is which partial differential equation?",
            r"It is first order in time and second order in space.",
            [
                C(r"$u_t = \alpha\,u_{xx}$", r"Yes. The heat equation relates the first time derivative to the second spatial derivative through the diffusivity $\alpha$."),
                W(r"$u_{tt} = c^2\,u_{xx}$", r"That second time derivative is the wave equation. What single time derivative defines the heat equation?"),
                W(r"$u_{xx} + u_{yy} = 0$", r"That is Laplace's equation, with no time at all. What time-dependent equation models heat?"),
                W(r"$u_t = \alpha\,u_x$", r"Diffusion involves the second spatial derivative, not the first. Which spatial derivative appears in the heat equation?"),
            ],
        ),
        item(
            "mp_17WkgjkENV0_2",
            r"The one-dimensional wave equation is which partial differential equation?",
            r"It is second order in both time and space.",
            [
                C(r"$u_{tt} = c^2\,u_{xx}$", r"Yes. The wave equation sets the second time derivative equal to $c^2$ times the second spatial derivative."),
                W(r"$u_t = \alpha\,u_{xx}$", r"A single time derivative gives the heat equation. What time derivative does the wave equation use?"),
                W(r"$u_t + u_x = 0$", r"That first-order transport equation is not the wave equation. What second-order form is correct?"),
                W(r"$u_{xx} + u_{yy} = 0$", r"That steady-state Laplace equation has no time. What time-dependent equation describes waves?"),
            ],
        ),
        item(
            "mp_17WkgjkENV0_3",
            r"Laplace's equation in two dimensions is which equation?",
            r"It is the steady-state equation with no time dependence.",
            [
                C(r"$u_{xx} + u_{yy} = 0$", r"Yes. Laplace's equation sets the sum of the second spatial derivatives to zero, describing steady states."),
                W(r"$u_t = u_{xx} + u_{yy}$", r"That includes time and is a heat (diffusion) equation. What steady equation drops the time term?"),
                W(r"$u_{xx} - u_{yy} = 0$", r"The signs should both be positive in Laplace's equation. What is the correct combination?"),
                W(r"$u_{tt} = u_{xx} + u_{yy}$", r"That is a wave equation in two space dimensions. What time-free equation is Laplace's?"),
            ],
        ),
        item(
            "mp_17WkgjkENV0_4",
            r"Among heat, wave, and Laplace equations, which describes a steady state with no time dependence?",
            r"Steady state means nothing changes in time.",
            [
                C(r"Laplace's equation", r"Yes. Laplace's equation has no time variable and models steady-state (equilibrium) configurations."),
                W(r"The heat equation", r"The heat equation evolves in time toward steady state. Which equation has no time at all?"),
                W(r"The wave equation", r"The wave equation oscillates in time. Which equation is purely steady?"),
                W(r"None of them", r"One of the three is time independent. Which one models the steady state?"),
            ],
        ),
        item(
            "mp_17WkgjkENV0_5",
            r"After finding many separated solutions, how is the initial condition generally satisfied?",
            r"Linear equations let solutions be added, with coefficients from a Fourier expansion.",
            [
                C(r"By superposing the separated modes and choosing coefficients via a Fourier expansion", r"Yes. Summing the eigenmodes and matching the initial data through a Fourier series fixes the coefficients."),
                W(r"By keeping only the first mode", r"A single mode rarely matches arbitrary initial data. What combination of modes is used?"),
                W(r"By multiplying all the modes together", r"Linear superposition adds modes, it does not multiply them. How are they combined?"),
                W(r"By ignoring the initial condition", r"The initial condition must be met. What expansion determines the coefficients?"),
            ],
        ),
    ],
)

# === 18.5 video 1 (single video module) =====================================
add_micro(
    "EW08rD-GFh0",
    'Unit 18, Module 18.5, video 1\n           "Laplacian intuition" (single video module)',
    [
        item(
            "mp_EW08rD-GFh0_1",
            r"In two dimensions, the Laplacian of $u$ is which expression?",
            r"It is the divergence of the gradient, summing the pure second partials.",
            [
                C(r"$\nabla^2 u = u_{xx} + u_{yy}$", r"Yes. The Laplacian sums the unmixed second partial derivatives."),
                W(r"$\nabla^2 u = u_x + u_y$", r"First derivatives form the gradient, not the Laplacian. What second derivatives are summed?"),
                W(r"$\nabla^2 u = u_{xy}$", r"The mixed partial is not the Laplacian. Which pure second partials are added?"),
                W(r"$\nabla^2 u = u_{xx}\,u_{yy}$", r"It is a sum, not a product. What combination of second partials defines it?"),
            ],
        ),
        item(
            "mp_EW08rD-GFh0_2",
            r"Intuitively, the Laplacian at a point measures what?",
            r"It compares the value at the point with the surrounding average.",
            [
                C(r"How the value at a point compares with the average of its neighbors", r"Yes. The Laplacian captures the difference between a point's value and the average of nearby values."),
                W(r"The slope of $u$ in the $x$ direction", r"A single slope is a first derivative. What neighborhood comparison does the Laplacian make?"),
                W(r"The maximum value of $u$ nearby", r"It is a comparison with the average, not the maximum. What average does it use?"),
                W(r"The total integral of $u$", r"It is a local, not global, quantity. What local comparison does it express?"),
            ],
        ),
        item(
            "mp_EW08rD-GFh0_3",
            r"If $\nabla^2 u > 0$ at a point, the value there is generally what relative to its neighbors?",
            r"A positive Laplacian signals a local dip.",
            [
                C(r"Lower than the surrounding average", r"Yes. A positive Laplacian means the point sits below the average of its neighbors."),
                W(r"Higher than the surrounding average", r"That corresponds to a negative Laplacian. What does a positive value indicate?"),
                W(r"Exactly equal to the average", r"Equality corresponds to a zero Laplacian. What does a positive sign indicate?"),
                W(r"Always a maximum", r"A positive Laplacian suggests a dip, not a peak. How does the point compare with neighbors?"),
            ],
        ),
        item(
            "mp_EW08rD-GFh0_4",
            r"A function satisfying $\nabla^2 u = 0$ is called what?",
            r"This is the steady-state Laplace condition.",
            [
                C(r"Harmonic", r"Yes. Functions with zero Laplacian are called harmonic functions."),
                W(r"Periodic", r"Zero Laplacian does not mean periodic. What name describes $\nabla^2 u = 0$?"),
                W(r"Singular", r"Harmonic functions are typically smooth, not singular. What is the term for zero Laplacian?"),
                W(r"Linear", r"Harmonic functions need not be linear. What special name applies when the Laplacian vanishes?"),
            ],
        ),
        item(
            "mp_EW08rD-GFh0_5",
            r"The Laplacian appears as the spatial operator in which of these equations?",
            r"It is the common spatial term across the classical PDEs.",
            [
                C(r"The heat, wave, and Laplace equations", r"Yes. The Laplacian is the shared spatial operator in the heat, wave, and Laplace equations."),
                W(r"Only the heat equation", r"It appears in more than just the heat equation. Which family of equations shares it?"),
                W(r"Only first-order transport equations", r"Those use a first derivative, not the Laplacian. Which second-order equations use it?"),
                W(r"None of the classical PDEs", r"The Laplacian is central to them. Which classical equations contain it?"),
            ],
        ),
    ],
)

# === 18.6 video 1 ===========================================================
add_micro(
    "yK-xFXATzyQ",
    'Unit 18, Module 18.6, video 1\n           "Heat Equation"',
    [
        item(
            "mp_yK-xFXATzyQ_1",
            r"The one-dimensional heat equation is which of these?",
            r"First order in time, second order in space, with a diffusivity constant.",
            [
                C(r"$u_t = k\,u_{xx}$", r"Yes. The heat equation links the first time derivative to the second spatial derivative through the constant $k$."),
                W(r"$u_{tt} = k\,u_{xx}$", r"Two time derivatives give the wave equation. What single time derivative defines heat flow?"),
                W(r"$u_t = k\,u_x$", r"Diffusion uses the second spatial derivative. Which spatial derivative belongs in the heat equation?"),
                W(r"$u_x = k\,u_t$", r"The roles of time and space are reversed here. What is the standard heat equation?"),
            ],
        ),
        item(
            "mp_yK-xFXATzyQ_2",
            r"For a rod with ends held at zero temperature, the separated solution of the heat equation is which series?",
            r"Sine modes in space, decaying exponentials in time.",
            [
                C(r"$u(x,t) = \sum_n b_n \sin\!\frac{n\pi x}{L}\, e^{-k(n\pi/L)^2 t}$", r"Yes. Each sine mode decays in time with rate $k(n\pi/L)^2$, summed against the initial data."),
                W(r"$u(x,t) = \sum_n b_n \sin\!\frac{n\pi x}{L}\, e^{+k(n\pi/L)^2 t}$", r"A growing exponential is unphysical for cooling. What sign should the time exponent have?"),
                W(r"$u(x,t) = \sum_n b_n \cos\!\frac{n\pi x}{L}\, e^{-k(n\pi/L)^2 t}$", r"Zero-temperature ends call for sines, which vanish at the ends. Which spatial function fits?"),
                W(r"$u(x,t) = \sum_n b_n \sin\!\frac{n\pi x}{L}\, \cos\!\frac{n\pi c t}{L}$", r"Oscillating time factors belong to the wave equation. What time behavior does heat flow show?"),
            ],
        ),
        item(
            "mp_yK-xFXATzyQ_3",
            r"In the heat-equation solution, which modes decay fastest in time?",
            r"The decay rate grows with the square of the mode number.",
            [
                C(r"High-frequency modes (large $n$)", r"Yes. Since the decay rate is $k(n\pi/L)^2$, larger $n$ decays faster, smoothing the profile."),
                W(r"Low-frequency modes (small $n$)", r"Small $n$ decays slowest, not fastest. Which modes have the largest decay rate?"),
                W(r"All modes decay at the same rate", r"The rate depends on $n^2$, so it varies. Which modes decay quickest?"),
                W(r"The constant mode decays fastest", r"A constant mode would not decay at all. Which high-$n$ modes vanish soonest?"),
            ],
        ),
        item(
            "mp_yK-xFXATzyQ_4",
            r"As $t \to \infty$ for a rod with zero-temperature ends, the heat-equation solution approaches what?",
            r"Every decaying mode dies out.",
            [
                C(r"Zero everywhere", r"Yes. Each mode decays to zero, so the temperature approaches zero throughout the rod."),
                W(r"A nonzero constant", r"With both ends at zero, no nonzero steady value survives. What limit do the decaying modes give?"),
                W(r"A growing profile", r"The modes decay, they do not grow. What value is approached as $t$ increases?"),
                W(r"A standing oscillation", r"Heat flow decays rather than oscillates. What steady limit results?"),
            ],
        ),
        item(
            "mp_yK-xFXATzyQ_5",
            r"How are the coefficients $b_n$ in the heat-equation solution determined?",
            r"Match the solution at $t = 0$ to the initial temperature.",
            [
                C(r"By expanding the initial temperature distribution in a sine series", r"Yes. Setting $t = 0$ leaves a sine series whose coefficients are the Fourier sine coefficients of the initial data."),
                W(r"By the boundary conditions alone", r"The boundary conditions fix the mode shapes, not the coefficients. What initial data determines $b_n$?"),
                W(r"By the diffusivity constant $k$", r"The constant $k$ sets decay rates, not the coefficients. What expansion of the initial profile gives $b_n$?"),
                W(r"They are all equal to one", r"The coefficients depend on the initial profile. What sine expansion produces them?"),
            ],
        ),
    ],
)

# === 18.6 video 2 ===========================================================
add_micro(
    "6lbSrBmGUik",
    'Unit 18, Module 18.6, video 2\n           "Wave Equation"',
    [
        item(
            "mp_6lbSrBmGUik_1",
            r"The one-dimensional wave equation is which of these?",
            r"It is second order in time, unlike the heat equation.",
            [
                C(r"$u_{tt} = c^2\,u_{xx}$", r"Yes. The wave equation sets the second time derivative equal to $c^2$ times the second spatial derivative."),
                W(r"$u_t = c^2\,u_{xx}$", r"A single time derivative gives the heat equation. What time derivative does the wave equation use?"),
                W(r"$u_{tt} = c\,u_x$", r"The spatial term is a second derivative scaled by $c^2$. What is the correct right side?"),
                W(r"$u_{xx} = c^2\,u_{tt}$ with $c$ a temperature", r"Here $c$ is a wave speed, and the standard form solves for $u_{tt}$. What is the usual arrangement?"),
            ],
        ),
        item(
            "mp_6lbSrBmGUik_2",
            r"For a string fixed at both ends, the time factors of the separated wave solution are which functions?",
            r"With no decay, the time behavior oscillates.",
            [
                C(r"$\cos\!\frac{n\pi c t}{L}$ and $\sin\!\frac{n\pi c t}{L}$", r"Yes. The wave equation gives oscillatory time factors at the modal frequencies, with no decay."),
                W(r"$e^{-k(n\pi/L)^2 t}$", r"Exponential decay belongs to the heat equation. What oscillatory time factors arise for waves?"),
                W(r"$e^{n\pi c t/L}$, a growing exponential", r"Wave modes oscillate rather than grow. What bounded time functions appear?"),
                W(r"A constant in time", r"The modes vibrate in time. What oscillating functions describe them?"),
            ],
        ),
        item(
            "mp_6lbSrBmGUik_3",
            r"In the wave equation $u_{tt} = c^2 u_{xx}$, the constant $c$ represents what?",
            r"It carries units of distance over time.",
            [
                C(r"The wave (propagation) speed", r"Yes. The constant $c$ is the speed at which disturbances travel along the medium."),
                W(r"The thermal diffusivity", r"Diffusivity belongs to the heat equation. What does $c$ measure for waves?"),
                W(r"The amplitude of the wave", r"Amplitude is set by initial data, not by $c$. What rate does $c$ represent?"),
                W(r"The period of oscillation", r"The period depends on $c$ and the mode, but $c$ itself is a speed. What quantity is $c$?"),
            ],
        ),
        item(
            "mp_6lbSrBmGUik_4",
            r"How many initial conditions does the wave equation require, and why?",
            r"It is second order in time.",
            [
                C(r"Two: initial position and initial velocity, since it is second order in time", r"Yes. Being second order in time, the wave equation needs both the initial displacement and the initial velocity."),
                W(r"One: only the initial position", r"A single condition underdetermines a second-order-in-time equation. What second piece of data is needed?"),
                W(r"Zero: the boundary conditions suffice", r"Initial data in time is still required. How many time conditions does second order need?"),
                W(r"Three: position, velocity, and acceleration", r"Acceleration is set by the equation itself. How many independent initial conditions are required?"),
            ],
        ),
        item(
            "mp_6lbSrBmGUik_5",
            r"D'Alembert's solution of the wave equation expresses $u$ as what?",
            r"Two shapes travel in opposite directions at speed $c$.",
            [
                C(r"A sum of left- and right-traveling waves, $f(x - ct) + g(x + ct)$", r"Yes. D'Alembert's form is the superposition of a right-moving wave $f(x - ct)$ and a left-moving wave $g(x + ct)$."),
                W(r"A single decaying exponential in time", r"Decay describes diffusion, not waves. What traveling-wave combination solves it?"),
                W(r"A product $f(x)\,g(t)$ only", r"That separated product is one family of solutions, but d'Alembert's form is different. What traveling waves appear?"),
                W(r"A constant plus a linear term", r"That cannot capture propagation. What pair of traveling waves does d'Alembert use?"),
            ],
        ),
    ],
)

# === 18.6 video 3 ===========================================================
add_micro(
    "BNULJwNPmFk",
    'Unit 18, Module 18.6, video 3\n           "1d wave equation with a forcing function (Duhamel\'s Principle)"',
    [
        item(
            "mp_BNULJwNPmFk_1",
            r"Duhamel's principle is a technique for solving which kind of wave equation?",
            r"It addresses an external driving term on the right-hand side.",
            [
                C(r"The forced (inhomogeneous) wave equation with a source term", r"Yes. Duhamel's principle constructs the response of a forced wave equation from its impulse responses."),
                W(r"Only the homogeneous wave equation", r"The homogeneous case needs no source handling. What kind of equation does Duhamel target?"),
                W(r"Only the steady-state Laplace equation", r"Laplace's equation has no time forcing. Which time-dependent forced equation does Duhamel address?"),
                W(r"Only first-order transport equations", r"Duhamel applies to the second-order forced wave equation. What source-driven equation is it for?"),
            ],
        ),
        item(
            "mp_BNULJwNPmFk_2",
            r"The central idea of Duhamel's principle is to build the forced response by doing what?",
            r"Treat the forcing as a continuous train of impulses and add their effects.",
            [
                C(r"Superposing the responses to impulses applied at each earlier time", r"Yes. The forcing is decomposed into impulses, and their individual responses are integrated over time."),
                W(r"Differentiating the forcing twice", r"Duhamel integrates impulse responses rather than differentiating the source. How are the impulses combined?"),
                W(r"Ignoring the forcing entirely", r"The forcing is exactly what is being handled. How does Duhamel incorporate it?"),
                W(r"Replacing the forcing with a constant", r"The method respects the full time-varying source. How does it accumulate the source's effect?"),
            ],
        ),
        item(
            "mp_BNULJwNPmFk_3",
            r"The full solution of a forced wave equation is written as which combination?",
            r"Add the free response to the response due to the source.",
            [
                C(r"A homogeneous solution plus a particular (forced) solution", r"Yes. As with linear ODEs, the total is the homogeneous solution plus a particular solution driven by the forcing."),
                W(r"Only the particular solution", r"The homogeneous part carries the initial data. What is added to the particular solution?"),
                W(r"Only the homogeneous solution", r"The forcing must contribute a particular part. What is added to the homogeneous solution?"),
                W(r"The product of homogeneous and particular solutions", r"Linear superposition adds the two, it does not multiply. How are they combined?"),
            ],
        ),
        item(
            "mp_BNULJwNPmFk_4",
            r"In the forced wave equation $u_{tt} - c^2 u_{xx} = f(x, t)$, the term $f(x, t)$ represents what?",
            r"It is the term that makes the equation inhomogeneous.",
            [
                C(r"An external forcing (source) term", r"Yes. The function $f(x, t)$ is the external forcing driving the wave equation."),
                W(r"The wave speed", r"The speed is the constant $c$, not $f$. What does the right-hand term represent?"),
                W(r"The initial displacement", r"Initial displacement is initial data, not the right-hand side. What is $f(x, t)$?"),
                W(r"The boundary condition", r"Boundary conditions are imposed separately. What role does $f(x, t)$ play in the equation?"),
            ],
        ),
        item(
            "mp_BNULJwNPmFk_5",
            r"Duhamel's principle relies on which structural property of the wave equation?",
            r"Responses to separate inputs can be added.",
            [
                C(r"Linearity, so responses to separate forcings superpose", r"Yes. Linearity is what lets the responses to individual impulses be summed into the total response."),
                W(r"Nonlinearity of the equation", r"The wave equation here is linear, and that is essential. What property allows superposing impulse responses?"),
                W(r"The absence of boundary conditions", r"Boundary conditions can be present. What structural property underlies Duhamel's method?"),
                W(r"The forcing being constant", r"Duhamel handles time-varying forcing precisely because of one property. Which property is it?"),
            ],
        ),
    ],
)

# ============================================================================
# UNIT 17 MASTERY
# ============================================================================

# --- 17.1 IVP vs BVP --------------------------------------------------------
m17(
    "um_17_1",
    r"What distinguishes a boundary value problem from an initial value problem?",
    r"Consider where the side conditions are imposed.",
    [
        C(r"Conditions are imposed at two different points rather than all at one point", r"Yes. A BVP spreads its conditions across two endpoints, unlike the single-point IVP."),
        W(r"It must be nonlinear", r"Linearity is not the distinction; both kinds can be linear. Where are the conditions placed?"),
        W(r"It is always first order", r"Order is unrelated to this distinction. What about the placement of conditions?"),
        W(r"It has no side conditions", r"A BVP has conditions, just at two ends. How are they distributed compared with an IVP?"),
    ],
)
m17(
    "um_17_2",
    r"A second-order differential equation requires how many side conditions to pin down a particular solution?",
    r"Match the count to the number of arbitrary constants.",
    [
        C(r"Two", r"Yes. Two arbitrary constants require two conditions."),
        W(r"One", r"One leaves a constant unfixed. How many constants does second order carry?"),
        W(r"Four", r"That exceeds the number of constants. How many does second order need?"),
        W(r"None", r"Without conditions the solution stays general. How many are required?"),
    ],
)
m17(
    "um_17_3",
    r"Regarding existence and uniqueness, boundary value problems differ from initial value problems in what way?",
    r"Recall the clean IVP guarantee and whether two endpoints preserve it.",
    [
        C(r"A BVP may have no solution, one solution, or infinitely many", r"Yes. The two-endpoint structure breaks the IVP uniqueness guarantee."),
        W(r"A BVP always has a unique solution", r"That clean guarantee is exactly what fails. What outcomes are possible at two endpoints?"),
        W(r"A BVP never has solutions", r"Many do have solutions. What range of outcomes is possible?"),
        W(r"They behave identically", r"The structures differ in outcomes. How does the BVP differ?"),
    ],
)
m17(
    "um_17_4",
    r"A Dirichlet boundary condition prescribes which quantity, and a Neumann condition prescribes which?",
    r"One fixes the value, the other fixes the slope.",
    [
        C(r"Dirichlet fixes $y$; Neumann fixes $y'$", r"Yes. Dirichlet sets the function value and Neumann sets the derivative at the endpoint."),
        W(r"Dirichlet fixes $y'$; Neumann fixes $y$", r"The roles are reversed here. Which condition names the value itself?"),
        W(r"Both fix $y''$", r"Second derivatives are not what these conditions set. Which derivatives or values do they name?"),
        W(r"Both fix the integral of $y$", r"These are pointwise conditions, not integrals. What does each prescribe at the endpoint?"),
    ],
)
m17(
    "um_17_5",
    r"Steady-state heat conduction in a rod with fixed end temperatures is modeled as which type of problem?",
    r"Conditions sit at the two ends in space.",
    [
        C(r"A boundary value problem", r"Yes. Fixing temperatures at both ends imposes conditions at two points in space."),
        W(r"An initial value problem", r"The conditions are spatial endpoints, not a single starting time. What type is that?"),
        W(r"An unconstrained problem", r"Two fixed end temperatures are real conditions. Where do they sit?"),
        W(r"A purely algebraic problem", r"The model is a differential equation. What kind of conditions does it carry?"),
    ],
)

# --- 17.2 Two-point BVPs ----------------------------------------------------
m17(
    "um_17_6",
    r"Solve $y'' = 0$ with $y(0) = 1$ and $y(2) = 5$.",
    r"The general solution is a line; fit both points.",
    [
        C(r"$y = 1 + 2x$", r"Correct. From $y = c_1 + c_2 x$, $y(0) = 1$ gives $c_1 = 1$, and $y(2) = 1 + 2c_2 = 5$ gives $c_2 = 2$."),
        W(r"$y = 1 + 5x$", r"Check $y(2)$: it must equal $5$, not $11$. What slope makes $y(2) = 5$?"),
        W(r"$y = 5x$", r"This violates $y(0) = 1$. What constant term satisfies the left endpoint?"),
        W(r"$y = x^2 + 1$", r"The solution of $y'' = 0$ is linear, not quadratic. What line fits both points?"),
    ],
)
m17(
    "um_17_7",
    r"What is the standard method for a linear two-point boundary value problem?",
    r"Build the general solution first.",
    [
        C(r"Find the general solution, then impose both boundary conditions", r"Yes. The constants are fixed by applying the two endpoint conditions to the general solution."),
        W(r"Apply the conditions before solving", r"The general solution must come first. What is the proper order?"),
        W(r"Use only one endpoint", r"Both endpoints must be satisfied. What systematic approach uses the general solution?"),
        W(r"Differentiate the boundary data", r"The conditions are applied as given. What do you do with the general solution?"),
    ],
)
m17(
    "um_17_8",
    r"The problem $y'' + y = 0$ with $y(0) = 0$, $y(\pi) = 0$ has how many solutions?",
    r"After $A = 0$, test whether the second condition restricts $B$.",
    [
        C(r"Infinitely many, $y = B\sin x$", r"Yes. $y(0) = 0$ forces $A = 0$, and $\sin\pi = 0$ leaves $B$ free."),
        W(r"Exactly one, $y \equiv 0$", r"The second condition holds for any $B$. What family of nonzero solutions remains?"),
        W(r"None", r"At least the zero solution exists, and more. What does $\sin\pi = 0$ allow?"),
        W(r"Exactly two", r"The constant $B$ is unrestricted. How many values can it take?"),
    ],
)
m17(
    "um_17_9",
    r"A homogeneous boundary value problem $y'' + \lambda y = 0$, $y(0) = y(L) = 0$ always admits which solution?",
    r"Consider the identically zero function.",
    [
        C(r"The trivial solution $y \equiv 0$", r"Yes. The zero function satisfies the equation and both conditions for every $\lambda$."),
        W(r"A unique nonzero solution", r"Nonzero solutions appear only at eigenvalues. What always works?"),
        W(r"No solution", r"The zero function always solves it. What is that solution?"),
        W(r"A nonzero constant", r"A nonzero constant cannot vanish at the ends. What trivial solution fits?"),
    ],
)
m17(
    "um_17_10",
    r"Solve $y'' = 2$ with $y(0) = 0$ and $y(1) = 0$.",
    r"Integrate twice to get $y = x^2 + c_1 x + c_2$, then apply the endpoints.",
    [
        C(r"$y = x^2 - x$", r"Correct. $y = x^2 + c_1 x + c_2$ with $y(0) = 0$ gives $c_2 = 0$, and $y(1) = 1 + c_1 = 0$ gives $c_1 = -1$."),
        W(r"$y = x^2$", r"This gives $y(1) = 1 \neq 0$. What linear term makes $y(1) = 0$?"),
        W(r"$y = x^2 + x$", r"Then $y(1) = 2$, not $0$. What sign should the linear coefficient have?"),
        W(r"$y = 2x$", r"That solves $y'' = 0$, not $y'' = 2$. What quadratic results from integrating twice?"),
    ],
)

# --- 17.3 Eigenvalues and eigenfunctions ------------------------------------
m17(
    "um_17_11",
    r"For $y'' + \lambda y = 0$, $y(0) = y(L) = 0$, the eigenvalues are which?",
    r"Sine must vanish at $x = L$.",
    [
        C(r"$\lambda_n = (n\pi/L)^2$, $n = 1, 2, 3, \dots$", r"Correct. Requiring $\sin(\sqrt{\lambda}\,L) = 0$ gives $\lambda_n = (n\pi/L)^2$."),
        W(r"$\lambda_n = n\pi/L$", r"You must square $\sqrt{\lambda}\,L = n\pi$. What is $\lambda$ itself?"),
        W(r"$\lambda_n = -(n\pi/L)^2$", r"Negative values give only the trivial solution. What sign gives oscillation?"),
        W(r"$\lambda_n = (n\pi)^2$", r"The length $L$ must appear. How does $L$ enter the formula?"),
    ],
)
m17(
    "um_17_12",
    r"The eigenfunctions of $y'' + \lambda y = 0$, $y(0) = y(L) = 0$ are which?",
    r"They vanish at both ends.",
    [
        C(r"$\sin(n\pi x/L)$", r"Correct. These sines are zero at $x = 0$ and $x = L$."),
        W(r"$\cos(n\pi x/L)$", r"Cosine is nonzero at $x = 0$. Which function vanishes at both ends?"),
        W(r"$e^{nx}$", r"Exponentials cannot meet zero conditions at both ends. What oscillatory function does?"),
        W(r"$x^n$", r"Powers do not vanish at $x = L$ in general. What sine fits?"),
    ],
)
m17(
    "um_17_13",
    r"For $L = \pi$, the eigenvalues of $y'' + \lambda y = 0$, $y(0) = y(\pi) = 0$ are which numbers?",
    r"Set $L = \pi$ in $(n\pi/L)^2$.",
    [
        C(r"$\lambda_n = n^2$", r"Correct. With $L = \pi$ the factors of $\pi$ cancel, leaving $n^2$."),
        W(r"$\lambda_n = n$", r"The formula squares the index. What is $(n\pi/\pi)^2$?"),
        W(r"$\lambda_n = \pi^2 n^2$", r"The $\pi$ cancels when $L = \pi$. What remains?"),
        W(r"$\lambda_n = 2n$", r"There is no factor of $2$. What does $n^2$ give?"),
    ],
)
m17(
    "um_17_14",
    r"For Neumann conditions $y'(0) = y'(L) = 0$, the eigenfunctions of $y'' + \lambda y = 0$ are which?",
    r"The derivative must vanish at both ends, and a constant mode is allowed.",
    [
        C(r"$\cos(n\pi x/L)$, $n = 0, 1, 2, \dots$", r"Correct. Cosines have zero slope at both ends, and $n = 0$ gives the constant mode."),
        W(r"$\sin(n\pi x/L)$", r"Sine has nonzero slope at $x = 0$. Which function has zero derivative there?"),
        W(r"$x^n$", r"Powers do not satisfy zero-slope conditions. What pure cosine works?"),
        W(r"$e^{-nx}$", r"Exponentials fail the slope conditions. What oscillatory function fits?"),
    ],
)
m17(
    "um_17_15",
    r"As the mode number $n$ grows, the eigenvalues $\lambda_n = (n\pi/L)^2$ behave how?",
    r"Track the growth of $n^2$.",
    [
        C(r"They increase without bound", r"Yes. Growing like $n^2$, the eigenvalues tend to infinity."),
        W(r"They approach a finite limit", r"There is no ceiling on $n^2$. Which direction do they go?"),
        W(r"They decrease to zero", r"Larger $n$ makes them larger. Which way do they move?"),
        W(r"They alternate in sign", r"They are all positive here. What single trend do they follow?"),
    ],
)

# --- 17.4 Shooting method ---------------------------------------------------
m17(
    "um_17_16",
    r"The shooting method converts a boundary value problem into what?",
    r"It guesses the missing starting datum.",
    [
        C(r"An initial value problem with a guessed initial slope", r"Yes. It guesses the missing initial slope and integrates as an IVP."),
        W(r"A partial differential equation", r"No new variable is introduced. What single-point problem replaces the BVP?"),
        W(r"A purely algebraic system", r"Integration is still required. What initial-value problem does it solve?"),
        W(r"A Fourier series", r"Shooting uses IVP integration, not Fourier expansion. What problem form does it create?"),
    ],
)
m17(
    "um_17_17",
    r"In the shooting method, the guessed initial slope is adjusted until what holds?",
    r"You want the far-end condition met.",
    [
        C(r"The solution matches the far boundary condition", r"Yes. The slope is tuned until the integrated solution hits the target at the far end."),
        W(r"The solution becomes constant", r"A constant solution is not the goal. What far-end requirement is enforced?"),
        W(r"The differential equation changes", r"The equation is fixed. What endpoint condition must be satisfied?"),
        W(r"The interval length changes", r"The interval is given. What boundary value is matched?"),
    ],
)
m17(
    "um_17_18",
    r"For a linear boundary value problem, how many shots determine the exact initial slope?",
    r"Linear dependence on the guess means a straight-line fit.",
    [
        C(r"Two, followed by linear interpolation", r"Yes. The endpoint depends linearly on the guess, so two shots fix it exactly."),
        W(r"One", r"One point is not enough to interpolate a line. How many points are needed?"),
        W(r"Infinitely many", r"Linearity makes it finite. How many define the line?"),
        W(r"It cannot be found by shooting", r"Linear problems are the easiest case for shooting. How many shots suffice?"),
    ],
)
m17(
    "um_17_19",
    r"With $F(s) = y(b; s) - \beta$ the boundary mismatch, the shooting method seeks what?",
    r"You want the mismatch to vanish.",
    [
        C(r"A root $F(s) = 0$", r"Yes. The guess that makes the endpoint error zero solves the problem."),
        W(r"A maximum of $F(s)$", r"You want zero error, not a maximum. What value of $F$ is sought?"),
        W(r"The derivative $F'(s) = 0$", r"You drive $F$ itself to zero, not its derivative. What condition is the goal?"),
        W(r"A constant value of $F$", r"The mismatch should vanish, not merely stay constant. What root is sought?"),
    ],
)
m17(
    "um_17_20",
    r"A key practical benefit of the shooting method is that it lets you reuse what?",
    r"It builds on well-tested one-point machinery.",
    [
        C(r"Robust initial value problem integrators such as Runge-Kutta", r"Yes. Each shot is an IVP integration, reusing mature solvers."),
        W(r"Closed-form solution formulas", r"Closed forms are usually unavailable. What numerical machinery is reused?"),
        W(r"Tables of Fourier coefficients", r"No Fourier table is needed. What solvers does shooting rely on?"),
        W(r"Matrix eigenvalue routines", r"Eigenvalue routines are a different approach. What IVP tools does shooting reuse?"),
    ],
)

# --- 17.5 Orthogonal functions ----------------------------------------------
m17(
    "um_17_21",
    r"The inner product of functions $f$ and $g$ on $[a, b]$ is which expression?",
    r"It integrates the product of the two functions.",
    [
        C(r"$\int_a^b f(x) g(x)\,dx$", r"Yes. The function inner product integrates the product over the interval."),
        W(r"$f(b) g(b) - f(a) g(a)$", r"That is a boundary difference. What integral defines the inner product?"),
        W(r"$\int_a^b (f + g)\,dx$", r"You multiply, not add. What integrand appears?"),
        W(r"$f(a)/g(a)$", r"A pointwise quotient is not an inner product. What integral of a product is used?"),
    ],
)
m17(
    "um_17_22",
    r"Two functions are orthogonal on $[a, b]$ when which quantity is zero?",
    r"It is the function analog of perpendicular vectors.",
    [
        C(r"Their inner product $\int_a^b f g\,dx$", r"Yes. Orthogonality means the integral of the product vanishes."),
        W(r"Their sum", r"A zero sum makes them negatives, not orthogonal. What integral vanishes?"),
        W(r"Their product at every point", r"The product need not vanish pointwise, only its integral. What integral is zero?"),
        W(r"Their values at the endpoints", r"Endpoint values are unrelated. What integral must equal zero?"),
    ],
)
m17(
    "um_17_23",
    r"For $m \neq n$, what is $\int_0^L \sin(n\pi x/L)\sin(m\pi x/L)\,dx$, and what is it for $m = n$?",
    r"Distinct modes are orthogonal; a mode against itself gives the squared norm.",
    [
        C(r"$0$ for $m \neq n$ and $L/2$ for $m = n$", r"Correct. The sine modes are orthogonal, with self inner product $L/2$."),
        W(r"$0$ for both cases", r"The $m = n$ case is nonzero. What is the self inner product?"),
        W(r"$L$ for both cases", r"Distinct modes give zero. What does orthogonality say for $m \neq n$?"),
        W(r"$L/2$ for $m \neq n$ and $0$ for $m = n$", r"The cases are reversed. Which case gives zero?"),
    ],
)
m17(
    "um_17_24",
    r"The set $\{1, \cos x, \sin x, \cos 2x, \sin 2x, \dots\}$ on $[-\pi, \pi]$ has which property?",
    r"Every distinct pair integrates to zero against each other.",
    [
        C(r"It is an orthogonal set", r"Yes. Every distinct pair is orthogonal on $[-\pi, \pi]$, the foundation of Fourier series."),
        W(r"It is linearly dependent", r"These functions are independent. What stronger relation holds?"),
        W(r"Each pair has inner product $1$", r"Distinct pairs integrate to zero, not one. What is that called?"),
        W(r"It spans only constants", r"The set reaches far beyond constants. What orthogonality property holds?"),
    ],
)
m17(
    "um_17_25",
    r"Why does orthogonality make computing series coefficients easy?",
    r"Integrating against one basis function isolates its coefficient.",
    [
        C(r"Each coefficient is found independently by one inner product", r"Yes. Orthogonality decouples the coefficients, each from a single inner product."),
        W(r"It makes all the basis functions equal", r"They remain distinct. What does orthogonality let you compute term by term?"),
        W(r"It eliminates all integration", r"Coefficients still come from integrals. What does orthogonality decouple?"),
        W(r"It forces a finite number of terms", r"Series may be infinite. What computational simplification does it give?"),
    ],
)

# --- 17.6 Sturm-Liouville theory --------------------------------------------
m17(
    "um_17_26",
    r"The standard Sturm-Liouville form of a second-order equation is which?",
    r"It collects the leading term as a single derivative of $p y'$.",
    [
        C(r"$\big(p(x) y'\big)' + \big(q(x) + \lambda w(x)\big)y = 0$", r"Yes. The self-adjoint form uses $(p y')'$ with a weight $w$ multiplying $\lambda$."),
        W(r"$p(x) y'' + \lambda y = q(x)$", r"The leading term must be $(p y')'$, not $p y''$. What self-adjoint form is standard?"),
        W(r"$y' = \lambda w(x) y$", r"A first-order form misses the structure. What second-order form is used?"),
        W(r"$y'' = \lambda^2 y$", r"That is a narrow special case. What general $p$, $q$, $w$ form is standard?"),
    ],
)
m17(
    "um_17_27",
    r"For a regular Sturm-Liouville problem, the eigenvalues are guaranteed to be what?",
    r"The self-adjoint structure rules out complex values.",
    [
        C(r"Real", r"Yes. Self-adjointness forces all eigenvalues to be real."),
        W(r"Always complex", r"The structure forbids genuinely complex eigenvalues. What must they be?"),
        W(r"Always zero", r"They are generally nonzero and varied. What property is guaranteed?"),
        W(r"Always negative", r"They need not be negative. What is guaranteed about them?"),
    ],
)
m17(
    "um_17_28",
    r"Eigenfunctions of a Sturm-Liouville problem for distinct eigenvalues are orthogonal with respect to what?",
    r"A weight function enters the inner product.",
    [
        C(r"The weight function $w(x)$", r"Yes. They are orthogonal under the weighted inner product with weight $w$."),
        W(r"No weight at all", r"The orthogonality is weighted by $w$. Which function provides the weight?"),
        W(r"The coefficient $p(x)$ alone", r"The weight in the inner product is $w$, not $p$. Which function weights the orthogonality?"),
        W(r"The eigenvalue $\lambda$", r"The eigenvalue is not the weight. What function $w$ defines the inner product?"),
    ],
)
m17(
    "um_17_29",
    r"Writing $y'' + \lambda y = 0$ in Sturm-Liouville form uses which functions?",
    r"Match $(p y')'$ to a plain $y''$.",
    [
        C(r"$p = 1$, $q = 0$, $w = 1$", r"Correct. With $p = 1$ the term $(p y')' = y''$, and $q = 0$, $w = 1$ recover the equation."),
        W(r"$p = 0$, $q = 1$, $w = 1$", r"If $p = 0$ the second-derivative term disappears. What $p$ gives $y''$?"),
        W(r"$p = x$, $q = 0$, $w = 1$", r"A nonconstant $p$ adds a $y'$ term. What constant $p$ works?"),
        W(r"$p = 1$, $q = \lambda$, $w = 0$", r"With $w = 0$ the eigenvalue term vanishes. Which function multiplies $\lambda$?"),
    ],
)
m17(
    "um_17_30",
    r"A central payoff of Sturm-Liouville theory is that its eigenfunctions form what?",
    r"They can represent broad classes of functions.",
    [
        C(r"A complete basis for eigenfunction (generalized Fourier) expansions", r"Yes. The eigenfunctions are complete, enabling expansions of general functions."),
        W(r"A finite set spanning only polynomials", r"The set is infinite and richer than polynomials. What expansion power do they have?"),
        W(r"A basis only for constants", r"They represent far more than constants. What completeness do they possess?"),
        W(r"A set that represents no functions", r"They represent broad function classes. What basis property do they have?"),
    ],
)

# ============================================================================
# UNIT 18 MASTERY
# ============================================================================

# --- 18.1 Fourier intuition -------------------------------------------------
m18(
    "um_18_1",
    r"A Fourier series represents a periodic function as a sum of what?",
    r"Think of the integer-multiple-frequency building-block waves.",
    [
        C(r"Sines and cosines of integer-multiple frequencies", r"Yes. The series sums harmonics whose frequencies are integer multiples of a fundamental."),
        W(r"Powers of $x$", r"Powers belong to a power series. What oscillating functions does Fourier use?"),
        W(r"A single sine wave", r"One wave cannot capture a general shape. What collection of waves is summed?"),
        W(r"Exponentials with random frequencies", r"The frequencies are integer multiples, not random. What waves are used?"),
    ],
)
m18(
    "um_18_2",
    r"Why does a square wave require infinitely many Fourier terms?",
    r"Smooth finite sums stay smooth.",
    [
        C(r"Its sharp jumps cannot be matched exactly by any finite sum of smooth sinusoids", r"Yes. Discontinuities require infinitely many harmonics to approach."),
        W(r"Because it is not periodic", r"A square wave is periodic. What feature demands an infinite series?"),
        W(r"Because sines are not periodic", r"Sines are periodic. What property of the square wave forces infinitely many terms?"),
        W(r"Because each term has the same frequency", r"The harmonics have distinct frequencies. What jump feature forces an infinite series?"),
    ],
)
m18(
    "um_18_3",
    r"The Fourier transform decomposes a non-periodic signal into what?",
    r"It reports a continuum of frequency content.",
    [
        C(r"A continuous spectrum of frequencies", r"Yes. The transform gives a continuous distribution over frequency."),
        W(r"A finite list of harmonics", r"A discrete harmonic list is the series picture. What continuum does the transform give?"),
        W(r"A single frequency", r"Even a dominant frequency sits in a full spectrum. What continuous object results?"),
        W(r"A polynomial in time", r"The output is in frequency, not a time polynomial. What spectrum results?"),
    ],
)
m18(
    "um_18_4",
    r"When is a Fourier series used instead of a Fourier transform?",
    r"Series handle one periodicity class, transforms the other.",
    [
        C(r"For periodic signals", r"Yes. Series represent periodic signals; the transform suits non-periodic ones."),
        W(r"For non-periodic signals", r"Those are the transform's domain. Which class does the series serve?"),
        W(r"For constant signals only", r"Constants are a trivial case. What periodicity does the series require?"),
        W(r"For signals defined only at integers", r"That is a discrete tool. What kind of signals does the series represent?"),
    ],
)
m18(
    "um_18_5",
    r"In a Fourier transform spectrum, a strongly present frequency appears as what?",
    r"A strong match makes the detector respond sharply.",
    [
        C(r"A peak at that frequency", r"Yes. A present frequency produces a pronounced spectral peak."),
        W(r"A zero at that frequency", r"A present frequency gives a large response. What feature marks it?"),
        W(r"A flat spectrum", r"Flatness means no dominant frequency. What localized feature appears?"),
        W(r"A discontinuity in time", r"The feature lives in frequency. What does a present frequency produce there?"),
    ],
)

# --- 18.2 Computing Fourier series ------------------------------------------
m18(
    "um_18_6",
    r"For a function of period $2L$, the cosine coefficient $a_n$ is given by which formula?",
    r"Project $f$ onto the matching cosine, normalized by $L$.",
    [
        C(r"$a_n = \frac{1}{L}\int_{-L}^{L} f(x)\cos\!\frac{n\pi x}{L}\,dx$", r"Correct. Each cosine coefficient is the inner product of $f$ with $\cos(n\pi x/L)$, normalized by $L$."),
        W(r"$a_n = \frac{1}{L}\int_{-L}^{L} f(x)\sin\!\frac{n\pi x}{L}\,dx$", r"That projects onto sine, giving $b_n$. Which trig function pairs with $a_n$?"),
        W(r"$a_n = \int_{-L}^{L} f(x)\,dx$", r"The harmonic factor and normalization are missing. What integrand gives $a_n$?"),
        W(r"$a_n = f(n\pi/L)$", r"Coefficients are integrals, not point values. What integral defines $a_n$?"),
    ],
)
m18(
    "um_18_7",
    r"The average value of a function over one period equals which part of its Fourier series?",
    r"Sinusoids average to zero over a period.",
    [
        C(r"The constant term $a_0/2$", r"Correct. All harmonics average to zero, leaving $a_0/2$ as the mean."),
        W(r"The coefficient $b_1$", r"Sinusoids average to zero. What constant term survives?"),
        W(r"The largest coefficient", r"Size does not set the average. What term remains after averaging?"),
        W(r"Always zero", r"The mean is zero only if $a_0 = 0$. What term equals the average in general?"),
    ],
)
m18(
    "um_18_8",
    r"For an odd function on $[-L, L]$, which Fourier coefficients vanish?",
    r"Cosine is even; an odd function has no overlap with it.",
    [
        C(r"All cosine coefficients $a_n$, including $a_0$", r"Correct. An odd function is orthogonal to every cosine, leaving only sine terms."),
        W(r"All sine coefficients $b_n$", r"Sine matches an odd function, so they survive. Which family vanishes?"),
        W(r"Only $a_0$", r"Every cosine coefficient vanishes, not just $a_0$. Which whole family disappears?"),
        W(r"None of them", r"Parity forces half to vanish. Which family goes to zero for an odd function?"),
    ],
)
m18(
    "um_18_9",
    r"The Fourier series of $f(x) = x^2$ on $[-\pi, \pi]$ contains which terms?",
    r"Determine the parity of $x^2$.",
    [
        C(r"A constant and cosine terms only", r"Correct. Since $x^2$ is even, the sine terms vanish."),
        W(r"Sine terms only", r"Sines vanish for an even function. What terms survive?"),
        W(r"Equal sine and cosine terms", r"The odd sine terms drop out. Which terms remain?"),
        W(r"No terms", r"A nonzero function has a nonzero series. Which terms does an even function keep?"),
    ],
)
m18(
    "um_18_10",
    r"At a jump discontinuity, the Fourier series converges to which value?",
    r"It splits the difference between the one-sided limits.",
    [
        C(r"The midpoint of the left and right limits", r"Correct. The series converges to the average of the one-sided limits at a jump."),
        W(r"The left-hand limit only", r"It does not favor one side. What average does it take?"),
        W(r"The larger limit", r"It is not the maximum. What average value results?"),
        W(r"Zero", r"The value is generally nonzero. What average of the side limits does it pick?"),
    ],
)

# --- 18.3 Fourier series for DEs --------------------------------------------
m18(
    "um_18_11",
    r"A half-range sine series represents a function on $[0, L]$ using which extension?",
    r"Sines are odd.",
    [
        C(r"The odd periodic extension", r"Yes. An odd extension produces a pure sine series."),
        W(r"The even periodic extension", r"Even extension gives cosines. What parity yields sines?"),
        W(r"A constant extension", r"That does not produce sine harmonics. What odd extension does?"),
        W(r"No extension", r"A specific extension builds the series. Which odd one gives sines?"),
    ],
)
m18(
    "um_18_12",
    r"A sine series suits a heat problem with which boundary conditions?",
    r"Sine vanishes at both ends.",
    [
        C(r"Fixed zero temperature at both ends", r"Yes. Sines vanish at the ends, matching Dirichlet conditions."),
        W(r"Insulated ends", r"Insulated ends suit cosines. What conditions do sines match?"),
        W(r"No boundary conditions", r"The choice depends on the conditions. Which do sines satisfy?"),
        W(r"A fixed slope at both ends", r"Sines match fixed values, not slopes. What conditions do they satisfy?"),
    ],
)
m18(
    "um_18_13",
    r"A cosine series suits a problem with which boundary conditions?",
    r"Cosine has zero slope at both ends.",
    [
        C(r"Insulated ends, $u_x(0) = u_x(L) = 0$", r"Yes. Cosines have vanishing derivative at the ends, matching Neumann conditions."),
        W(r"Fixed zero temperature at both ends", r"Fixed values suit sines. What slope conditions do cosines match?"),
        W(r"A fixed value at one end only", r"Cosine series handle symmetric slope conditions. Which derivatives vanish?"),
        W(r"Periodic conditions only", r"Half-range cosine series target Neumann conditions. Which conditions do they satisfy?"),
    ],
)
m18(
    "um_18_14",
    r"The overshoot of a Fourier partial sum near a jump is called what?",
    r"It is a famous named artifact.",
    [
        C(r"The Gibbs phenomenon", r"Yes. The persistent overshoot near a jump is the Gibbs phenomenon."),
        W(r"The Runge phenomenon", r"That concerns polynomial interpolation. What is the Fourier overshoot called?"),
        W(r"Resonance", r"Resonance is a forcing effect. What name fits the jump overshoot?"),
        W(r"Aliasing", r"Aliasing is a sampling effect. What is the named overshoot near a jump?"),
    ],
)
m18(
    "um_18_15",
    r"The half-range sine coefficients are given by which formula?",
    r"Project onto $\sin(n\pi x/L)$ over $[0, L]$ with factor $2/L$.",
    [
        C(r"$b_n = \frac{2}{L}\int_0^L f(x)\sin\!\frac{n\pi x}{L}\,dx$", r"Correct. The half-range sine coefficient integrates over $[0, L]$ with the factor $2/L$."),
        W(r"$b_n = \frac{1}{L}\int_0^L f(x)\sin\!\frac{n\pi x}{L}\,dx$", r"The half-range convention uses $2/L$. What prefactor is correct?"),
        W(r"$b_n = \frac{2}{L}\int_0^L f(x)\cos\!\frac{n\pi x}{L}\,dx$", r"Sine coefficients pair with sine. Which function belongs in the integrand?"),
        W(r"$b_n = \frac{2}{L}\int_{-L}^L f(x)\sin\!\frac{n\pi x}{L}\,dx$", r"The half-range integral runs over $[0, L]$. What limits are correct?"),
    ],
)

# --- 18.4 Separable PDEs ----------------------------------------------------
m18(
    "um_18_16",
    r"Separation of variables seeks a solution of which form?",
    r"Split the dependence on each variable into its own factor.",
    [
        C(r"$u(x, t) = X(x)\,T(t)$, a product", r"Yes. The solution is assumed to factor into a function of $x$ times a function of $t$."),
        W(r"$u(x, t) = X(x) + T(t)$, a sum", r"Separation uses a product. How are the factors combined?"),
        W(r"$u(x, t) = X(x)\,T(x)$", r"One factor must depend on $t$. Which variables do the factors use?"),
        W(r"$u(x, t) = X(t)\,T(x)$", r"Each factor should carry its own variable. What is the correct product?"),
    ],
)
m18(
    "um_18_17",
    r"After substituting $u = X T$ and dividing, each side depends on one variable. What follows?",
    r"A function of $x$ equal to a function of $t$ for all values must be constant.",
    [
        C(r"Both sides equal a common separation constant", r"Yes. Independence forces both sides to equal a shared constant."),
        W(r"Both sides equal zero", r"They share a constant, not necessarily zero. What common value do they take?"),
        W(r"The variables become dependent", r"They stay independent yet equal. What must each side be?"),
        W(r"The equation has no solution", r"Separation succeeds here. What shared quantity appears?"),
    ],
)
m18(
    "um_18_18",
    r"Separation of variables turns one PDE into what?",
    r"Each single-variable factor obeys its own equation.",
    [
        C(r"Two ordinary differential equations", r"Yes. One ODE for $X(x)$ and one for $T(t)$ result."),
        W(r"A larger PDE", r"Separation reduces the problem. What simpler equations result?"),
        W(r"A single algebraic equation", r"Derivatives remain, so they are differential. How many ODEs appear?"),
        W(r"An integral equation", r"No integral equation arises. What kind of equations result?"),
    ],
)
m18(
    "um_18_19",
    r"In the separated heat equation, the spatial part $X(x)$ with its boundary conditions forms what?",
    r"The separation constant becomes a quantized eigenvalue.",
    [
        C(r"A boundary value eigenvalue problem", r"Yes. The spatial ODE plus boundary conditions is an eigenvalue problem selecting the separation constants."),
        W(r"An initial value problem", r"The spatial part carries boundary conditions, not initial data. What problem does $X$ solve?"),
        W(r"A purely algebraic identity", r"Spatial derivatives remain. What boundary-condition problem does $X$ satisfy?"),
        W(r"A nonlinear system", r"The separated spatial equation is linear. What linear eigenvalue problem results?"),
    ],
)
m18(
    "um_18_20",
    r"After finding many separated modes, how is an arbitrary initial condition matched?",
    r"Linearity allows adding modes with Fourier coefficients.",
    [
        C(r"By superposing the modes and choosing coefficients via a Fourier expansion", r"Yes. Summing eigenmodes and matching the initial data through a Fourier series fixes the coefficients."),
        W(r"By keeping only the first mode", r"A single mode rarely matches arbitrary data. What combination is used?"),
        W(r"By multiplying the modes together", r"Superposition adds modes. How are they combined?"),
        W(r"By ignoring the initial condition", r"The initial condition must be met. What expansion sets the coefficients?"),
    ],
)

# --- 18.5 The Laplacian -----------------------------------------------------
m18(
    "um_18_21",
    r"In two dimensions, the Laplacian of $u$ is which expression?",
    r"It sums the unmixed second partial derivatives.",
    [
        C(r"$u_{xx} + u_{yy}$", r"Yes. The Laplacian sums the pure second partials."),
        W(r"$u_x + u_y$", r"First derivatives form the gradient. What second derivatives are summed?"),
        W(r"$u_{xy}$", r"The mixed partial is not the Laplacian. Which pure second partials add?"),
        W(r"$u_{xx}\,u_{yy}$", r"It is a sum, not a product. What combination defines it?"),
    ],
)
m18(
    "um_18_22",
    r"The Laplacian at a point measures what intuitively?",
    r"It compares a point with the average of its neighbors.",
    [
        C(r"How the value compares with the average of nearby values", r"Yes. The Laplacian captures the difference between a point and its neighborhood average."),
        W(r"The slope in the $x$ direction", r"A slope is a first derivative. What neighborhood comparison does it make?"),
        W(r"The maximum nearby value", r"It compares with the average, not the maximum. What average does it use?"),
        W(r"The total integral of $u$", r"It is local, not global. What local comparison does it express?"),
    ],
)
m18(
    "um_18_23",
    r"A function satisfying $\nabla^2 u = 0$ is called what?",
    r"This is the steady-state Laplace condition.",
    [
        C(r"Harmonic", r"Yes. Functions with zero Laplacian are harmonic."),
        W(r"Periodic", r"Zero Laplacian does not mean periodic. What term applies?"),
        W(r"Singular", r"Harmonic functions are typically smooth. What is the term for zero Laplacian?"),
        W(r"Linear", r"Harmonic functions need not be linear. What special name applies?"),
    ],
)
m18(
    "um_18_24",
    r"If $\nabla^2 u > 0$ at a point, the value there is generally what relative to neighbors?",
    r"A positive Laplacian signals a local dip.",
    [
        C(r"Lower than the surrounding average", r"Yes. A positive Laplacian means the point sits below its neighborhood average."),
        W(r"Higher than the average", r"That is a negative Laplacian. What does a positive value indicate?"),
        W(r"Equal to the average", r"Equality is a zero Laplacian. What does a positive sign indicate?"),
        W(r"Always a maximum", r"A positive value suggests a dip, not a peak. How does it compare with neighbors?"),
    ],
)
m18(
    "um_18_25",
    r"The Laplacian is the shared spatial operator in which equations?",
    r"It is common to the classical second-order PDEs.",
    [
        C(r"The heat, wave, and Laplace equations", r"Yes. All three classical PDEs use the Laplacian as their spatial operator."),
        W(r"Only the heat equation", r"It appears in more than the heat equation. Which family shares it?"),
        W(r"Only first-order transport equations", r"Those use a first derivative. Which second-order equations use it?"),
        W(r"None of the classical PDEs", r"It is central to them. Which classical equations contain it?"),
    ],
)

# --- 18.6 Heat and wave equations -------------------------------------------
m18(
    "um_18_26",
    r"The one-dimensional heat equation is which of these?",
    r"First order in time, second in space.",
    [
        C(r"$u_t = k\,u_{xx}$", r"Yes. The heat equation links the first time derivative to the second spatial derivative."),
        W(r"$u_{tt} = c^2\,u_{xx}$", r"Two time derivatives give the wave equation. What single time derivative defines heat?"),
        W(r"$u_{xx} + u_{yy} = 0$", r"That is Laplace's equation. What time-dependent equation models heat?"),
        W(r"$u_t = k\,u_x$", r"Diffusion uses the second spatial derivative. Which derivative belongs in the heat equation?"),
    ],
)
m18(
    "um_18_27",
    r"The one-dimensional wave equation is which of these?",
    r"Second order in both time and space.",
    [
        C(r"$u_{tt} = c^2\,u_{xx}$", r"Yes. The wave equation equates the second time derivative to $c^2$ times the second spatial derivative."),
        W(r"$u_t = k\,u_{xx}$", r"A single time derivative gives the heat equation. What time derivative does the wave equation use?"),
        W(r"$u_t + u_x = 0$", r"That first-order transport equation is not the wave equation. What second-order form is correct?"),
        W(r"$u_{xx} + u_{yy} = 0$", r"That steady Laplace equation has no time. What time-dependent equation describes waves?"),
    ],
)
m18(
    "um_18_28",
    r"For a heated rod with zero-temperature ends, the separated solution has which time behavior?",
    r"The time factor decays for diffusion.",
    [
        C(r"Exponential decay, $e^{-k(n\pi/L)^2 t}$", r"Yes. Each mode decays exponentially at a rate set by $k(n\pi/L)^2$."),
        W(r"Oscillation, $\cos(n\pi c t/L)$", r"Oscillation belongs to the wave equation. What time behavior does diffusion show?"),
        W(r"Exponential growth", r"Cooling does not grow. What sign does the time exponent carry?"),
        W(r"A constant in time", r"The modes change in time. What decaying behavior occurs?"),
    ],
)
m18(
    "um_18_29",
    r"How many initial conditions does the wave equation need, and why?",
    r"It is second order in time.",
    [
        C(r"Two: initial position and initial velocity, since it is second order in time", r"Yes. Being second order in time, it needs both initial displacement and initial velocity."),
        W(r"One: only the initial position", r"That underdetermines second order. What second datum is needed?"),
        W(r"Zero: boundary conditions suffice", r"Initial data in time is still required. How many time conditions are needed?"),
        W(r"Three", r"Acceleration is set by the equation. How many independent initial conditions are required?"),
    ],
)
m18(
    "um_18_30",
    r"D'Alembert's solution of the wave equation expresses $u$ as what?",
    r"Two shapes travel in opposite directions at speed $c$.",
    [
        C(r"A sum of traveling waves, $f(x - ct) + g(x + ct)$", r"Yes. It superposes a right-moving wave $f(x - ct)$ and a left-moving wave $g(x + ct)$."),
        W(r"A single decaying exponential", r"Decay describes diffusion, not waves. What traveling-wave combination solves it?"),
        W(r"A product $f(x)\,g(t)$ only", r"That separated form is different from d'Alembert's. What traveling waves appear?"),
        W(r"A constant plus a linear term", r"That cannot capture propagation. What traveling waves does d'Alembert use?"),
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
    unit_new = (emit_unit_block(UNIT17_TITLE, MASTERY_17) + ",\n\n"
                + emit_unit_block(UNIT18_TITLE, MASTERY_18))
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
    data["unit_mastery"][UNIT17_TITLE] = [strip_item(it) for it in MASTERY_17]
    data["unit_mastery"][UNIT18_TITLE] = [strip_item(it) for it in MASTERY_18]

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
    for it in MASTERY_17 + MASTERY_18:
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
    assert len(MICRO) == 24, "expected 24 micro videos, got %d" % len(MICRO)
    assert len(MASTERY_17) == 30, "Unit 17 mastery not 30 items, got %d" % len(MASTERY_17)
    assert len(MASTERY_18) == 30, "Unit 18 mastery not 30 items, got %d" % len(MASTERY_18)
    one_correct(MASTERY_17, "mastery17")
    one_correct(MASTERY_18, "mastery18")
    for it in MASTERY_17 + MASTERY_18:
        assert it["id"] not in seen_ids, "duplicate id %s" % it["id"]
        seen_ids.add(it["id"])

    if bad:
        for where, s in bad:
            print("[!] FORBIDDEN CHAR in", where, "->", s)
        raise SystemExit("Validation failed: forbidden characters present")
    print("[+] validation passed: %d micro videos, %d + %d mastery items, copy rules OK"
          % (len(MICRO), len(MASTERY_17), len(MASTERY_18)))


if __name__ == "__main__":
    validate()
    update_js()
    update_json()
    print("[+] Unit 17 and Unit 18 quiz generation complete")
