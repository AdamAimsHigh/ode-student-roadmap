#!/usr/bin/env python3
"""
Generate Unit 15 (Systems of Linear Differential Equations) and Unit 16 (Phase
Plane Analysis and Nonlinear Dynamics) interactive quizzes in a single batch.

Authors the 26 video micro-practice quizzes (five items each) and the two 30
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
Vectors are written as tuples like (1, 0).
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS_PATH = os.path.join(ROOT, "app", "js", "quiz-data.js")
JSON_PATH = os.path.join(ROOT, "app", "data", "quizzes.json")

UNIT15_TITLE = "Unit 15: Systems of Linear Differential Equations"
UNIT16_TITLE = "Unit 16: Phase Plane Analysis and Nonlinear Dynamics"


def C(text, rationale):
    return {"text": text, "correct": True, "rationale": rationale}


def W(text, rationale):
    return {"text": text, "rationale": rationale}


def item(qid, prompt, hint, options):
    return {"id": qid, "prompt": prompt, "hint": hint, "answerOptions": options}


MICRO = []  # list of (video_id, comment_line, [items])


def add_micro(video_id, comment, items):
    MICRO.append((video_id, comment, items))


MASTERY_15 = []
MASTERY_16 = []


def m15(qid, prompt, hint, options):
    MASTERY_15.append(item(qid, prompt, hint, options))


def m16(qid, prompt, hint, options):
    MASTERY_16.append(item(qid, prompt, hint, options))


# ============================================================================
# CONTENT  (inserted above the machinery marker)
# ============================================================================

# ============================================================================
# UNIT 15 MICRO PRACTICE
# ============================================================================

# === 15.1 video 1 ===========================================================
add_micro(
    "cq3bPBePE8E",
    'Unit 15, Module 15.1, video 1\n           "Converting a Higher Order ODE Into a System of First Order ODEs"',
    [
        item(
            "mp_cq3bPBePE8E_1",
            r"To convert $y'' + 3y' + 2y = 0$ into a first-order system, what is the standard choice of new variables?",
            r"Name one variable for the function and one for its first derivative.",
            [
                C(r"$x_1 = y$ and $x_2 = y'$", r"Yes. Letting $x_1 = y$ and $x_2 = y'$ turns one second-order equation into two first-order ones."),
                W(r"$x_1 = y'$ and $x_2 = y''$", r"The lowest variable should be $y$ itself, not its derivative. What captures the function and its first derivative?"),
                W(r"$x_1 = y$ and $x_2 = y''$", r"You skip a derivative this way, leaving a gap. Which consecutive derivatives should the variables track?"),
                W(r"$x_1 = 3y$ and $x_2 = 2y'$", r"No scaling of the unknowns is needed. What are the plain choices for the function and its first derivative?"),
            ],
        ),
        item(
            "mp_cq3bPBePE8E_2",
            r"With $x_1 = y$ and $x_2 = y'$ for $y'' + 3y' + 2y = 0$, what is $x_2'$?",
            r"Solve the original equation for $y''$ and rewrite it in the new variables.",
            [
                C(r"$x_2' = -2x_1 - 3x_2$", r"Correct. Since $y'' = -2y - 3y'$, we get $x_2' = -2x_1 - 3x_2$."),
                W(r"$x_2' = 2x_1 + 3x_2$", r"Move both terms across the equals sign from $y'' + 3y' + 2y = 0$. What signs result?"),
                W(r"$x_2' = -3x_1 - 2x_2$", r"Match coefficients carefully: $2y$ goes with $x_1$ and $3y'$ with $x_2$. Which coefficient multiplies $x_1$?"),
                W(r"$x_2' = x_1$", r"That ignores the original equation entirely. What does solving for $y''$ give?"),
            ],
        ),
        item(
            "mp_cq3bPBePE8E_3",
            r"An $n$-th order linear ODE converts into a first-order system of how many equations?",
            r"Each derivative up to order $n-1$ becomes its own variable.",
            [
                C(r"$n$ equations", r"Yes. The variables $y, y', \dots, y^{(n-1)}$ give exactly $n$ first-order equations."),
                W(r"$n - 1$ equations", r"Count the variables from $y$ up through $y^{(n-1)}$. How many is that?"),
                W(r"$2n$ equations", r"Each derivative becomes one variable, not two. How many derivatives below order $n$ are there, including $y$?"),
                W(r"Always $2$ equations", r"Only a second-order ODE gives two. What is the count for general order $n$?"),
            ],
        ),
        item(
            "mp_cq3bPBePE8E_4",
            r"Writing the system for $y'' + 3y' + 2y = 0$ as $\mathbf{x}' = A\mathbf{x}$, what are the rows of $A$?",
            r"The first row encodes $x_1' = x_2$; the second encodes $x_2' = -2x_1 - 3x_2$.",
            [
                C(r"Rows $(0, 1)$ and $(-2, -3)$", r"Correct. $x_1' = x_2$ gives row $(0,1)$, and $x_2' = -2x_1 - 3x_2$ gives row $(-2,-3)$."),
                W(r"Rows $(1, 0)$ and $(-2, -3)$", r"The equation $x_1' = x_2$ has no $x_1$ term. What is the first row?"),
                W(r"Rows $(0, 1)$ and $(2, 3)$", r"The constants move across with a sign flip. What signs do $-2$ and $-3$ carry?"),
                W(r"Rows $(0, 1)$ and $(-3, -2)$", r"The coefficient of $x_1$ comes from $2y$, and of $x_2$ from $3y'$. Which goes first?"),
            ],
        ),
        item(
            "mp_cq3bPBePE8E_5",
            r"Why do we convert higher-order equations into first-order systems?",
            r"Think about which solution machinery is built for first-order vector equations.",
            [
                C(r"So matrix and eigenvalue methods and standard numerical solvers can be applied", r"Yes. The first-order form $\mathbf{x}' = A\mathbf{x}$ unlocks linear-algebra solution methods and standard solvers."),
                W(r"Because higher-order equations have no solutions", r"They do have solutions; conversion is about technique, not existence. What does the system form let us use?"),
                W(r"To reduce the number of unknown functions", r"Conversion increases the number of unknowns, not reduces it. What is the real benefit?"),
                W(r"Because first-order systems are always linear", r"Systems can be nonlinear too. What solution tools does the first-order form enable?"),
            ],
        ),
    ],
)

# === 15.1 video 2 ===========================================================
add_micro(
    "_yXKdyjzMBI",
    'Unit 15, Module 15.1, video 2\n           "Changing Higher Order ODEs and Systems of ODEs as First Order Systems"',
    [
        item(
            "mp__yXKdyjzMBI_1",
            r"Convert $y'' = -y$ to a first-order system with $x_1 = y$, $x_2 = y'$. What is the system?",
            r"The first equation is always $x_1' = x_2$; substitute for $y''$ in the second.",
            [
                C(r"$x_1' = x_2$ and $x_2' = -x_1$", r"Correct. With $y'' = -y = -x_1$, the system is $x_1' = x_2$, $x_2' = -x_1$."),
                W(r"$x_1' = x_2$ and $x_2' = x_1$", r"The equation says $y'' = -y$, with a minus sign. What sign does $x_1$ carry in $x_2'$?"),
                W(r"$x_1' = -x_2$ and $x_2' = -x_1$", r"The definition $x_1' = y' = x_2$ has no minus. What is the correct first equation?"),
                W(r"$x_1' = -x_1$ and $x_2' = -x_2$", r"That decouples the variables incorrectly. How are $x_1'$ and $x_2'$ actually related to the other variable?"),
            ],
        ),
        item(
            "mp__yXKdyjzMBI_2",
            r"For the third-order equation $y''' = y$, how many first-order equations does the system have?",
            r"Introduce a variable for $y$, $y'$, and $y''$.",
            [
                C(r"Three", r"Yes. The variables $x_1 = y$, $x_2 = y'$, $x_3 = y''$ give three first-order equations."),
                W(r"Two", r"A third-order equation needs variables up through $y''$. How many is that?"),
                W(r"Four", r"You stop at the variable for $y''$, one below order three. How many variables is that?"),
                W(r"Six", r"Each derivative becomes a single variable, not two. How many derivatives below order three are there, counting $y$?"),
            ],
        ),
        item(
            "mp__yXKdyjzMBI_3",
            r"In the system for $y''' = y$ with $x_1 = y$, $x_2 = y'$, $x_3 = y''$, what is $x_3'$?",
            r"$x_3 = y''$, so $x_3' = y'''$; use the original equation.",
            [
                C(r"$x_3' = x_1$", r"Correct. Since $y''' = y = x_1$, we have $x_3' = x_1$."),
                W(r"$x_3' = x_3$", r"The equation is $y''' = y$, not $y''' = y''$. Which variable equals $y$?"),
                W(r"$x_3' = x_2$", r"The right side is $y$, which is $x_1$, not $y' = x_2$. What does $y'''$ equal?"),
                W(r"$x_3' = -x_1$", r"The equation $y''' = y$ has no minus sign. What is the sign of $x_1$ here?"),
            ],
        ),
        item(
            "mp__yXKdyjzMBI_4",
            r"A system of two coupled second-order equations converts to a first-order system of what size?",
            r"Each second-order equation contributes two variables.",
            [
                C(r"Four first-order equations", r"Yes. Two functions and their two first derivatives give four variables, hence four equations."),
                W(r"Two first-order equations", r"That would only cover the functions, not their derivatives. How many variables total?"),
                W(r"Three first-order equations", r"Each second-order equation needs two variables, and there are two of them. What is the total?"),
                W(r"Eight first-order equations", r"Each function needs only two variables, not four. What is two functions times two?"),
            ],
        ),
        item(
            "mp__yXKdyjzMBI_5",
            r"After conversion, the first-order system is written most compactly in which form?",
            r"Collect the variables into a vector and the coefficients into a matrix.",
            [
                C(r"$\mathbf{x}' = A\mathbf{x}$, a vector equation", r"Yes. Stacking the variables into $\mathbf{x}$ and the coefficients into $A$ gives the compact form $\mathbf{x}' = A\mathbf{x}$."),
                W(r"$y = e^{rx}$, a single exponential", r"That is a trial solution, not the system form. How are the variables and coefficients packaged?"),
                W(r"A single $n$-th order scalar equation", r"Conversion goes the other way, from scalar to system. What compact vector form results?"),
                W(r"$\det(A) = 0$, a scalar condition", r"That is a determinant condition, not the system itself. What matrix-vector equation describes it?"),
            ],
        ),
    ],
)

# === 15.2 video 1 ===========================================================
add_micro(
    "Pkw8QEt0Nm4",
    'Unit 15, Module 15.2, video 1\n           "Basics of the eigenvalue method (solving a system of ODEs)"',
    [
        item(
            "mp_Pkw8QEt0Nm4_1",
            r"To solve $\mathbf{x}' = A\mathbf{x}$, what trial solution does the eigenvalue method use?",
            r"Guess an exponential in time times a fixed direction vector.",
            [
                C(r"$\mathbf{x} = e^{\lambda t}\mathbf{v}$ for a constant vector $\mathbf{v}$", r"Yes. Trying $\mathbf{x} = e^{\lambda t}\mathbf{v}$ turns the system into an algebraic eigenvalue problem."),
                W(r"$\mathbf{x} = e^{\lambda t}$, a scalar", r"The unknown is a vector, so a direction is needed. What vector multiplies the exponential?"),
                W(r"$\mathbf{x} = t^\lambda \mathbf{v}$", r"The constant-coefficient system calls for an exponential in $t$, not a power. What is the time factor?"),
                W(r"$\mathbf{x} = \lambda e^{t}\mathbf{v}$", r"The eigenvalue belongs in the exponent, not as a front coefficient. Where does $\lambda$ appear?"),
            ],
        ),
        item(
            "mp_Pkw8QEt0Nm4_2",
            r"Substituting $\mathbf{x} = e^{\lambda t}\mathbf{v}$ into $\mathbf{x}' = A\mathbf{x}$ reduces it to which equation?",
            r"Differentiate the trial, cancel the nonzero scalar $e^{\lambda t}$.",
            [
                C(r"$A\mathbf{v} = \lambda\mathbf{v}$", r"Yes. After cancelling $e^{\lambda t}$, the system becomes the eigenvalue equation $A\mathbf{v} = \lambda\mathbf{v}$."),
                W(r"$A\mathbf{v} = 0$", r"The derivative of $e^{\lambda t}\mathbf{v}$ brings down a factor $\lambda$. What does the left side become?"),
                W(r"$\lambda A\mathbf{v} = \mathbf{v}$", r"The factor $\lambda$ comes from differentiating the exponential and lands on $\mathbf{v}$. Which side carries $\lambda$?"),
                W(r"$A\mathbf{v} = \lambda^2 \mathbf{v}$", r"Only one derivative is taken, so one factor of $\lambda$ appears. What power of $\lambda$ is correct?"),
            ],
        ),
        item(
            "mp_Pkw8QEt0Nm4_3",
            r"The eigenvalues of $A$ are found by solving which equation?",
            r"Nontrivial eigenvectors require the matrix $A - \lambda I$ to be singular.",
            [
                C(r"$\det(A - \lambda I) = 0$", r"Yes. A nonzero eigenvector exists only when $A - \lambda I$ is singular, that is, $\det(A - \lambda I) = 0$."),
                W(r"$\det(A) = \lambda$", r"The determinant of $A$ alone is not the characteristic equation. What matrix must be singular?"),
                W(r"$A - \lambda I = 0$", r"The matrix need not be the zero matrix, only singular. What scalar condition expresses singularity?"),
                W(r"$\text{tr}(A) = \lambda$", r"The trace gives the sum of eigenvalues, not the defining equation. What determinant condition is solved?"),
            ],
        ),
        item(
            "mp_Pkw8QEt0Nm4_4",
            r"For real distinct eigenvalues $\lambda_1, \lambda_2$ with eigenvectors $\mathbf{v}_1, \mathbf{v}_2$, the general solution of $\mathbf{x}' = A\mathbf{x}$ is what?",
            r"Superpose the two exponential mode solutions.",
            [
                C(r"$\mathbf{x} = c_1 e^{\lambda_1 t}\mathbf{v}_1 + c_2 e^{\lambda_2 t}\mathbf{v}_2$", r"Yes. Each eigenpair gives a mode, and the general solution is their linear combination."),
                W(r"$\mathbf{x} = c_1 e^{\lambda_1 t} + c_2 e^{\lambda_2 t}$", r"The eigenvectors give each mode its direction. What vectors must multiply the exponentials?"),
                W(r"$\mathbf{x} = e^{\lambda_1 t}\mathbf{v}_1 \, e^{\lambda_2 t}\mathbf{v}_2$", r"Modes are added, not multiplied. How are the two solutions combined?"),
                W(r"$\mathbf{x} = c_1 \mathbf{v}_1 + c_2 \mathbf{v}_2$", r"Without the exponentials there is no time dependence. What time factor accompanies each eigenvector?"),
            ],
        ),
        item(
            "mp_Pkw8QEt0Nm4_5",
            r"For the diagonal matrix $A$ with rows $(2, 0)$ and $(0, 3)$, what are the eigenvalues?",
            r"For a diagonal matrix the eigenvalues sit on the diagonal.",
            [
                C(r"$2$ and $3$", r"Correct. A diagonal matrix has its diagonal entries as eigenvalues."),
                W(r"$0$ and $0$", r"The off-diagonal zeros are not the eigenvalues. Which entries carry them?"),
                W(r"$5$ and $6$", r"You need not add or multiply the entries. What are the diagonal values themselves?"),
                W(r"$2$ and $0$", r"Read both diagonal entries, top-left and bottom-right. What is the second one?"),
            ],
        ),
    ],
)

# === 15.2 video 2 ===========================================================
add_micro(
    "Zwb5eiYcL8w",
    'Unit 15, Module 15.2, video 2\n           "Solving Systems of Differential Equations with Eigenvalues and Eigenvectors"',
    [
        item(
            "mp_Zwb5eiYcL8w_1",
            r"For $A$ with rows $(0, 1)$ and $(-2, -3)$, the characteristic equation is which of these?",
            r"Compute $\det(A - \lambda I)$ using $\lambda^2 - (\text{tr})\lambda + \det$.",
            [
                C(r"$\lambda^2 + 3\lambda + 2 = 0$", r"Correct. The trace is $-3$ and the determinant is $2$, giving $\lambda^2 + 3\lambda + 2 = 0$."),
                W(r"$\lambda^2 - 3\lambda + 2 = 0$", r"The trace is $-3$, so $-(\text{tr})$ is $+3$. What is the middle coefficient?"),
                W(r"$\lambda^2 + 3\lambda - 2 = 0$", r"The determinant $(0)(-3) - (1)(-2)$ is positive. What constant term results?"),
                W(r"$\lambda^2 + 2\lambda + 3 = 0$", r"The trace and determinant are swapped. Which is the coefficient of $\lambda$?"),
            ],
        ),
        item(
            "mp_Zwb5eiYcL8w_2",
            r"The roots of $\lambda^2 + 3\lambda + 2 = 0$ are which eigenvalues?",
            r"Factor the quadratic.",
            [
                C(r"$\lambda = -1$ and $\lambda = -2$", r"Correct. $(\lambda + 1)(\lambda + 2) = 0$ gives $\lambda = -1, -2$."),
                W(r"$\lambda = 1$ and $\lambda = 2$", r"Both roots are negative here. What signs make $(\lambda + 1)(\lambda + 2) = 0$?"),
                W(r"$\lambda = -1$ and $\lambda = 2$", r"Check the factor $(\lambda + 2)$. What value of $\lambda$ makes it zero?"),
                W(r"$\lambda = -3$ and $\lambda = -2$", r"The sum of the roots equals $-3$, not each root. What pair sums to $-3$ and multiplies to $2$?"),
            ],
        ),
        item(
            "mp_Zwb5eiYcL8w_3",
            r"For the matrix with rows $(2, 1)$ and $(1, 2)$, find the eigenvector for $\lambda = 3$.",
            r"Solve $(A - 3I)\mathbf{v} = 0$ with rows $(-1, 1)$ and $(1, -1)$.",
            [
                C(r"$(1, 1)$", r"Correct. The row $(-1, 1)$ gives $-v_1 + v_2 = 0$, so $v_1 = v_2$, for example $(1, 1)$."),
                W(r"$(1, -1)$", r"The equation $-v_1 + v_2 = 0$ forces the components to be equal. What sign relation holds?"),
                W(r"$(0, 1)$", r"Both components must satisfy $v_1 = v_2$, so neither is zero. What equal-component vector works?"),
                W(r"$(2, 1)$", r"The eigenvector solves $v_1 = v_2$, not the matrix row itself. What vector has equal components?"),
            ],
        ),
        item(
            "mp_Zwb5eiYcL8w_4",
            r"For $A$ with rows $(1, 1)$ and $(0, 2)$ (upper triangular), what are the eigenvalues?",
            r"For a triangular matrix the eigenvalues are the diagonal entries.",
            [
                C(r"$1$ and $2$", r"Correct. A triangular matrix has its diagonal entries as eigenvalues, here $1$ and $2$."),
                W(r"$1$ and $1$", r"Read both diagonal entries, not just the first. What is the bottom-right value?"),
                W(r"$0$ and $1$", r"The off-diagonal entry is $0$, but the eigenvalues come from the diagonal. What are those entries?"),
                W(r"$3$ and $-1$", r"No combining is needed for a triangular matrix. What sits on the diagonal?"),
            ],
        ),
        item(
            "mp_Zwb5eiYcL8w_5",
            r"After finding eigenpairs $(\lambda_1, \mathbf{v}_1)$ and $(\lambda_2, \mathbf{v}_2)$, the constants $c_1, c_2$ are determined by what?",
            r"Use the data given at the starting time.",
            [
                C(r"The initial condition $\mathbf{x}(0)$", r"Yes. Substituting $t = 0$ and matching $\mathbf{x}(0)$ fixes the constants $c_1$ and $c_2$."),
                W(r"The eigenvalues alone", r"Eigenvalues set the modes, not the specific constants. What extra data pins down $c_1, c_2$?"),
                W(r"The determinant of $A$", r"The determinant is a single number, not enough to fix two constants. What initial data is used?"),
                W(r"Nothing; they are always $1$", r"The constants depend on the problem. What condition determines their values?"),
            ],
        ),
    ],
)

# === 15.3 video 1 ===========================================================
add_micro(
    "N8bpFOndEQU",
    'Unit 15, Module 15.3, video 1\n           "Solving Systems of Differential Equations that Involve Complex Eigenvalues"',
    [
        item(
            "mp_N8bpFOndEQU_1",
            r"For $A$ with rows $(0, 1)$ and $(-1, 0)$, what are the eigenvalues?",
            r"The characteristic equation is $\lambda^2 + 1 = 0$.",
            [
                C(r"$\lambda = \pm i$", r"Correct. $\lambda^2 + 1 = 0$ gives the pure imaginary pair $\lambda = \pm i$."),
                W(r"$\lambda = \pm 1$", r"Solve $\lambda^2 + 1 = 0$, not $\lambda^2 - 1 = 0$. What are the roots of $\lambda^2 = -1$?"),
                W(r"$\lambda = 0$ (repeated)", r"The constant term is $1$, not $0$, so the roots are nonzero. What solves $\lambda^2 = -1$?"),
                W(r"$\lambda = \pm 2i$", r"The equation is $\lambda^2 = -1$, not $\lambda^2 = -4$. What is the square root of $-1$?"),
            ],
        ),
        item(
            "mp_N8bpFOndEQU_2",
            r"Complex eigenvalues of a real matrix always occur in what configuration?",
            r"A real characteristic polynomial forces a symmetry on its complex roots.",
            [
                C(r"In conjugate pairs $\alpha \pm \beta i$", r"Yes. Real coefficients force complex roots to come in conjugate pairs."),
                W(r"As a single isolated complex number", r"A real polynomial cannot have just one complex root. What partner must accompany it?"),
                W(r"As two purely real numbers", r"If they are complex, they are not real. What pairing does a real polynomial require?"),
                W(r"As four roots at once", r"A $2 \times 2$ matrix has two eigenvalues. How are a complex pair related?"),
            ],
        ),
        item(
            "mp_N8bpFOndEQU_3",
            r"Using $e^{(\alpha + \beta i)t}$, Euler's formula expands the time factor into which real functions?",
            r"Recall $e^{i\theta} = \cos\theta + i\sin\theta$.",
            [
                C(r"$e^{\alpha t}\cos(\beta t)$ and $e^{\alpha t}\sin(\beta t)$", r"Yes. Euler's formula gives $e^{\alpha t}(\cos\beta t + i\sin\beta t)$, whose parts are these real solutions."),
                W(r"$e^{\alpha t}$ and $e^{\beta t}$", r"The imaginary part of the exponent produces oscillation, not a second real exponential. What trig functions appear?"),
                W(r"$\cos(\alpha t)$ and $\sin(\alpha t)$", r"The real part $\alpha$ sets the exponential growth, while $\beta$ sets the oscillation. Which part goes inside the trig functions?"),
                W(r"$t\cos(\beta t)$ and $t\sin(\beta t)$", r"A factor of $t$ appears only for repeated roots. What multiplies the trig functions here?"),
            ],
        ),
        item(
            "mp_N8bpFOndEQU_4",
            r"Two real, linearly independent solutions are built from a complex solution $\mathbf{x}(t)$ by taking what?",
            r"A complex solution splits into two real pieces.",
            [
                C(r"Its real part and its imaginary part", r"Yes. The real and imaginary parts of one complex solution are two independent real solutions."),
                W(r"Its magnitude and its phase", r"Magnitude and phase do not separately solve the system. What two parts of a complex number are extracted?"),
                W(r"Its conjugate and its inverse", r"The inverse is not a solution here. What real components come directly from a complex number?"),
                W(r"Two copies of its real part", r"Two identical pieces cannot be independent. What second part supplies independence?"),
            ],
        ),
        item(
            "mp_N8bpFOndEQU_5",
            r"For eigenvalues $\alpha \pm \beta i$ with $\alpha < 0$, the trajectories in the phase plane do what?",
            r"The real part controls growth or decay; the imaginary part controls rotation.",
            [
                C(r"Spiral inward toward the origin", r"Yes. A negative real part causes decay while the imaginary part rotates, so trajectories spiral inward."),
                W(r"Spiral outward away from the origin", r"Outward spirals need a positive real part. What does $\alpha < 0$ do to the amplitude?"),
                W(r"Form closed loops around the origin", r"Closed loops require $\alpha = 0$. What does a strictly negative $\alpha$ add?"),
                W(r"Move along straight lines", r"Straight-line motion comes from real eigenvalues. What does a nonzero imaginary part create?"),
            ],
        ),
    ],
)

# === 15.3 video 2 ===========================================================
add_micro(
    "TRVS5Wo9LoM",
    'Unit 15, Module 15.3, video 2\n           "Linear Systems: Complex Roots, MIT 18.03SC"',
    [
        item(
            "mp_TRVS5Wo9LoM_1",
            r"For complex eigenvalues $\alpha \pm \beta i$, what does the sign of the real part $\alpha$ determine?",
            r"It controls the envelope $e^{\alpha t}$ multiplying the oscillation.",
            [
                C(r"Whether the spiral grows or decays in amplitude", r"Yes. The factor $e^{\alpha t}$ grows when $\alpha > 0$ and decays when $\alpha < 0$."),
                W(r"The frequency of the oscillation", r"Frequency is set by the imaginary part $\beta$. What does the real part $\alpha$ control instead?"),
                W(r"The direction of rotation", r"Rotation direction comes from the eigenvector structure, not the sign of $\alpha$. What does $\alpha$ govern?"),
                W(r"The number of equilibria", r"The number of equilibria is fixed by the system, not by $\alpha$. What growth feature does $\alpha$ set?"),
            ],
        ),
        item(
            "mp_TRVS5Wo9LoM_2",
            r"For complex eigenvalues $\alpha \pm \beta i$, what does the imaginary part $\beta$ determine?",
            r"It sits inside the cosine and sine of the solution.",
            [
                C(r"The angular frequency of the oscillation", r"Yes. The term $\beta$ appears in $\cos(\beta t)$ and $\sin(\beta t)$, setting the oscillation rate."),
                W(r"The rate of exponential decay", r"Decay is governed by the real part $\alpha$. What does $\beta$ control inside the trig functions?"),
                W(r"The location of the equilibrium", r"The equilibrium is the origin for $\mathbf{x}' = A\mathbf{x}$. What does $\beta$ set in the solution?"),
                W(r"The size of the eigenvectors", r"Eigenvectors can be scaled freely. What oscillatory feature does $\beta$ fix?"),
            ],
        ),
        item(
            "mp_TRVS5Wo9LoM_3",
            r"When the eigenvalues are purely imaginary ($\alpha = 0$, $\lambda = \pm \beta i$), the trajectories are what?",
            r"With no growth or decay envelope, the oscillation neither grows nor shrinks.",
            [
                C(r"Closed ellipses around the origin (a center)", r"Yes. With $\alpha = 0$ the amplitude is constant, so trajectories are closed orbits forming a center."),
                W(r"Inward spirals (a stable spiral)", r"Inward spirals need $\alpha < 0$. What happens when $\alpha$ is exactly $0$?"),
                W(r"Straight lines through the origin", r"Straight lines come from real eigenvalues. What shape does pure oscillation trace?"),
                W(r"A single fixed point with no motion", r"The solutions still oscillate when $\beta \neq 0$. What closed shape do they trace?"),
            ],
        ),
        item(
            "mp_TRVS5Wo9LoM_4",
            r"For $A$ with rows $(-1, -1)$ and $(1, -1)$, the eigenvalues are $-1 \pm i$. The origin is what kind of equilibrium?",
            r"Combine the sign of the real part with the presence of an imaginary part.",
            [
                C(r"A stable spiral (spiral sink)", r"Yes. The negative real part gives decay and the imaginary part gives rotation, so it is a stable spiral."),
                W(r"An unstable spiral (spiral source)", r"Unstable spirals need a positive real part. What does the real part $-1$ indicate?"),
                W(r"A center", r"A center requires zero real part. What does the nonzero real part $-1$ change?"),
                W(r"A saddle", r"Saddles arise from real eigenvalues of opposite sign, not complex ones. What do complex eigenvalues with $\alpha < 0$ give?"),
            ],
        ),
        item(
            "mp_TRVS5Wo9LoM_5",
            r"Why is only one eigenvector (for one of the two conjugate eigenvalues) needed to build the real general solution?",
            r"The two conjugate eigenpairs carry the same information.",
            [
                C(r"The conjugate eigenpair gives no new real solutions beyond the real and imaginary parts of the first", r"Yes. The conjugate yields the same two real solutions, so one complex eigenpair suffices."),
                W(r"Because the second eigenvalue has no eigenvector", r"It does have one, the conjugate vector. Why is it not needed separately?"),
                W(r"Because the second eigenvalue is always zero", r"Both eigenvalues are nonzero complex conjugates. What makes the second eigenpair redundant?"),
                W(r"Because complex systems have only one solution", r"A second-order system has two independent solutions. Where do both come from using one eigenpair?"),
            ],
        ),
    ],
)

# === 15.4 video 1 ===========================================================
add_micro(
    "O85OWBJ2ayo",
    'Unit 15, Module 15.4, video 1\n           "How (and why) to raise e to the power of a matrix, DE6"',
    [
        item(
            "mp_O85OWBJ2ayo_1",
            r"How is the matrix exponential $e^{At}$ defined?",
            r"It mimics the scalar exponential power series, with $A$ in place of a number.",
            [
                C(r"$e^{At} = I + At + \frac{(At)^2}{2!} + \frac{(At)^3}{3!} + \cdots$", r"Yes. The matrix exponential is the same power series as the scalar one, summing powers of $At$ over factorials."),
                W(r"$e^{At} = I + At$", r"That keeps only the first two terms. What infinite series defines the full exponential?"),
                W(r"$e^{At} = A\,e^{t}$", r"You cannot factor the matrix out of the exponential like that. What series sums powers of $At$?"),
                W(r"$e^{At} = \det(A)\,e^{t}$", r"The determinant is not how the matrix exponential is built. What power series is used?"),
            ],
        ),
        item(
            "mp_O85OWBJ2ayo_2",
            r"The solution of $\mathbf{x}' = A\mathbf{x}$ with $\mathbf{x}(0) = \mathbf{x}_0$ is given by what?",
            r"It mirrors the scalar solution $x = e^{at}x_0$.",
            [
                C(r"$\mathbf{x}(t) = e^{At}\mathbf{x}_0$", r"Yes. Just as $x = e^{at}x_0$ solves the scalar case, $\mathbf{x} = e^{At}\mathbf{x}_0$ solves the system."),
                W(r"$\mathbf{x}(t) = e^{At} + \mathbf{x}_0$", r"The initial vector is multiplied, not added. How does $e^{At}$ act on $\mathbf{x}_0$?"),
                W(r"$\mathbf{x}(t) = A e^{t}\mathbf{x}_0$", r"The matrix belongs in the exponent, not as a separate factor. What is the correct form?"),
                W(r"$\mathbf{x}(t) = e^{t}\mathbf{x}_0$", r"A scalar exponential ignores the matrix structure. What exponential carries $A$?"),
            ],
        ),
        item(
            "mp_O85OWBJ2ayo_3",
            r"What is $e^{At}$ evaluated at $t = 0$?",
            r"Substitute $t = 0$ into the defining series.",
            [
                C(r"The identity matrix $I$", r"Yes. At $t = 0$ every term past the first vanishes, leaving $e^{A \cdot 0} = I$."),
                W(r"The zero matrix", r"The leading term of the series is $I$, not $0$. What remains when $t = 0$?"),
                W(r"The matrix $A$", r"The first term is $I$; the $A$ term carries a factor $t$ that vanishes. What is left?"),
                W(r"$1$ (the scalar one)", r"The result is a matrix, not a scalar. Which matrix does the series reduce to at $t = 0$?"),
            ],
        ),
        item(
            "mp_O85OWBJ2ayo_4",
            r"What is the derivative $\frac{d}{dt}e^{At}$?",
            r"Differentiate the power series term by term, just like the scalar case.",
            [
                C(r"$A\,e^{At}$", r"Yes. Term-by-term differentiation gives $\frac{d}{dt}e^{At} = A e^{At}$, the matrix analog of $\frac{d}{dt}e^{at} = a e^{at}$."),
                W(r"$e^{At}$", r"Differentiating the scalar $e^{at}$ brings down a factor $a$; the matrix case brings down $A$. What multiplies $e^{At}$?"),
                W(r"$t\,e^{At}$", r"No extra factor of $t$ appears. What constant matrix factor results from differentiating?"),
                W(r"$A^2 e^{At}$", r"Only one factor of $A$ is brought down by a single derivative. What is the coefficient?"),
            ],
        ),
        item(
            "mp_O85OWBJ2ayo_5",
            r"For the decoupled system $x' = 2x$, $y' = 3y$ (diagonal $A$), what is $e^{At}$?",
            r"A diagonal matrix exponentiates entrywise on the diagonal.",
            [
                C(r"The diagonal matrix with entries $e^{2t}$ and $e^{3t}$", r"Yes. For a diagonal matrix each diagonal entry $d$ becomes $e^{dt}$."),
                W(r"The diagonal matrix with entries $2e^{t}$ and $3e^{t}$", r"The diagonal entries go into the exponent, not in front. What are $e^{2t}$ and $e^{3t}$?"),
                W(r"The diagonal matrix with entries $e^{2}$ and $e^{3}$", r"The variable $t$ must appear in the exponent. What are the time-dependent entries?"),
                W(r"The diagonal matrix with entries $2t$ and $3t$", r"Exponentiation, not multiplication, is required. What does $e^{dt}$ give for $d = 2, 3$?"),
            ],
        ),
    ],
)

# === 15.4 video 2 ===========================================================
add_micro(
    "LwSk9M5lJx4",
    'Unit 15, Module 15.4, video 2\n           "The Matrix Exponential"',
    [
        item(
            "mp_LwSk9M5lJx4_1",
            r"If $A$ is diagonalizable as $A = PDP^{-1}$, then $e^{At}$ equals which expression?",
            r"Conjugation passes through the power series term by term.",
            [
                C(r"$P\,e^{Dt}\,P^{-1}$", r"Yes. Each power $A^n = PD^nP^{-1}$, so the whole series gives $e^{At} = P e^{Dt} P^{-1}$."),
                W(r"$P^{-1} e^{Dt} P$", r"The factors must match the order in $A = PDP^{-1}$. Which factor comes first?"),
                W(r"$e^{Dt}$ alone", r"The change-of-basis matrices do not disappear. What surrounds $e^{Dt}$?"),
                W(r"$P\,D\,e^{t}\,P^{-1}$", r"The diagonal matrix belongs inside the exponential as $e^{Dt}$. What is the correct middle factor?"),
            ],
        ),
        item(
            "mp_LwSk9M5lJx4_2",
            r"The identity $e^{(A+B)t} = e^{At}e^{Bt}$ holds under what condition?",
            r"Matrix multiplication is not generally commutative.",
            [
                C(r"When $A$ and $B$ commute, $AB = BA$", r"Yes. The exponential product rule requires the matrices to commute."),
                W(r"For all square matrices $A$ and $B$", r"Order matters for matrices in general. What commuting condition is required?"),
                W(r"Only when $A = B$", r"Equality is sufficient but far too restrictive. What weaker relation between $A$ and $B$ suffices?"),
                W(r"Only when both are invertible", r"Invertibility does not guarantee the splitting. What product condition must hold?"),
            ],
        ),
        item(
            "mp_LwSk9M5lJx4_3",
            r"For a diagonal $D$ with entries $d_1, d_2$, the matrix exponential $e^{Dt}$ has which diagonal entries?",
            r"Exponentiate each diagonal entry separately.",
            [
                C(r"$e^{d_1 t}$ and $e^{d_2 t}$", r"Yes. A diagonal matrix exponentiates entrywise, giving $e^{d_1 t}$ and $e^{d_2 t}$."),
                W(r"$d_1 e^{t}$ and $d_2 e^{t}$", r"The entries belong in the exponent, not as coefficients. What are the diagonal terms?"),
                W(r"$e^{d_1} t$ and $e^{d_2} t$", r"The variable $t$ multiplies the entry inside the exponent. What is $e^{d_i t}$?"),
                W(r"$d_1^t$ and $d_2^t$", r"The exponential uses base $e$, not the entry as a base. What is $e^{d_i t}$?"),
            ],
        ),
        item(
            "mp_LwSk9M5lJx4_4",
            r"The matrix exponential connects to eigenvalues because the diagonal $D$ contains what?",
            r"Diagonalization places specific numbers of $A$ on the diagonal.",
            [
                C(r"The eigenvalues of $A$", r"Yes. In $A = PDP^{-1}$ the diagonal $D$ holds the eigenvalues, so $e^{Dt}$ holds $e^{\lambda t}$."),
                W(r"The eigenvectors of $A$", r"Eigenvectors form the columns of $P$, not the diagonal of $D$. What numbers sit on $D$?"),
                W(r"The determinant of $A$", r"The determinant is a single product, not the diagonal. What entries fill $D$?"),
                W(r"The trace of $A$ in every entry", r"The trace is the sum of the diagonal, not each entry. What values does $D$ list?"),
            ],
        ),
        item(
            "mp_LwSk9M5lJx4_5",
            r"Why does $e^{At}$ give a complete picture of the solution to $\mathbf{x}' = A\mathbf{x}$?",
            r"Think about how it maps any starting vector forward in time.",
            [
                C(r"It is the operator that propagates any initial state $\mathbf{x}_0$ to the solution at time $t$", r"Yes. Multiplying any $\mathbf{x}_0$ by $e^{At}$ yields the solution, so it encodes every trajectory."),
                W(r"It lists the eigenvalues but not the solutions", r"It does far more than list eigenvalues; it generates the solutions. What role does it play on $\mathbf{x}_0$?"),
                W(r"It only works for a single special initial condition", r"It handles every initial condition at once. How does it act on an arbitrary $\mathbf{x}_0$?"),
                W(r"It gives the equilibrium but not the dynamics", r"It captures the full time evolution, not just equilibrium. What does it produce from $\mathbf{x}_0$?"),
            ],
        ),
    ],
)

# === 15.5 video 1 ===========================================================
add_micro(
    "eI8k_j7v0Nk",
    'Unit 15, Module 15.5, video 1\n           "MATH 244: Section 7.7, Video 1: Fundamental Matrices"',
    [
        item(
            "mp_eI8k_j7v0Nk_1",
            r"What are the columns of a fundamental matrix $\Phi(t)$ for $\mathbf{x}' = A\mathbf{x}$?",
            r"They are assembled from a complete set of solutions.",
            [
                C(r"A set of linearly independent solutions of the system", r"Yes. A fundamental matrix collects linearly independent solution vectors as its columns."),
                W(r"The eigenvectors of $A$ alone, without time dependence", r"Columns must be full solutions, which carry time dependence. What time-dependent objects fill them?"),
                W(r"Arbitrary constant vectors", r"Constant columns do not solve the system. What kind of vectors must the columns be?"),
                W(r"The rows of the matrix $A$", r"The rows of $A$ are not solutions of the system. What solution objects form the columns?"),
            ],
        ),
        item(
            "mp_eI8k_j7v0Nk_2",
            r"A fundamental matrix $\Phi(t)$ itself satisfies which matrix equation?",
            r"Each column solves $\mathbf{x}' = A\mathbf{x}$, so the whole matrix inherits the rule.",
            [
                C(r"$\Phi'(t) = A\,\Phi(t)$", r"Yes. Since every column solves $\mathbf{x}' = A\mathbf{x}$, the matrix obeys $\Phi' = A\Phi$."),
                W(r"$\Phi'(t) = \Phi(t)\,A$", r"The coefficient matrix multiplies on the left, matching $\mathbf{x}' = A\mathbf{x}$. Which side does $A$ go on?"),
                W(r"$\Phi'(t) = A + \Phi(t)$", r"The relation is multiplicative, not additive. How does $A$ act on $\Phi$?"),
                W(r"$\Phi'(t) = \det(A)\,\Phi(t)$", r"The full matrix $A$ acts, not its determinant. What multiplies $\Phi$?"),
            ],
        ),
        item(
            "mp_eI8k_j7v0Nk_3",
            r"The general solution of $\mathbf{x}' = A\mathbf{x}$ is written using a fundamental matrix as what?",
            r"Combine the independent solution columns with a constant vector.",
            [
                C(r"$\mathbf{x}(t) = \Phi(t)\,\mathbf{c}$ for a constant vector $\mathbf{c}$", r"Yes. Multiplying the fundamental matrix by an arbitrary constant vector gives every solution."),
                W(r"$\mathbf{x}(t) = \Phi(t) + \mathbf{c}$", r"The constants combine the columns by multiplication, not addition. How does $\mathbf{c}$ act?"),
                W(r"$\mathbf{x}(t) = \Phi(t)^{-1}\mathbf{c}$", r"The fundamental matrix itself, not its inverse, builds the solution. What product gives the general solution?"),
                W(r"$\mathbf{x}(t) = A\,\Phi(t)$", r"That is the derivative relation, not the solution. What does $\Phi(t)$ multiply to form $\mathbf{x}$?"),
            ],
        ),
        item(
            "mp_eI8k_j7v0Nk_4",
            r"Why must the columns of a fundamental matrix be linearly independent?",
            r"They must span the full solution space, not collapse onto one another.",
            [
                C(r"So they span the whole solution space, making $\Phi(t)$ invertible", r"Yes. Independent columns span all solutions and keep $\det\Phi \neq 0$, so $\Phi$ is invertible."),
                W(r"So the determinant of $\Phi$ is zero", r"A zero determinant would make $\Phi$ singular and useless. What determinant value is required?"),
                W(r"So the eigenvalues are all equal", r"Independence is unrelated to repeated eigenvalues. What does independence guarantee about the span?"),
                W(r"So the solution is unique without initial data", r"Initial data is still needed for a specific solution. What does independence ensure about coverage?"),
            ],
        ),
        item(
            "mp_eI8k_j7v0Nk_5",
            r"The Wronskian of the solution columns, $\det\Phi(t)$, has which property for a fundamental matrix?",
            r"Independence of solutions is detected by a nonvanishing determinant.",
            [
                C(r"It is nonzero for all $t$", r"Yes. For independent solutions the Wronskian $\det\Phi(t)$ never vanishes."),
                W(r"It is zero for all $t$", r"A vanishing Wronskian signals dependence, the opposite of what we need. What value indicates independence?"),
                W(r"It equals the trace of $A$", r"The Wronskian is a determinant, not the trace. What is true of its value for independent columns?"),
                W(r"It is zero at $t = 0$ only", r"For a fundamental matrix the determinant never vanishes. What holds for all $t$?"),
            ],
        ),
    ],
)

# === 15.5 video 2 ===========================================================
add_micro(
    "Ybmb0BJ0GPc",
    'Unit 15, Module 15.5, video 2\n           "Differential Equations - Systems of ODEs - Fundamental Matrices"',
    [
        item(
            "mp_Ybmb0BJ0GPc_1",
            r"The special fundamental matrix equal to the matrix exponential $e^{At}$ satisfies which normalization?",
            r"It reduces to the identity at the starting time.",
            [
                C(r"$\Phi(0) = I$", r"Yes. The matrix exponential is the fundamental matrix normalized so that $\Phi(0) = I$."),
                W(r"$\Phi(0) = A$", r"At $t = 0$ the exponential is the identity, not $A$. What is $e^{A \cdot 0}$?"),
                W(r"$\Phi(0) = 0$", r"A zero matrix could not be a fundamental matrix. What value does $e^{At}$ take at $t = 0$?"),
                W(r"$\Phi(0) = A^{-1}$", r"The normalization gives the identity, not an inverse. What is $\Phi(0)$ for $e^{At}$?"),
            ],
        ),
        item(
            "mp_Ybmb0BJ0GPc_2",
            r"Given any fundamental matrix $\Phi(t)$, the matrix exponential is recovered as which product?",
            r"Renormalize $\Phi$ so its value at $t = 0$ becomes the identity.",
            [
                C(r"$e^{At} = \Phi(t)\,\Phi(0)^{-1}$", r"Yes. Right-multiplying by $\Phi(0)^{-1}$ forces the value at $t = 0$ to be $I$, giving $e^{At}$."),
                W(r"$e^{At} = \Phi(0)^{-1}\Phi(t)$", r"The normalizing factor goes on the right to fix $\Phi(0)\Phi(0)^{-1} = I$. Which side carries $\Phi(0)^{-1}$?"),
                W(r"$e^{At} = \Phi(t)\,\Phi(0)$", r"You need the inverse of $\Phi(0)$ to normalize. What factor makes the value at $0$ equal $I$?"),
                W(r"$e^{At} = \Phi(t) + \Phi(0)^{-1}$", r"The correction is multiplicative, not additive. What product recovers $e^{At}$?"),
            ],
        ),
        item(
            "mp_Ybmb0BJ0GPc_3",
            r"Using a fundamental matrix, the solution of the IVP $\mathbf{x}' = A\mathbf{x}$, $\mathbf{x}(t_0) = \mathbf{x}_0$ is which expression?",
            r"Build the propagator that is the identity at $t_0$, then apply it to $\mathbf{x}_0$.",
            [
                C(r"$\mathbf{x}(t) = \Phi(t)\,\Phi(t_0)^{-1}\,\mathbf{x}_0$", r"Yes. The factor $\Phi(t)\Phi(t_0)^{-1}$ is the identity at $t_0$, so it carries $\mathbf{x}_0$ forward correctly."),
                W(r"$\mathbf{x}(t) = \Phi(t)\,\mathbf{x}_0$", r"This fails to equal $\mathbf{x}_0$ at $t_0$ unless $\Phi(t_0) = I$. What extra factor fixes the initial value?"),
                W(r"$\mathbf{x}(t) = \Phi(t_0)\,\Phi(t)^{-1}\,\mathbf{x}_0$", r"The roles of $t$ and $t_0$ are reversed. Which argument should appear in the inverse?"),
                W(r"$\mathbf{x}(t) = \Phi(t)^{-1}\,\mathbf{x}_0$", r"The plain fundamental matrix, not its inverse, evolves the state. What product is the propagator?"),
            ],
        ),
        item(
            "mp_Ybmb0BJ0GPc_4",
            r"Is the fundamental matrix for a given system unique?",
            r"Recall that any independent combination of solutions also works.",
            [
                C(r"No; any $\Phi(t)C$ with an invertible constant matrix $C$ is also fundamental", r"Yes. Right-multiplying by an invertible constant matrix yields another valid fundamental matrix."),
                W(r"Yes; there is exactly one fundamental matrix", r"Different independent solution sets give different fundamental matrices. What freedom exists?"),
                W(r"Yes, but only $e^{At}$ qualifies", r"$e^{At}$ is one choice, normalized by $\Phi(0) = I$, but not the only one. What other matrices work?"),
                W(r"No; it changes with every initial condition", r"Initial conditions select constants, not the matrix itself. What transformation preserves the fundamental property?"),
            ],
        ),
        item(
            "mp_Ybmb0BJ0GPc_5",
            r"For distinct real eigenvalues, one fundamental matrix has columns of which form?",
            r"Each independent solution is an exponential times its eigenvector.",
            [
                C(r"$e^{\lambda_1 t}\mathbf{v}_1$ and $e^{\lambda_2 t}\mathbf{v}_2$", r"Yes. Each eigenpair gives a column $e^{\lambda t}\mathbf{v}$, and together they form a fundamental matrix."),
                W(r"$\mathbf{v}_1$ and $\mathbf{v}_2$, the eigenvectors alone", r"Columns must be full time-dependent solutions. What exponential factor is missing?"),
                W(r"$e^{\lambda_1 t}$ and $e^{\lambda_2 t}$, scalars", r"Each column is a vector solution, not a scalar. What vector multiplies each exponential?"),
                W(r"$t\mathbf{v}_1$ and $t\mathbf{v}_2$", r"Polynomial factors appear only for repeated eigenvalues. What is the correct time factor for distinct ones?"),
            ],
        ),
    ],
)

# === 15.6 video 1 ===========================================================
add_micro(
    "RUpJUNjGmFI",
    'Unit 15, Module 15.6, video 1\n           "Homogeneous System of Differential Equations Example 1"',
    [
        item(
            "mp_RUpJUNjGmFI_1",
            r"For $A$ with rows $(1, 1)$ and $(4, 1)$, what is the characteristic equation?",
            r"Use $\lambda^2 - (\text{tr})\lambda + \det$ with trace $2$ and determinant $1 - 4$.",
            [
                C(r"$\lambda^2 - 2\lambda - 3 = 0$", r"Correct. The trace is $2$ and the determinant is $1 - 4 = -3$, giving $\lambda^2 - 2\lambda - 3 = 0$."),
                W(r"$\lambda^2 - 2\lambda + 3 = 0$", r"The determinant is $(1)(1) - (1)(4) = -3$, which is negative. What constant term results?"),
                W(r"$\lambda^2 + 2\lambda - 3 = 0$", r"The trace is $+2$, so the middle term is $-2\lambda$. What sign should it carry?"),
                W(r"$\lambda^2 - 3\lambda - 2 = 0$", r"The trace and determinant are swapped. Which value is the coefficient of $\lambda$?"),
            ],
        ),
        item(
            "mp_RUpJUNjGmFI_2",
            r"The roots of $\lambda^2 - 2\lambda - 3 = 0$ are which eigenvalues?",
            r"Factor into $(\lambda - 3)(\lambda + 1)$.",
            [
                C(r"$\lambda = 3$ and $\lambda = -1$", r"Correct. $(\lambda - 3)(\lambda + 1) = 0$ gives $\lambda = 3$ and $\lambda = -1$."),
                W(r"$\lambda = -3$ and $\lambda = 1$", r"Check the signs of the factors $(\lambda - 3)(\lambda + 1)$. What roots do they give?"),
                W(r"$\lambda = 3$ and $\lambda = 1$", r"The constant term $-3$ requires roots of opposite sign. What is the negative root?"),
                W(r"$\lambda = 2$ and $\lambda = -3$", r"The roots must sum to the trace $2$ and multiply to $-3$. What pair fits?"),
            ],
        ),
        item(
            "mp_RUpJUNjGmFI_3",
            r"With eigenvalues $3$ and $-1$ of opposite sign, the origin of this system is what kind of equilibrium?",
            r"Opposite-sign real eigenvalues mean one mode grows and one decays.",
            [
                C(r"A saddle point (unstable)", r"Yes. One positive and one negative eigenvalue produce a saddle, which is unstable."),
                W(r"A stable node (sink)", r"A sink needs both eigenvalues negative. What does a positive eigenvalue do?"),
                W(r"An unstable node (source)", r"A source needs both eigenvalues positive. What does the negative eigenvalue contribute?"),
                W(r"A center", r"Centers come from purely imaginary eigenvalues. What do two real eigenvalues of opposite sign give?"),
            ],
        ),
        item(
            "mp_RUpJUNjGmFI_4",
            r"For $\lambda = 3$ with $A$ rows $(1, 1)$ and $(4, 1)$, find an eigenvector from $(A - 3I)\mathbf{v} = 0$.",
            r"The matrix $A - 3I$ has rows $(-2, 1)$ and $(4, -2)$; solve $-2v_1 + v_2 = 0$.",
            [
                C(r"$(1, 2)$", r"Correct. From $-2v_1 + v_2 = 0$ we get $v_2 = 2v_1$, so $(1, 2)$ works."),
                W(r"$(2, 1)$", r"The relation is $v_2 = 2v_1$, so the second component is the larger. Which ordering fits?"),
                W(r"$(1, -2)$", r"The equation $-2v_1 + v_2 = 0$ gives a positive $v_2$. What sign should the second component have?"),
                W(r"$(1, 1)$", r"Equal components do not satisfy $v_2 = 2v_1$. What second component does that relation force?"),
            ],
        ),
        item(
            "mp_RUpJUNjGmFI_5",
            r"Once both eigenpairs are found, what is the general solution of this homogeneous system?",
            r"Superpose the two exponential mode solutions.",
            [
                C(r"$\mathbf{x} = c_1 e^{3t}\mathbf{v}_1 + c_2 e^{-t}\mathbf{v}_2$", r"Yes. Each eigenpair contributes a mode $e^{\lambda t}\mathbf{v}$, and the general solution superposes them."),
                W(r"$\mathbf{x} = c_1 e^{3t} + c_2 e^{-t}$", r"The eigenvectors give each mode a direction. What vectors must multiply the exponentials?"),
                W(r"$\mathbf{x} = c_1 e^{-3t}\mathbf{v}_1 + c_2 e^{t}\mathbf{v}_2$", r"The exponents are the eigenvalues $3$ and $-1$, not their negatives. What exponents are correct?"),
                W(r"$\mathbf{x} = (c_1 + c_2 t)e^{3t}\mathbf{v}_1$", r"A polynomial factor appears only for a repeated eigenvalue. What form fits two distinct ones?"),
            ],
        ),
    ],
)

# === 15.6 video 2 ===========================================================
add_micro(
    "qpWV8Pd9tao",
    'Unit 15, Module 15.6, video 2\n           "Homogeneous System of Differential Equations Example 2"',
    [
        item(
            "mp_qpWV8Pd9tao_1",
            r"For $A$ with rows $(3, 1)$ and $(1, 3)$, what are the eigenvalues?",
            r"Use the trace $6$ and determinant $9 - 1 = 8$, or the symmetric trick $\lambda = m \pm \sqrt{m^2 - p}$.",
            [
                C(r"$\lambda = 4$ and $\lambda = 2$", r"Correct. Trace $6$ and determinant $8$ give $\lambda^2 - 6\lambda + 8 = 0$, so $\lambda = 4, 2$."),
                W(r"$\lambda = 3$ and $\lambda = 3$", r"The off-diagonal entries shift the eigenvalues off the diagonal value. What does $\lambda^2 - 6\lambda + 8 = 0$ give?"),
                W(r"$\lambda = 6$ and $\lambda = 8$", r"Those are the trace and determinant, not the roots. What two numbers sum to $6$ and multiply to $8$?"),
                W(r"$\lambda = 4$ and $\lambda = -2$", r"The product of the roots must be $+8$, so both are positive. What is the second root?"),
            ],
        ),
        item(
            "mp_qpWV8Pd9tao_2",
            r"With both eigenvalues positive ($4$ and $2$), the origin is what kind of equilibrium?",
            r"Both modes grow in time.",
            [
                C(r"An unstable node (source)", r"Yes. Two positive real eigenvalues make every trajectory move away from the origin, a source."),
                W(r"A stable node (sink)", r"A sink requires negative eigenvalues. What do positive eigenvalues do to trajectories?"),
                W(r"A saddle", r"A saddle needs eigenvalues of opposite sign. What do two positive eigenvalues give?"),
                W(r"A center", r"Centers come from purely imaginary eigenvalues. What kind of node do two positive reals give?"),
            ],
        ),
        item(
            "mp_qpWV8Pd9tao_3",
            r"For $\lambda = 4$ with $A$ rows $(3, 1)$ and $(1, 3)$, find an eigenvector from $(A - 4I)\mathbf{v} = 0$.",
            r"The matrix $A - 4I$ has rows $(-1, 1)$ and $(1, -1)$; solve $-v_1 + v_2 = 0$.",
            [
                C(r"$(1, 1)$", r"Correct. The equation $-v_1 + v_2 = 0$ forces $v_1 = v_2$, so $(1, 1)$ works."),
                W(r"$(1, -1)$", r"Equal-sign components are required by $v_1 = v_2$. What sign should the second have?"),
                W(r"$(2, 1)$", r"The relation $v_1 = v_2$ needs equal components. What vector satisfies that?"),
                W(r"$(0, 1)$", r"A zero first component violates $v_1 = v_2$. What equal-component vector fits?"),
            ],
        ),
        item(
            "mp_qpWV8Pd9tao_4",
            r"For $\lambda = 2$ with the same matrix, the eigenvector satisfies $(A - 2I)\mathbf{v} = 0$ with rows $(1, 1)$ and $(1, 1)$. What works?",
            r"Solve $v_1 + v_2 = 0$.",
            [
                C(r"$(1, -1)$", r"Correct. The equation $v_1 + v_2 = 0$ gives $v_2 = -v_1$, so $(1, -1)$ works."),
                W(r"$(1, 1)$", r"That satisfies $v_1 = v_2$, but here $v_1 + v_2 = 0$ is required. What sign relation holds?"),
                W(r"$(2, 2)$", r"Equal components give a nonzero sum, violating $v_1 + v_2 = 0$. What relation is needed?"),
                W(r"$(1, 0)$", r"A zero second component leaves $v_1 + v_2 = v_1 \neq 0$. What vector makes the sum zero?"),
            ],
        ),
        item(
            "mp_qpWV8Pd9tao_5",
            r"The eigenvectors $(1, 1)$ and $(1, -1)$ of this symmetric matrix have which special geometric relationship?",
            r"Compute their dot product.",
            [
                C(r"They are orthogonal (perpendicular)", r"Yes. Their dot product $1 - 1 = 0$, so the eigenvectors are perpendicular, as expected for a symmetric matrix."),
                W(r"They are parallel", r"Parallel vectors are scalar multiples; these are not. What does a zero dot product indicate?"),
                W(r"They are identical", r"The vectors clearly differ. What does $(1)(1) + (1)(-1) = 0$ tell you?"),
                W(r"They point in opposite directions", r"Opposite vectors are negatives of each other; these are not. What perpendicularity does the zero dot product show?"),
            ],
        ),
    ],
)

# === 15.7 video 1 ===========================================================
add_micro(
    "eKG47g-qbDw",
    'Unit 15, Module 15.7, video 1\n           "Undetermined Coefficients for a System of DEs"',
    [
        item(
            "mp_eKG47g-qbDw_1",
            r"For the nonhomogeneous system $\mathbf{x}' = A\mathbf{x} + \mathbf{g}(t)$, the general solution has which structure?",
            r"It mirrors the scalar nonhomogeneous case.",
            [
                C(r"$\mathbf{x} = \mathbf{x}_h + \mathbf{x}_p$, homogeneous plus particular", r"Yes. The general solution is the homogeneous solution plus any particular solution."),
                W(r"$\mathbf{x} = \mathbf{x}_h \cdot \mathbf{x}_p$, a product", r"Solutions combine by addition, not multiplication. How do the two pieces join?"),
                W(r"$\mathbf{x} = \mathbf{x}_p$ only", r"The homogeneous part carries the free constants. What must be added to $\mathbf{x}_p$?"),
                W(r"$\mathbf{x} = \mathbf{x}_h$ only", r"The forcing $\mathbf{g}(t)$ requires a particular piece too. What is added to $\mathbf{x}_h$?"),
            ],
        ),
        item(
            "mp_eKG47g-qbDw_2",
            r"For a constant forcing vector $\mathbf{g}$, the method of undetermined coefficients guesses a particular solution of which form?",
            r"Match the form of the forcing: a constant input suggests a constant response.",
            [
                C(r"A constant vector $\mathbf{x}_p = \mathbf{a}$", r"Yes. Constant forcing calls for a constant trial vector $\mathbf{a}$, whose entries are then solved for."),
                W(r"A linear-in-$t$ vector $\mathbf{a}t$", r"A linear guess matches linear forcing, not constant. What trial fits a constant input?"),
                W(r"An exponential $e^{t}\mathbf{a}$", r"Exponential trials match exponential forcing. What matches a constant $\mathbf{g}$?"),
                W(r"A trigonometric vector", r"Sines and cosines match oscillatory forcing. What simple form matches a constant?"),
            ],
        ),
        item(
            "mp_eKG47g-qbDw_3",
            r"For constant forcing $\mathbf{g}$ with $A$ invertible, the constant particular solution is which vector?",
            r"Set $\mathbf{x}_p' = 0$ in $\mathbf{x}_p' = A\mathbf{x}_p + \mathbf{g}$ and solve.",
            [
                C(r"$\mathbf{x}_p = -A^{-1}\mathbf{g}$", r"Yes. A constant $\mathbf{x}_p$ has zero derivative, so $0 = A\mathbf{x}_p + \mathbf{g}$ gives $\mathbf{x}_p = -A^{-1}\mathbf{g}$."),
                W(r"$\mathbf{x}_p = A^{-1}\mathbf{g}$", r"Move $\mathbf{g}$ across the equation $0 = A\mathbf{x}_p + \mathbf{g}$. What sign appears?"),
                W(r"$\mathbf{x}_p = -A\mathbf{g}$", r"Solving for $\mathbf{x}_p$ requires the inverse of $A$, not $A$ itself. What operator acts on $\mathbf{g}$?"),
                W(r"$\mathbf{x}_p = \mathbf{g}$", r"The matrix $A$ cannot simply vanish. What does solving $A\mathbf{x}_p = -\mathbf{g}$ give?"),
            ],
        ),
        item(
            "mp_eKG47g-qbDw_4",
            r"When the forcing has the form $e^{\lambda t}\mathbf{b}$ and $\lambda$ is an eigenvalue of $A$, the trial guess must be modified how?",
            r"This is the resonant case, analogous to the scalar resonance fix.",
            [
                C(r"Multiply the usual exponential guess by $t$ (and include lower-order terms)", r"Yes. Resonance with an eigenvalue forces a $t e^{\lambda t}$ term in the trial, like the scalar case."),
                W(r"Leave the guess unchanged", r"A plain guess collides with the homogeneous solution. What factor resolves the resonance?"),
                W(r"Replace the exponential with a constant", r"The forcing is exponential, so the trial must be too. What modification handles resonance?"),
                W(r"Divide the guess by $t$", r"Resonance calls for multiplying, not dividing, by $t$. What adjustment is standard?"),
            ],
        ),
        item(
            "mp_eKG47g-qbDw_5",
            r"After choosing the trial $\mathbf{x}_p$, how are its unknown coefficient vectors found?",
            r"Force the trial to satisfy the system identically.",
            [
                C(r"Substitute into $\mathbf{x}' = A\mathbf{x} + \mathbf{g}$ and match like terms", r"Yes. Plugging the trial in and equating coefficients of like terms yields equations for the unknowns."),
                W(r"Set them equal to the eigenvalues", r"The coefficients are not the eigenvalues. How does substitution determine them?"),
                W(r"Read them off the initial condition", r"Initial conditions fix the homogeneous constants, not the particular coefficients. What determines $\mathbf{x}_p$?"),
                W(r"Take the determinant of $A$", r"A determinant gives one number, not the coefficient vectors. What procedure solves for them?"),
            ],
        ),
    ],
)

# === 15.7 video 2 ===========================================================
add_micro(
    "C5SO-XAIG_g",
    'Unit 15, Module 15.7, video 2\n           "Variation of Parameters for a System of DEs"',
    [
        item(
            "mp_C5SO-XAIG_g_1",
            r"Variation of parameters for $\mathbf{x}' = A\mathbf{x} + \mathbf{g}(t)$ gives a particular solution of which form?",
            r"Use the fundamental matrix $\Phi$ and integrate against the forcing.",
            [
                C(r"$\mathbf{x}_p = \Phi(t)\int \Phi^{-1}(t)\,\mathbf{g}(t)\,dt$", r"Yes. Variation of parameters yields $\mathbf{x}_p = \Phi \int \Phi^{-1}\mathbf{g}\,dt$."),
                W(r"$\mathbf{x}_p = \Phi^{-1}(t)\int \Phi(t)\,\mathbf{g}(t)\,dt$", r"The fundamental matrix multiplies on the outside, with its inverse inside the integral. Which goes where?"),
                W(r"$\mathbf{x}_p = \int \Phi(t)\,\mathbf{g}(t)\,dt$", r"The integrand should contain $\Phi^{-1}\mathbf{g}$, with $\Phi$ outside. What factor is missing inside?"),
                W(r"$\mathbf{x}_p = \Phi(t)\,\mathbf{g}(t)$", r"An integral over the forcing is required, not a plain product. What operation acts on $\Phi^{-1}\mathbf{g}$?"),
            ],
        ),
        item(
            "mp_C5SO-XAIG_g_2",
            r"What is the key advantage of variation of parameters over undetermined coefficients for systems?",
            r"Think about which forcing functions each method can handle.",
            [
                C(r"It works for any continuous forcing, not just special forms", r"Yes. Variation of parameters applies to general $\mathbf{g}(t)$, while undetermined coefficients needs special forms."),
                W(r"It never requires integration", r"It does require integrating $\Phi^{-1}\mathbf{g}$. What broader class of forcing does it handle?"),
                W(r"It avoids finding the homogeneous solution", r"It actually relies on the fundamental matrix from the homogeneous problem. What is its real advantage?"),
                W(r"It only works for constant forcing", r"Constant forcing is the easy case for guessing. What forcing does variation of parameters allow?"),
            ],
        ),
        item(
            "mp_C5SO-XAIG_g_3",
            r"In the variation of parameters formula, why is $\Phi^{-1}(t)$ required to exist?",
            r"Recall the determinant property of a fundamental matrix.",
            [
                C(r"Because a fundamental matrix has nonzero determinant, so it is invertible", r"Yes. Independent solution columns make $\det\Phi \neq 0$, guaranteeing the inverse exists."),
                W(r"Because $A$ is always invertible", r"The invertibility needed is that of $\Phi$, not $A$. Why is $\Phi$ invertible?"),
                W(r"Because $\mathbf{g}(t)$ is nonzero", r"The forcing being nonzero does not invert $\Phi$. What property of $\Phi$ guarantees its inverse?"),
                W(r"Because the eigenvalues are distinct", r"Distinct eigenvalues are not required for invertibility of $\Phi$. What determinant fact ensures it?"),
            ],
        ),
        item(
            "mp_C5SO-XAIG_g_4",
            r"For the IVP version, the definite-integral form of the particular solution uses which lower limit so that $\mathbf{x}_p(t_0) = \mathbf{0}$?",
            r"Choose the lower limit so the integral vanishes at the start.",
            [
                C(r"$\mathbf{x}_p = \Phi(t)\int_{t_0}^{t} \Phi^{-1}(s)\,\mathbf{g}(s)\,ds$", r"Yes. With lower limit $t_0$, the integral is zero at $t = t_0$, so $\mathbf{x}_p(t_0) = \mathbf{0}$."),
                W(r"$\mathbf{x}_p = \Phi(t)\int_{0}^{\infty} \Phi^{-1}(s)\,\mathbf{g}(s)\,ds$", r"An improper integral over all time does not vanish at $t_0$. What lower limit makes it zero there?"),
                W(r"$\mathbf{x}_p = \Phi(t)\int_{t}^{t_0} \Phi^{-1}(s)\,\mathbf{g}(s)\,ds$", r"The limits are reversed, flipping the sign. Which order makes the integral vanish at $t_0$?"),
                W(r"$\mathbf{x}_p = \Phi(t)\int_{-\infty}^{t} \Phi^{-1}(s)\,\mathbf{g}(s)\,ds$", r"Starting at $-\infty$ does not give zero at $t_0$. What finite lower limit works?"),
            ],
        ),
        item(
            "mp_C5SO-XAIG_g_5",
            r"The full general solution of the nonhomogeneous system by variation of parameters is which expression?",
            r"Add the homogeneous combination to the particular integral.",
            [
                C(r"$\mathbf{x} = \Phi(t)\,\mathbf{c} + \Phi(t)\int \Phi^{-1}\mathbf{g}\,dt$", r"Yes. The homogeneous part $\Phi\mathbf{c}$ plus the particular integral gives the general solution."),
                W(r"$\mathbf{x} = \Phi(t)\int \Phi^{-1}\mathbf{g}\,dt$ only", r"The free constants from the homogeneous solution are missing. What term carries $\mathbf{c}$?"),
                W(r"$\mathbf{x} = \Phi(t)\,\mathbf{c}$ only", r"This ignores the forcing entirely. What particular term must be added?"),
                W(r"$\mathbf{x} = \mathbf{c} + \int \Phi^{-1}\mathbf{g}\,dt$", r"The fundamental matrix must multiply both pieces. What factor is missing in front?"),
            ],
        ),
    ],
)

# ============================================================================
# UNIT 16 MICRO PRACTICE
# ============================================================================

# === 16.1 video 1 ===========================================================
add_micro(
    "UO_dgXa5szg",
    'Unit 16, Module 16.1, video 1\n           "Phase portraits of linear systems, Lecture 42"',
    [
        item(
            "mp_UO_dgXa5szg_1",
            r"What does a phase portrait of $\mathbf{x}' = A\mathbf{x}$ display?",
            r"It shows trajectories in the plane of the dependent variables, not against time.",
            [
                C(r"Trajectories in the $x_1 x_2$ plane, with arrows showing the direction of motion", r"Yes. A phase portrait plots solution curves in state space and indicates the flow direction."),
                W(r"Graphs of $x_1$ and $x_2$ each versus time $t$", r"Those are time series, plotted against $t$. What plane does a phase portrait use instead?"),
                W(r"The eigenvalues plotted in the complex plane", r"That is a spectrum plot, not a phase portrait. What curves does a phase portrait show?"),
                W(r"A bar chart of the matrix entries", r"The entries of $A$ are not what is plotted. What geometric objects fill a phase portrait?"),
            ],
        ),
        item(
            "mp_UO_dgXa5szg_2",
            r"For a linear system $\mathbf{x}' = A\mathbf{x}$ with invertible $A$, where is the only equilibrium?",
            r"Solve $A\mathbf{x} = \mathbf{0}$.",
            [
                C(r"At the origin", r"Yes. With $A$ invertible, $A\mathbf{x} = \mathbf{0}$ forces $\mathbf{x} = \mathbf{0}$, so the origin is the lone equilibrium."),
                W(r"At every eigenvector", r"Eigenvectors set special directions, not equilibria. Where does $A\mathbf{x} = \mathbf{0}$ put the rest point?"),
                W(r"Along the entire $x_1$ axis", r"A whole line of equilibria needs a singular $A$. For invertible $A$, what single point solves $A\mathbf{x} = \mathbf{0}$?"),
                W(r"There is no equilibrium", r"Every linear system has the origin as an equilibrium. What point always satisfies $A\mathbf{x} = \mathbf{0}$?"),
            ],
        ),
        item(
            "mp_UO_dgXa5szg_3",
            r"What overall feature of the phase portrait is determined by the eigenvalues of $A$?",
            r"The eigenvalues classify the type and stability of the equilibrium.",
            [
                C(r"The type and stability of the equilibrium (node, saddle, spiral, center)", r"Yes. The eigenvalues decide whether the origin is a node, saddle, spiral, or center, and its stability."),
                W(r"The thickness of the drawn curves", r"Drawing style is cosmetic, not set by eigenvalues. What dynamical classification do they fix?"),
                W(r"The color of each trajectory", r"Color is arbitrary. What structural feature of the portrait do eigenvalues determine?"),
                W(r"The labels on the axes", r"Axis labels are notation, not dynamics. What behavior near the origin do eigenvalues set?"),
            ],
        ),
        item(
            "mp_UO_dgXa5szg_4",
            r"For real distinct eigenvalues, the straight-line trajectories of the phase portrait lie along what?",
            r"Solutions that stay on a fixed line follow a special direction of $A$.",
            [
                C(r"The eigenvectors of $A$", r"Yes. Along an eigenvector the motion stays on that line, giving the straight-line trajectories."),
                W(r"The coordinate axes always", r"The special lines are eigenvectors, which need not be the axes. What directions stay invariant?"),
                W(r"The diagonal $x_1 = x_2$ always", r"That diagonal is not generally invariant. Which directions of $A$ produce straight-line motion?"),
                W(r"Circles around the origin", r"Circles are not straight lines and arise for centers. What straight directions does $A$ single out?"),
            ],
        ),
        item(
            "mp_UO_dgXa5szg_5",
            r"For two negative real eigenvalues, all trajectories in the phase portrait do what as $t \to \infty$?",
            r"Negative exponential rates shrink every mode.",
            [
                C(r"Approach the origin (a stable node)", r"Yes. Both modes decay like $e^{\lambda t}$ with $\lambda < 0$, so trajectories tend to the origin."),
                W(r"Move away to infinity", r"Escape to infinity needs a positive eigenvalue. What do negative rates do to the trajectories?"),
                W(r"Circle the origin forever", r"Closed circling comes from imaginary eigenvalues. What do two negative reals cause?"),
                W(r"Stay fixed at their starting points", r"Nonzero starting points still move under the flow. Where do decaying modes send them?"),
            ],
        ),
    ],
)

# === 16.1 video 2 ===========================================================
add_micro(
    "fsnEIYEZc3Y",
    'Unit 16, Module 16.1, video 2\n           "System of differential equations with distinct eigenvalues, Phase portraits introduction"',
    [
        item(
            "mp_fsnEIYEZc3Y_1",
            r"For real distinct eigenvalues of the same sign, what is the equilibrium called?",
            r"Same-sign real eigenvalues give a node, stable or unstable by sign.",
            [
                C(r"A node (stable if both negative, unstable if both positive)", r"Yes. Same-sign real eigenvalues produce a node, whose stability follows the shared sign."),
                W(r"A saddle", r"Saddles need opposite signs. What does the same sign on both eigenvalues give?"),
                W(r"A center", r"Centers require purely imaginary eigenvalues. What do two same-sign reals give?"),
                W(r"A spiral", r"Spirals require complex eigenvalues. What real-eigenvalue equilibrium is this?"),
            ],
        ),
        item(
            "mp_fsnEIYEZc3Y_2",
            r"When trajectories approach a node, they become tangent to which direction?",
            r"The slower-decaying mode dominates near the origin.",
            [
                C(r"The eigenvector of the eigenvalue closer to zero (the slow direction)", r"Yes. The slowest mode dies last, so incoming trajectories align with its eigenvector near the origin."),
                W(r"The eigenvector of the most negative eigenvalue", r"That fast mode dies first, so it does not dominate near the origin. Which eigenvalue's direction lingers?"),
                W(r"The vertical axis always", r"Tangency follows an eigenvector, not a fixed axis. Which eigenvalue sets the slow direction?"),
                W(r"A direction at 45 degrees", r"No fixed angle applies. Which eigenvector governs the approach near the origin?"),
            ],
        ),
        item(
            "mp_fsnEIYEZc3Y_3",
            r"For $A$ with rows $(-1, 0)$ and $(0, -2)$, classify the origin.",
            r"Read the eigenvalues off the diagonal and check their signs.",
            [
                C(r"A stable node", r"Yes. The eigenvalues $-1$ and $-2$ are both negative and real, giving a stable node."),
                W(r"An unstable node", r"Unstable nodes need positive eigenvalues. What does the negative sign on both indicate?"),
                W(r"A saddle", r"A saddle needs eigenvalues of opposite sign. Are $-1$ and $-2$ opposite in sign?"),
                W(r"A spiral sink", r"Spirals require complex eigenvalues. Are $-1$ and $-2$ real or complex?"),
            ],
        ),
        item(
            "mp_fsnEIYEZc3Y_4",
            r"For $A$ with rows $(1, 0)$ and $(0, -1)$, classify the origin.",
            r"The eigenvalues are $1$ and $-1$, of opposite sign.",
            [
                C(r"A saddle (unstable)", r"Yes. One positive and one negative eigenvalue produce a saddle, which is unstable."),
                W(r"A stable node", r"A stable node needs both eigenvalues negative. What does the positive eigenvalue $1$ do?"),
                W(r"A center", r"Centers come from purely imaginary eigenvalues. What do real opposite-sign eigenvalues give?"),
                W(r"An unstable node", r"An unstable node needs both eigenvalues positive. What does the negative eigenvalue change?"),
            ],
        ),
        item(
            "mp_fsnEIYEZc3Y_5",
            r"In a saddle, which special trajectories separate the regions of qualitatively different motion?",
            r"They run exactly along the two eigenvector directions, in and out.",
            [
                C(r"The separatrices along the eigenvectors (stable and unstable directions)", r"Yes. The eigenvector lines act as separatrices dividing the saddle's flow regions."),
                W(r"All circular orbits", r"Saddles have no closed orbits. What straight-line trajectories divide the regions?"),
                W(r"Random trajectories chosen arbitrarily", r"The dividing curves are specific, not arbitrary. Which directions define them?"),
                W(r"The coordinate axes regardless of $A$", r"The dividing lines are eigenvectors, which need not be the axes. What directions are they?"),
            ],
        ),
    ],
)

# === 16.2 video 1 ===========================================================
add_micro(
    "VqXKa11IA6A",
    'Unit 16, Module 16.2, video 1\n           "Phase Plane Pictures: Source, Sink, Saddle"',
    [
        item(
            "mp_VqXKa11IA6A_1",
            r"What eigenvalue signs characterize a source (unstable node)?",
            r"A source pushes every trajectory outward.",
            [
                C(r"Both eigenvalues real and positive", r"Yes. Two positive real eigenvalues make all trajectories flow away from the origin, a source."),
                W(r"Both eigenvalues real and negative", r"Negative eigenvalues pull trajectories inward, which is a sink. What sign makes them flee?"),
                W(r"Eigenvalues of opposite sign", r"Opposite signs give a saddle, not a source. What sign do both share for a source?"),
                W(r"Purely imaginary eigenvalues", r"Those give a center. What real sign produces outward flow?"),
            ],
        ),
        item(
            "mp_VqXKa11IA6A_2",
            r"What eigenvalue signs characterize a sink (stable node)?",
            r"A sink draws every trajectory inward.",
            [
                C(r"Both eigenvalues real and negative", r"Yes. Two negative real eigenvalues pull all trajectories toward the origin, a sink."),
                W(r"Both eigenvalues real and positive", r"Positive eigenvalues push trajectories away, a source. What sign pulls them in?"),
                W(r"Eigenvalues of opposite sign", r"Opposite signs give a saddle. What shared sign produces inward flow?"),
                W(r"One zero and one positive", r"A zero eigenvalue gives a degenerate case, not a sink. What negative condition is needed?"),
            ],
        ),
        item(
            "mp_VqXKa11IA6A_3",
            r"What eigenvalue configuration produces a saddle?",
            r"A saddle has one direction flowing in and one flowing out.",
            [
                C(r"Two real eigenvalues of opposite sign", r"Yes. One positive and one negative real eigenvalue create the in-and-out flow of a saddle."),
                W(r"Two real eigenvalues of the same sign", r"Same-sign eigenvalues give a node, not a saddle. What sign relation gives mixed flow?"),
                W(r"Complex conjugate eigenvalues", r"Those give spirals or centers. What real configuration gives a saddle?"),
                W(r"Two equal eigenvalues", r"Equal eigenvalues give a degenerate or star node. What opposite-sign condition gives a saddle?"),
            ],
        ),
        item(
            "mp_VqXKa11IA6A_4",
            r"Using the determinant, a saddle is detected by which simple condition on $A$?",
            r"The determinant equals the product of the eigenvalues.",
            [
                C(r"$\det(A) < 0$", r"Yes. A negative determinant means the eigenvalues have opposite signs, the signature of a saddle."),
                W(r"$\det(A) > 0$", r"A positive determinant means same-sign or complex eigenvalues, not a saddle. What sign signals opposite eigenvalues?"),
                W(r"$\det(A) = 0$", r"A zero determinant gives a non-isolated equilibrium, not a saddle. What sign of the determinant indicates a saddle?"),
                W(r"$\text{tr}(A) = 0$", r"Zero trace points toward a center, not a saddle. What determinant condition detects a saddle?"),
            ],
        ),
        item(
            "mp_VqXKa11IA6A_5",
            r"For $A$ with rows $(2, 0)$ and $(0, 3)$, which equilibrium type is the origin?",
            r"Both eigenvalues are positive reals.",
            [
                C(r"A source (unstable node)", r"Yes. Eigenvalues $2$ and $3$ are both positive, so trajectories flee the origin in a source."),
                W(r"A sink (stable node)", r"A sink needs negative eigenvalues. What do two positive eigenvalues produce?"),
                W(r"A saddle", r"A saddle needs opposite signs. Are $2$ and $3$ opposite in sign?"),
                W(r"A center", r"Centers need imaginary eigenvalues. Are $2$ and $3$ real or imaginary?"),
            ],
        ),
    ],
)

# === 16.2 video 2 ===========================================================
add_micro(
    "n9H-6TQIEJc",
    'Unit 16, Module 16.2, video 2\n           "Phase Plane Pictures: Spirals and Centers"',
    [
        item(
            "mp_n9H-6TQIEJc_1",
            r"What eigenvalue type produces a spiral?",
            r"Spiraling needs both rotation and growth or decay.",
            [
                C(r"Complex eigenvalues with nonzero real part", r"Yes. The imaginary part gives rotation and the nonzero real part gives growth or decay, producing a spiral."),
                W(r"Two distinct real eigenvalues", r"Real eigenvalues give straight-line nodes or saddles. What kind of eigenvalues cause rotation?"),
                W(r"Purely imaginary eigenvalues", r"Those give a center with closed orbits, not a spiral. What extra ingredient makes it spiral?"),
                W(r"A repeated real eigenvalue", r"Repeated reals give degenerate nodes. What complex feature creates spiraling?"),
            ],
        ),
        item(
            "mp_n9H-6TQIEJc_2",
            r"What eigenvalue type produces a center (closed orbits)?",
            r"Closed orbits need rotation with no growth or decay.",
            [
                C(r"Purely imaginary eigenvalues ($\lambda = \pm \beta i$)", r"Yes. With zero real part there is rotation but no amplitude change, giving closed orbits."),
                W(r"Complex eigenvalues with negative real part", r"A negative real part makes the orbit shrink into a spiral. What real part gives closed loops?"),
                W(r"Two negative real eigenvalues", r"Those give a stable node, not closed orbits. What imaginary condition gives a center?"),
                W(r"One positive and one negative eigenvalue", r"That is a saddle. What purely imaginary condition produces a center?"),
            ],
        ),
        item(
            "mp_n9H-6TQIEJc_3",
            r"A spiral sink (stable spiral) corresponds to complex eigenvalues with which real part?",
            r"Stable means inward-shrinking amplitude.",
            [
                C(r"Negative real part", r"Yes. A negative real part shrinks the amplitude as the trajectory rotates, spiraling inward."),
                W(r"Positive real part", r"A positive real part grows the amplitude, giving an unstable spiral. What sign shrinks it?"),
                W(r"Zero real part", r"Zero real part gives a center, not a spiral. What sign produces inward spiraling?"),
                W(r"Infinite real part", r"Real parts are finite numbers with a sign. Which sign makes the spiral stable?"),
            ],
        ),
        item(
            "mp_n9H-6TQIEJc_4",
            r"Using the trace and determinant, a center occurs when $\det(A) > 0$ and the trace equals what?",
            r"The trace is the sum of the eigenvalues; a center needs purely imaginary ones.",
            [
                C(r"$\text{tr}(A) = 0$", r"Yes. Purely imaginary conjugate eigenvalues sum to zero, so the trace is zero with positive determinant."),
                W(r"$\text{tr}(A) > 0$", r"A positive trace means a positive real part, giving a spiral source. What trace gives pure rotation?"),
                W(r"$\text{tr}(A) < 0$", r"A negative trace gives a spiral sink, not a center. What trace value yields closed orbits?"),
                W(r"$\text{tr}(A) = \det(A)$", r"No such relation defines a center. What specific trace value forces purely imaginary eigenvalues?"),
            ],
        ),
        item(
            "mp_n9H-6TQIEJc_5",
            r"For $A$ with rows $(0, 1)$ and $(-1, 0)$ (trace $0$, determinant $1$), the origin is what?",
            r"The eigenvalues are $\pm i$, purely imaginary.",
            [
                C(r"A center (closed orbits)", r"Yes. With eigenvalues $\pm i$, trajectories form closed orbits around the origin, a center."),
                W(r"A stable spiral", r"A stable spiral needs a negative real part. What does a zero real part give instead?"),
                W(r"A saddle", r"A saddle needs real opposite-sign eigenvalues. What do purely imaginary eigenvalues give?"),
                W(r"A stable node", r"Nodes need real eigenvalues. What closed-orbit equilibrium do imaginary ones give?"),
            ],
        ),
    ],
)

# === 16.3 video 1 ===========================================================
add_micro(
    "RCWkzzLgwf0",
    'Unit 16, Module 16.3, video 1\n           "Linearizing Nonlinear Differential Equations Near a Fixed Point"',
    [
        item(
            "mp_RCWkzzLgwf0_1",
            r"To analyze a nonlinear system near an equilibrium, we approximate it with which matrix?",
            r"It collects the first partial derivatives of the right-hand sides.",
            [
                C(r"The Jacobian matrix of partial derivatives", r"Yes. The Jacobian of the right-hand sides, evaluated at the equilibrium, gives the linear approximation."),
                W(r"The inverse of the coefficient matrix", r"There is no fixed coefficient matrix for a nonlinear system. What matrix of partials is used?"),
                W(r"The identity matrix", r"The identity carries no information about the system. What derivative matrix approximates it?"),
                W(r"A diagonal matrix of the equilibrium values", r"The equilibrium coordinates are not the linearization. What matrix of partial derivatives is needed?"),
            ],
        ),
        item(
            "mp_RCWkzzLgwf0_2",
            r"For the system $x' = f(x, y)$, $y' = g(x, y)$, what are the rows of the Jacobian?",
            r"Each row holds the partials of one right-hand side.",
            [
                C(r"Row $(f_x, f_y)$ and row $(g_x, g_y)$", r"Yes. The first row holds the partials of $f$, the second the partials of $g$."),
                W(r"Row $(f_x, g_x)$ and row $(f_y, g_y)$", r"Each row should come from a single function. Which partials make up the first row?"),
                W(r"Row $(f, g)$ and row $(f, g)$", r"The Jacobian uses derivatives, not the functions themselves. What partials fill the rows?"),
                W(r"Row $(f_{xx}, f_{yy})$ and row $(g_{xx}, g_{yy})$", r"The Jacobian uses first partials, not second. Which first derivatives appear?"),
            ],
        ),
        item(
            "mp_RCWkzzLgwf0_3",
            r"The first step in linearizing is to find the equilibria, which satisfy what?",
            r"At an equilibrium nothing changes in time.",
            [
                C(r"$f(x, y) = 0$ and $g(x, y) = 0$ simultaneously", r"Yes. Equilibria are points where both right-hand sides vanish, so the state stays fixed."),
                W(r"$f(x, y) = g(x, y)$", r"Equality of the two functions is not the condition. What value must each separately take?"),
                W(r"$f_x = g_y = 0$", r"Those are derivative conditions, not the equilibrium condition. What must $f$ and $g$ themselves equal?"),
                W(r"$x = y$", r"No coordinate relation defines equilibria in general. What must the right-hand sides equal?"),
            ],
        ),
        item(
            "mp_RCWkzzLgwf0_4",
            r"For the system $x' = y$, $y' = -\sin x$, what is the Jacobian at the origin $(0, 0)$?",
            r"Differentiate, then substitute $x = 0$ using $\cos 0 = 1$.",
            [
                C(r"Rows $(0, 1)$ and $(-1, 0)$", r"Correct. The Jacobian has rows $(0, 1)$ and $(-\cos x, 0)$; at $x = 0$, $\cos 0 = 1$, giving $(-1, 0)$."),
                W(r"Rows $(0, 1)$ and $(0, -1)$", r"The partial of $-\sin x$ with respect to $x$ is $-\cos x$. What does it give at $x = 0$?"),
                W(r"Rows $(1, 0)$ and $(-1, 0)$", r"The partial of $x' = y$ with respect to $x$ is $0$. What is the first row?"),
                W(r"Rows $(0, 1)$ and $(1, 0)$", r"The derivative of $-\sin x$ carries a minus sign. What is $-\cos 0$?"),
            ],
        ),
        item(
            "mp_RCWkzzLgwf0_5",
            r"Why does linearization describe the local behavior near an equilibrium?",
            r"Think of the tangent-plane approximation to the nonlinear right-hand sides.",
            [
                C(r"The Jacobian is the best linear (first-order Taylor) approximation of the dynamics near the point", r"Yes. Near the equilibrium the system behaves like its first-order Taylor expansion, which is the Jacobian."),
                W(r"It gives the exact global solution everywhere", r"Linearization is only a local approximation, not global. What does it capture near the point?"),
                W(r"It removes all equilibria from the system", r"The equilibrium remains; we study behavior around it. What approximation does the Jacobian provide?"),
                W(r"It replaces the system with its second derivatives", r"Linearization uses first derivatives, not second. What order of Taylor approximation is it?"),
            ],
        ),
    ],
)

# === 16.3 video 2 ===========================================================
add_micro(
    "UCpMao94iFg",
    'Unit 16, Module 16.3, video 2\n           "Linearization, MIT 18.03SC"',
    [
        item(
            "mp_UCpMao94iFg_1",
            r"After computing the Jacobian at an equilibrium, how is the local stability determined?",
            r"Treat the Jacobian as the matrix of a linear system.",
            [
                C(r"From the eigenvalues of the Jacobian", r"Yes. The eigenvalues of the Jacobian classify the equilibrium just as for a linear system."),
                W(r"From the determinant of the original nonlinear functions", r"Stability follows from the Jacobian's eigenvalues, not the raw functions. What spectral data is used?"),
                W(r"From the size of the equilibrium coordinates", r"The location does not set stability. What eigenvalues govern it?"),
                W(r"From the number of equilibria", r"Counting equilibria does not classify any one of them. What eigenvalues decide local stability?"),
            ],
        ),
        item(
            "mp_UCpMao94iFg_2",
            r"The Hartman-Grobman theorem guarantees the linearization predicts local behavior when the equilibrium is what?",
            r"It must be hyperbolic: no eigenvalue sitting on the imaginary axis.",
            [
                C(r"Hyperbolic, with all eigenvalues having nonzero real part", r"Yes. When no eigenvalue has zero real part, the linearization faithfully captures the local phase portrait."),
                W(r"Any equilibrium without exception", r"Borderline cases can fail. What restriction on the eigenvalues is required?"),
                W(r"One where an eigenvalue is purely imaginary", r"That is exactly the borderline case where it can fail. What real-part condition is needed?"),
                W(r"One located at the origin only", r"Location does not matter for the theorem. What eigenvalue condition does?"),
            ],
        ),
        item(
            "mp_UCpMao94iFg_3",
            r"In which case can linearization fail to predict the true nonlinear behavior?",
            r"The delicate case is when the linearization gives a center.",
            [
                C(r"When the Jacobian has purely imaginary eigenvalues (a borderline center)", r"Yes. A linear center is borderline; nonlinear terms can turn it into a slow spiral, so linearization may mislead."),
                W(r"When the eigenvalues are real and distinct", r"That hyperbolic case is reliably predicted. Which non-hyperbolic case is risky?"),
                W(r"When the equilibrium is a saddle", r"Saddles are hyperbolic and reliably predicted. What borderline case fails?"),
                W(r"Whenever the system is two-dimensional", r"Dimension alone is not the issue. What eigenvalue situation causes failure?"),
            ],
        ),
        item(
            "mp_UCpMao94iFg_4",
            r"If the Jacobian at an equilibrium has eigenvalues $-2$ and $-5$, the equilibrium is locally what?",
            r"Both eigenvalues are negative reals.",
            [
                C(r"A stable node (locally attracting)", r"Yes. Two negative real eigenvalues make the equilibrium a locally stable node."),
                W(r"An unstable saddle", r"A saddle needs opposite-sign eigenvalues. Are $-2$ and $-5$ opposite in sign?"),
                W(r"An unstable node", r"An unstable node needs positive eigenvalues. What does the negative sign on both give?"),
                W(r"A center", r"Centers need purely imaginary eigenvalues. Are $-2$ and $-5$ real or imaginary?"),
            ],
        ),
        item(
            "mp_UCpMao94iFg_5",
            r"If a Jacobian has eigenvalues $3$ and $-1$, the equilibrium is locally what?",
            r"The eigenvalues have opposite signs.",
            [
                C(r"A saddle (unstable)", r"Yes. One positive and one negative eigenvalue make the equilibrium a saddle locally."),
                W(r"A stable node", r"Stability needs both eigenvalues negative. What does the positive eigenvalue $3$ do?"),
                W(r"A spiral", r"Spirals need complex eigenvalues. Are $3$ and $-1$ real or complex?"),
                W(r"A center", r"Centers need purely imaginary eigenvalues. What do opposite-sign reals give?"),
            ],
        ),
    ],
)

# === 16.4 video 1 ===========================================================
add_micro(
    "ifkvwzkm2Qc",
    'Unit 16, Module 16.4, video 1\n           "Nullclines for Non-linear Systems"',
    [
        item(
            "mp_ifkvwzkm2Qc_1",
            r"For the system $x' = f(x, y)$, $y' = g(x, y)$, what defines the $x$-nullcline?",
            r"It is the set where the rate of change of $x$ vanishes.",
            [
                C(r"The curve where $x' = 0$, that is $f(x, y) = 0$", r"Yes. The $x$-nullcline is where $x' = f(x, y) = 0$."),
                W(r"The curve where $y' = 0$", r"That defines the $y$-nullcline, not the $x$-nullcline. Which rate vanishes for the $x$-nullcline?"),
                W(r"The curve where $x = 0$", r"Setting the variable to zero is not the same as setting its rate to zero. What must vanish?"),
                W(r"The curve where $x' = y'$", r"Equality of the two rates is not a nullcline. What single rate is zero on the $x$-nullcline?"),
            ],
        ),
        item(
            "mp_ifkvwzkm2Qc_2",
            r"Equilibria of the system are located where which curves intersect?",
            r"At an equilibrium both rates vanish at once.",
            [
                C(r"Where an $x$-nullcline meets a $y$-nullcline", r"Yes. At such intersections both $x' = 0$ and $y' = 0$, so the point is an equilibrium."),
                W(r"Where two $x$-nullclines meet", r"Both must come from different rates. Which two kinds of nullclines must intersect?"),
                W(r"Where a nullcline meets the $x$-axis", r"The axis is not generally a nullcline. Which two nullclines must cross?"),
                W(r"Anywhere a single nullcline bends", r"A bend in one curve does not make both rates vanish. What intersection is required?"),
            ],
        ),
        item(
            "mp_ifkvwzkm2Qc_3",
            r"On the $x$-nullcline (where $x' = 0$), in which direction does the flow point?",
            r"If $x$ is momentarily not changing, only $y$ moves.",
            [
                C(r"Purely vertically (only $y$ changes)", r"Yes. With $x' = 0$, the velocity has no horizontal component, so the flow is vertical."),
                W(r"Purely horizontally (only $x$ changes)", r"With $x' = 0$ the horizontal component is zero. Which component remains?"),
                W(r"At 45 degrees always", r"No fixed angle applies. What direction results when the horizontal rate is zero?"),
                W(r"There is no motion at all", r"Motion stops only at equilibria, where both rates vanish. What single direction remains on the $x$-nullcline?"),
            ],
        ),
        item(
            "mp_ifkvwzkm2Qc_4",
            r"For $x' = x - y$, what is the equation of the $x$-nullcline?",
            r"Set $x' = 0$ and solve.",
            [
                C(r"$y = x$", r"Correct. Setting $x - y = 0$ gives the line $y = x$."),
                W(r"$y = -x$", r"Solve $x - y = 0$, not $x + y = 0$. What line results?"),
                W(r"$x = 0$", r"The nullcline comes from $x' = 0$, which is $x - y = 0$, not $x = 0$. What equation is that?"),
                W(r"$y = 0$", r"Setting $y = 0$ ignores the $x$ term. What does $x - y = 0$ give?"),
            ],
        ),
        item(
            "mp_ifkvwzkm2Qc_5",
            r"Why are nullclines a useful first step in sketching a phase portrait?",
            r"They organize the plane by the direction of flow.",
            [
                C(r"They locate equilibria and split the plane into regions of consistent flow direction", r"Yes. Nullclines reveal equilibria and divide the plane into regions where the flow direction is known."),
                W(r"They give the exact formula for every trajectory", r"Nullclines do not solve the system explicitly. What qualitative structure do they reveal?"),
                W(r"They list the eigenvalues directly", r"Eigenvalues come from the Jacobian, not nullclines. What geometric information do nullclines give?"),
                W(r"They prove the system is linear", r"Nullclines apply to nonlinear systems too. What do they organize in the plane?"),
            ],
        ),
    ],
)

# === 16.4 video 2 ===========================================================
add_micro(
    "qocE0phJ4t8",
    'Unit 16, Module 16.4, video 2\n           "Analyzing stability of equilibria for systems of nonlinear DEs using a phase plane"',
    [
        item(
            "mp_qocE0phJ4t8_1",
            r"To classify the stability of a specific equilibrium of a nonlinear system, you evaluate the Jacobian where?",
            r"The linear approximation is local to each rest point.",
            [
                C(r"At that particular equilibrium point", r"Yes. The Jacobian must be evaluated at the equilibrium being analyzed, since each can differ."),
                W(r"At the origin always", r"Not every equilibrium is at the origin. Where must the Jacobian be evaluated?"),
                W(r"At an arbitrary point of your choosing", r"The point matters; it must be the equilibrium. Which point is correct?"),
                W(r"Averaged over the whole plane", r"Stability is local, not an average. At which point is the Jacobian taken?"),
            ],
        ),
        item(
            "mp_qocE0phJ4t8_2",
            r"A nonlinear system can have how many equilibria?",
            r"Unlike a generic linear system, the nullclines can cross many times.",
            [
                C(r"Possibly several, wherever the nullclines intersect", r"Yes. Nonlinear nullclines may cross at multiple points, giving several equilibria."),
                W(r"Exactly one, always", r"A single equilibrium is typical of linear systems. How many can a nonlinear system have?"),
                W(r"Never more than two", r"There is no such cap. What sets the number of equilibria?"),
                W(r"Always infinitely many", r"The number is finite in typical cases. What determines how many there are?"),
            ],
        ),
        item(
            "mp_qocE0phJ4t8_3",
            r"If the Jacobian at one equilibrium has eigenvalues with both negative real parts, that equilibrium is what?",
            r"Negative real parts mean local decay.",
            [
                C(r"Locally asymptotically stable (attracting)", r"Yes. Eigenvalues with negative real parts pull nearby trajectories in, so the equilibrium is locally stable."),
                W(r"Unstable (repelling)", r"Repelling needs a positive real part. What do negative real parts do nearby?"),
                W(r"A saddle", r"A saddle needs real parts of opposite sign. What do two negative real parts give?"),
                W(r"Neutrally stable with closed orbits", r"Closed orbits need zero real parts. What do strictly negative real parts give?"),
            ],
        ),
        item(
            "mp_qocE0phJ4t8_4",
            r"At a saddle equilibrium of a nonlinear system, the overall stability is what?",
            r"Any direction of escape makes an equilibrium unstable.",
            [
                C(r"Unstable, because of the outgoing (positive-eigenvalue) direction", r"Yes. A saddle has an unstable direction, so the equilibrium is unstable overall."),
                W(r"Stable, because of the incoming direction", r"One incoming direction cannot overcome an outgoing one. What does the escaping direction imply?"),
                W(r"Neutrally stable", r"Saddles are not neutral; they have a genuine escape direction. What is the overall verdict?"),
                W(r"Always a center", r"Saddles are not centers. What does the unstable direction make the equilibrium?"),
            ],
        ),
        item(
            "mp_qocE0phJ4t8_5",
            r"Combining nullclines with Jacobian analysis lets you build what?",
            r"You assemble local pictures into a global one.",
            [
                C(r"A qualitative global phase portrait of the nonlinear system", r"Yes. Nullclines and local classifications together sketch the global behavior without solving exactly."),
                W(r"An exact closed-form solution", r"These tools are qualitative, not exact solvers. What kind of picture do they yield?"),
                W(r"The matrix exponential of the system", r"There is no single matrix for a nonlinear system. What qualitative result emerges?"),
                W(r"A guarantee of a unique equilibrium", r"Nonlinear systems may have several equilibria. What overall sketch do these tools produce?"),
            ],
        ),
    ],
)

# === 16.5 video 1 ===========================================================
add_micro(
    "BaVfVVMcxQ4",
    'Unit 16, Module 16.5, video 1\n           "Systems of Autonomous Nonlinear Differential Equations and Phase Plane Analysis"',
    [
        item(
            "mp_BaVfVVMcxQ4_1",
            r"What does it mean for a system $x' = f(x, y)$, $y' = g(x, y)$ to be autonomous?",
            r"Check whether time $t$ appears explicitly on the right-hand sides.",
            [
                C(r"The right-hand sides do not depend explicitly on $t$", r"Yes. An autonomous system has right-hand sides depending only on the state, not directly on time."),
                W(r"The system is linear", r"Autonomy is about time dependence, not linearity. What must be absent from the right-hand sides?"),
                W(r"The solutions are all constant", r"Autonomous systems have plenty of non-constant solutions. What feature defines autonomy?"),
                W(r"The right-hand sides depend explicitly on $t$", r"That is the opposite of autonomous. What dependence is excluded?"),
            ],
        ),
        item(
            "mp_BaVfVVMcxQ4_2",
            r"In an autonomous system, can two distinct trajectories cross each other in the phase plane?",
            r"Recall the uniqueness theorem for solutions.",
            [
                C(r"No; uniqueness of solutions forbids trajectories from crossing", r"Yes. If they crossed, two solutions would share a point, violating uniqueness."),
                W(r"Yes; trajectories cross freely", r"Crossing would break uniqueness of solutions. What does the uniqueness theorem forbid?"),
                W(r"Only at equilibria", r"Trajectories approach but do not pass through equilibria in finite ways that cross. What does uniqueness imply generally?"),
                W(r"Only if the system is nonlinear", r"Nonlinearity does not permit crossings either. What principle blocks them?"),
            ],
        ),
        item(
            "mp_BaVfVVMcxQ4_3",
            r"To analyze a nonlinear autonomous system, the standard strategy is what?",
            r"Study each rest point with its own linear approximation.",
            [
                C(r"Find all equilibria, then linearize and classify each one", r"Yes. Locating equilibria and linearizing at each builds the local behavior throughout the plane."),
                W(r"Assume the system is globally linear", r"Nonlinear systems are not globally linear. What local procedure is used at each equilibrium?"),
                W(r"Ignore the equilibria and solve directly", r"Equilibria organize the whole portrait. What should be done at each one?"),
                W(r"Compute a single global eigenvalue", r"There is no single global matrix. What is done equilibrium by equilibrium?"),
            ],
        ),
        item(
            "mp_BaVfVVMcxQ4_4",
            r"A limit cycle is which kind of phase-plane feature?",
            r"It is a closed loop that nearby trajectories spiral toward or away from.",
            [
                C(r"An isolated closed orbit that attracts or repels nearby trajectories", r"Yes. A limit cycle is an isolated periodic orbit, a genuinely nonlinear phenomenon."),
                W(r"A straight-line trajectory through the origin", r"Limit cycles are closed loops, not straight lines. What isolated periodic feature is meant?"),
                W(r"One of the infinitely many nested orbits of a center", r"Center orbits are not isolated; limit cycles are. What distinguishes a limit cycle?"),
                W(r"An equilibrium point", r"A limit cycle is a closed curve, not a single point. What periodic structure is it?"),
            ],
        ),
        item(
            "mp_BaVfVVMcxQ4_5",
            r"Limit cycles can occur in which kind of system?",
            r"They are absent from simple linear systems.",
            [
                C(r"Nonlinear systems", r"Yes. Isolated periodic orbits are a nonlinear phenomenon; linear systems cannot produce them."),
                W(r"Only linear systems", r"Linear systems have centers, not isolated limit cycles. Which systems allow them?"),
                W(r"Only one-dimensional systems", r"A single first-order autonomous equation cannot oscillate. Which systems support limit cycles?"),
                W(r"Any system with constant coefficients", r"Constant-coefficient linear systems lack isolated cycles. What nonlinearity is needed?"),
            ],
        ),
    ],
)

# === 16.5 video 2 ===========================================================
add_micro(
    "vBwyD4JJlSs",
    'Unit 16, Module 16.5, video 2\n           "Drawing Phase Portraits for Nonlinear Systems"',
    [
        item(
            "mp_vBwyD4JJlSs_1",
            r"When sketching a nonlinear phase portrait, what do you draw first?",
            r"Start with the curves that organize the flow and locate rest points.",
            [
                C(r"The nullclines and the equilibria where they intersect", r"Yes. Nullclines and their intersections frame the portrait and locate the equilibria."),
                W(r"A few random trajectories", r"Random curves give no structure first. What organizing curves come first?"),
                W(r"The eigenvectors of the whole plane", r"There is no single global eigenvector field. What curves should be drawn first?"),
                W(r"The exact solution formula", r"Nonlinear systems rarely have simple formulas. What qualitative curves start the sketch?"),
            ],
        ),
        item(
            "mp_vBwyD4JJlSs_2",
            r"Near each equilibrium, the local phase portrait is sketched using what?",
            r"Use the linear approximation there.",
            [
                C(r"The eigenvalues and eigenvectors of the Jacobian at that equilibrium", r"Yes. The Jacobian's spectrum gives the local node, saddle, or spiral structure to sketch."),
                W(r"The global determinant of the system", r"There is no single global determinant for a nonlinear system. What local data is used?"),
                W(r"The value of the forcing function", r"Autonomous systems have no separate forcing here. What local linearization guides the sketch?"),
                W(r"The initial condition only", r"Initial conditions pick one trajectory, not the local structure. What Jacobian data shapes it?"),
            ],
        ),
        item(
            "mp_vBwyD4JJlSs_3",
            r"Direction arrows on the nullclines help because on a nullcline the flow is what?",
            r"On a nullcline one of the two rates is zero.",
            [
                C(r"Purely horizontal or purely vertical", r"Yes. On a $y$-nullcline the flow is horizontal and on an $x$-nullcline it is vertical, fixing arrow directions."),
                W(r"Always diagonal", r"With one rate zero, the flow aligns with an axis, not a diagonal. What two directions occur?"),
                W(r"Always zero (no motion)", r"Motion stops only at equilibria, not all along a nullcline. What axis-aligned flow occurs?"),
                W(r"Always circular", r"Circular flow is not a nullcline property. What straight directions does a nullcline force?"),
            ],
        ),
        item(
            "mp_vBwyD4JJlSs_4",
            r"Why must global trajectories be drawn consistently with the local pictures at the equilibria?",
            r"Trajectories obey uniqueness and must match the flow everywhere.",
            [
                C(r"Trajectories cannot cross and must blend the local behaviors into one smooth flow", r"Yes. Because trajectories never cross, they must connect the local structures into a coherent global flow."),
                W(r"Because all trajectories are straight lines", r"Nonlinear trajectories curve. What constraint forces consistency with local pictures?"),
                W(r"Because each equilibrium is independent of the rest", r"The flow is one connected field, not independent pieces. What links the local pictures?"),
                W(r"Because the system is linear globally", r"It is nonlinear globally. What non-crossing principle ties the sketch together?"),
            ],
        ),
        item(
            "mp_vBwyD4JJlSs_5",
            r"A separatrix in a nonlinear phase portrait does what?",
            r"It is a special trajectory acting as a boundary.",
            [
                C(r"Divides the plane into regions with qualitatively different long-term behavior", r"Yes. A separatrix is a boundary trajectory separating basins of different eventual behavior."),
                W(r"Connects every equilibrium in a single loop", r"It is a dividing curve, not a connector of all rest points. What does it separate?"),
                W(r"Marks where the solution is undefined", r"Solutions are defined on separatrices. What boundary role does it play?"),
                W(r"Lists the eigenvalues of the system", r"A separatrix is a curve, not a list of numbers. What regions does it bound?"),
            ],
        ),
    ],
)

# === 16.6 video 1 ===========================================================
add_micro(
    "ccIl0clxJpE",
    'Unit 16, Module 16.6, video 1\n           "The simplest dynamical system (Lotka-Volterra predator-prey model)"',
    [
        item(
            "mp_ccIl0clxJpE_1",
            r"In the Lotka-Volterra model $x' = ax - bxy$, $y' = -cy + dxy$, which variable is the predator?",
            r"The predator declines on its own and benefits from the interaction term.",
            [
                C(r"$y$, since it decays as $-cy$ without prey and grows with the $+dxy$ interaction", r"Yes. The $-cy$ term is natural predator decline and $+dxy$ is the gain from eating prey."),
                W(r"$x$, since it grows as $ax$ on its own", r"Self-growth without the other species is the prey's trait. Which variable declines alone?"),
                W(r"Neither; both are prey", r"The model has one of each. Which variable has natural decline and interaction-driven growth?"),
                W(r"Both equally", r"The roles are asymmetric. Which variable benefits from the interaction term $+dxy$?"),
            ],
        ),
        item(
            "mp_ccIl0clxJpE_2",
            r"In the absence of predators ($y = 0$), the prey equation becomes $x' = ax$. What does the prey population do?",
            r"This is simple exponential growth.",
            [
                C(r"Grows exponentially", r"Yes. With no predators, $x' = ax$ gives unbounded exponential growth of the prey."),
                W(r"Decays to zero", r"The coefficient $a$ is a positive growth rate, not decay. What does $x' = ax$ produce?"),
                W(r"Stays constant", r"A nonzero $ax$ term forces change. What kind of growth does $x' = ax$ give?"),
                W(r"Oscillates periodically", r"A single linear equation $x' = ax$ does not oscillate. What behavior results?"),
            ],
        ),
        item(
            "mp_ccIl0clxJpE_3",
            r"In the absence of prey ($x = 0$), the predator equation becomes $y' = -cy$. What does the predator population do?",
            r"This is exponential decay.",
            [
                C(r"Declines exponentially to zero", r"Yes. With no prey to eat, $y' = -cy$ drives the predators to extinction exponentially."),
                W(r"Grows exponentially", r"The coefficient $-c$ is negative, so it cannot grow. What does $y' = -cy$ give?"),
                W(r"Stays constant", r"A nonzero $-cy$ term forces decline. What happens to the predators?"),
                W(r"Oscillates", r"A single linear equation $y' = -cy$ does not oscillate. What decay results?"),
            ],
        ),
        item(
            "mp_ccIl0clxJpE_4",
            r"Besides the origin, the coexistence equilibrium of $x' = ax - bxy$, $y' = -cy + dxy$ is at which point?",
            r"Set each right-hand side to zero and factor out the nonzero population.",
            [
                C(r"$x = c/d$, $y = a/b$", r"Correct. From $a - by = 0$ and $-c + dx = 0$ we get $y = a/b$ and $x = c/d$."),
                W(r"$x = a/b$, $y = c/d$", r"The prey equation gives $y = a/b$, and the predator equation gives $x = c/d$. Which variable is which?"),
                W(r"$x = b/a$, $y = d/c$", r"Solve $a - by = 0$ for $y$, giving $a/b$, not $d/c$. What does each equation yield?"),
                W(r"$x = a/c$, $y = b/d$", r"Factor each equation carefully: $-c + dx = 0$ gives $x = c/d$. What is $y$?"),
            ],
        ),
        item(
            "mp_ccIl0clxJpE_5",
            r"What do the interaction terms $-bxy$ and $+dxy$ represent biologically?",
            r"They are proportional to the number of predator-prey encounters.",
            [
                C(r"The effect of predator-prey encounters: prey lost and predators gained", r"Yes. The product $xy$ counts encounters; prey decrease ($-bxy$) and predators increase ($+dxy$)."),
                W(r"The natural birth rates of both species", r"Natural rates are the $ax$ and $-cy$ terms. What do the $xy$ products model?"),
                W(r"Random migration in and out", r"The model has no migration terms. What do the cross terms capture?"),
                W(r"Seasonal temperature changes", r"There is no temperature in the model. What interaction does $xy$ represent?"),
            ],
        ),
    ],
)

# === 16.6 video 2 ===========================================================
add_micro(
    "Zg9k9ijiYPA",
    'Unit 16, Module 16.6, video 2\n           "Predator-Prey Model (Lotka-Volterra) Overview and Steady States"',
    [
        item(
            "mp_Zg9k9ijiYPA_1",
            r"In the standard Lotka-Volterra model, the trajectories around the coexistence equilibrium are what?",
            r"The populations rise and fall repeatedly without settling.",
            [
                C(r"Closed orbits, so the populations oscillate periodically", r"Yes. The coexistence equilibrium is a center, so populations cycle periodically around it."),
                W(r"Inward spirals to a steady state", r"The classic model does not damp to a steady state; it cycles. What closed shape do the orbits form?"),
                W(r"Straight lines to extinction", r"Coexistence trajectories do not run to extinction. What periodic shape do they trace?"),
                W(r"A single fixed point with no motion", r"Away from equilibrium the populations change. What closed curves do they follow?"),
            ],
        ),
        item(
            "mp_Zg9k9ijiYPA_2",
            r"The predator and prey population peaks are related in time how?",
            r"Predators respond to prey abundance with a delay.",
            [
                C(r"Out of phase: the predator peak lags behind the prey peak", r"Yes. Prey abundance feeds predator growth, so the predator peak trails the prey peak."),
                W(r"Exactly in phase, peaking together", r"Predators need time to respond to prey numbers. What phase relationship results?"),
                W(r"The predator peak comes before the prey peak", r"Predators rise only after prey are plentiful. Which peak comes first?"),
                W(r"They never change", r"The populations do oscillate. What is the timing relation between the peaks?"),
            ],
        ),
        item(
            "mp_Zg9k9ijiYPA_3",
            r"How many equilibria does the standard Lotka-Volterra model have?",
            r"Count the origin plus the coexistence point.",
            [
                C(r"Two: the origin and the coexistence point", r"Yes. The model has extinction at the origin and the coexistence equilibrium."),
                W(r"One: only the coexistence point", r"The origin is also an equilibrium. How many are there in total?"),
                W(r"Infinitely many", r"The nullclines cross at just two points. How many equilibria result?"),
                W(r"None", r"Both rates can vanish simultaneously at specific points. How many such points exist?"),
            ],
        ),
        item(
            "mp_Zg9k9ijiYPA_4",
            r"At the origin $(0, 0)$ of the predator-prey model, the equilibrium type is what?",
            r"The linearization there has eigenvalues $a > 0$ and $-c < 0$.",
            [
                C(r"A saddle (unstable)", r"Yes. The Jacobian at the origin has eigenvalues $a$ and $-c$ of opposite sign, a saddle."),
                W(r"A stable node", r"Stability needs both eigenvalues negative, but $a > 0$. What does the positive eigenvalue give?"),
                W(r"A center", r"The origin's eigenvalues are real and opposite in sign, not imaginary. What type is that?"),
                W(r"A stable spiral", r"Spirals need complex eigenvalues; here they are real. What opposite-sign type results?"),
            ],
        ),
        item(
            "mp_Zg9k9ijiYPA_5",
            r"A realistic refinement adds a logistic term limiting prey growth. This typically changes the coexistence equilibrium into what?",
            r"Damping turns neutral cycles into a settling behavior.",
            [
                C(r"A stable equilibrium that trajectories spiral into", r"Yes. Logistic self-limitation adds damping, turning the neutral center into a stable spiral or node."),
                W(r"A saddle point", r"Self-limitation stabilizes rather than destabilizes coexistence. What stable type results?"),
                W(r"An unchanged neutral center", r"The added damping removes the neutral cycles. What does coexistence become?"),
                W(r"A source that repels trajectories", r"Damping attracts rather than repels. What stable behavior results?"),
            ],
        ),
    ],
)

# ============================================================================
# UNIT 15 MASTERY  (30 items spanning modules 15.1 through 15.7)
# ============================================================================

# --- 15.1 Converting higher-order equations to systems ----------------------
m15(
    "um_15_1",
    r"To convert $y'' + 5y' + 6y = 0$ into a first-order system with $x_1 = y$, $x_2 = y'$, what is $x_2'$?",
    r"Solve the equation for $y''$ and rewrite using $x_1, x_2$.",
    [
        C(r"$x_2' = -6x_1 - 5x_2$", r"Correct. From $y'' = -6y - 5y'$ we read off $x_2' = -6x_1 - 5x_2$."),
        W(r"$x_2' = 6x_1 + 5x_2$", r"Both terms move across the equals sign from $y'' + 5y' + 6y = 0$. What signs appear?"),
        W(r"$x_2' = -5x_1 - 6x_2$", r"The $6y$ term pairs with $x_1$ and $5y'$ with $x_2$. Which coefficient goes with $x_1$?"),
        W(r"$x_2' = x_1$", r"That ignores the original equation. What does solving for $y''$ give?"),
    ],
)
m15(
    "um_15_2",
    r"A fourth-order linear ODE converts into a first-order system of how many equations?",
    r"Use a variable for each derivative from $y$ up to $y'''$.",
    [
        C(r"Four", r"Yes. The variables $y, y', y'', y'''$ give exactly four first-order equations."),
        W(r"Three", r"Count the variables from $y$ through $y'''$. How many is that?"),
        W(r"Eight", r"Each derivative becomes one variable, not two. How many derivatives below order four, including $y$?"),
        W(r"Two", r"Only a second-order ODE gives two. What is the count for order four?"),
    ],
)
m15(
    "um_15_3",
    r"Writing $y'' + 4y = 0$ as $\mathbf{x}' = A\mathbf{x}$ with $x_1 = y$, $x_2 = y'$, what are the rows of $A$?",
    r"First row: $x_1' = x_2$. Second row: $x_2' = -4x_1$.",
    [
        C(r"Rows $(0, 1)$ and $(-4, 0)$", r"Correct. $x_1' = x_2$ gives $(0,1)$ and $x_2' = -4x_1$ gives $(-4, 0)$."),
        W(r"Rows $(0, 1)$ and $(4, 0)$", r"The term $4y$ moves across with a sign change. What sign does $-4$ carry?"),
        W(r"Rows $(1, 0)$ and $(-4, 0)$", r"The equation $x_1' = x_2$ has no $x_1$ term. What is the first row?"),
        W(r"Rows $(0, 1)$ and $(0, -4)$", r"The coefficient $-4$ multiplies $x_1$, not $x_2$. Which slot holds it?"),
    ],
)
m15(
    "um_15_4",
    r"The main reason to rewrite a higher-order ODE as a first-order system is what?",
    r"Think about the matrix machinery built for first-order vector equations.",
    [
        C(r"To apply eigenvalue, matrix-exponential, and standard numerical methods", r"Yes. The form $\mathbf{x}' = A\mathbf{x}$ unlocks linear-algebra and numerical solution techniques."),
        W(r"To make the equation have fewer unknowns", r"Conversion adds unknowns rather than removing them. What is the real benefit?"),
        W(r"To guarantee the equation is separable", r"Conversion does not make systems separable. What solution machinery does it enable?"),
        W(r"To eliminate the need for initial conditions", r"Initial conditions are still needed. What methods does the system form allow?"),
    ],
)

# --- 15.2 The eigenvalue method ---------------------------------------------
m15(
    "um_15_5",
    r"The eigenvalue method solves $\mathbf{x}' = A\mathbf{x}$ by trying which form?",
    r"Guess an exponential in time times a fixed direction.",
    [
        C(r"$\mathbf{x} = e^{\lambda t}\mathbf{v}$", r"Yes. This trial converts the system into the eigenvalue problem $A\mathbf{v} = \lambda\mathbf{v}$."),
        W(r"$\mathbf{x} = t^\lambda \mathbf{v}$", r"A constant-coefficient system calls for an exponential, not a power of $t$. What time factor is used?"),
        W(r"$\mathbf{x} = e^{\lambda t}$ (scalar)", r"The unknown is a vector and needs a direction. What vector multiplies the exponential?"),
        W(r"$\mathbf{x} = \sin(\lambda t)\mathbf{v}$", r"A bare sine is not the general trial. What exponential form is standard?"),
    ],
)
m15(
    "um_15_6",
    r"Substituting $\mathbf{x} = e^{\lambda t}\mathbf{v}$ into $\mathbf{x}' = A\mathbf{x}$ yields which equation?",
    r"Cancel the nonzero scalar $e^{\lambda t}$ after differentiating.",
    [
        C(r"$A\mathbf{v} = \lambda\mathbf{v}$", r"Yes. The system collapses to the eigenvalue equation $A\mathbf{v} = \lambda\mathbf{v}$."),
        W(r"$A\mathbf{v} = 0$", r"Differentiating brings down a factor $\lambda$ on the right. What does it multiply?"),
        W(r"$A\mathbf{v} = \lambda^2\mathbf{v}$", r"Only one derivative is taken, giving one power of $\lambda$. What power is correct?"),
        W(r"$\mathbf{v} = \lambda A\mathbf{v}$", r"The factor $\lambda$ lands on $\mathbf{v}$, not on $A\mathbf{v}$. What is the standard eigenvalue equation?"),
    ],
)
m15(
    "um_15_7",
    r"Eigenvalues are the solutions of which equation?",
    r"A nontrivial eigenvector requires $A - \lambda I$ to be singular.",
    [
        C(r"$\det(A - \lambda I) = 0$", r"Yes. Singularity of $A - \lambda I$ is exactly $\det(A - \lambda I) = 0$."),
        W(r"$\det(A) = 0$", r"The shift by $\lambda I$ is essential. What matrix must be singular?"),
        W(r"$\text{tr}(A - \lambda I) = 0$", r"The trace condition is not the characteristic equation. What determinant must vanish?"),
        W(r"$A\mathbf{v} = 0$", r"That is a special case forcing $\lambda = 0$. What general determinant equation gives all eigenvalues?"),
    ],
)
m15(
    "um_15_8",
    r"For distinct real eigenvalues, the general solution of $\mathbf{x}' = A\mathbf{x}$ is which combination?",
    r"Superpose one exponential mode per eigenpair.",
    [
        C(r"$c_1 e^{\lambda_1 t}\mathbf{v}_1 + c_2 e^{\lambda_2 t}\mathbf{v}_2$", r"Yes. Each eigenpair contributes a mode, combined linearly."),
        W(r"$c_1 e^{\lambda_1 t} + c_2 e^{\lambda_2 t}$", r"The eigenvectors give each mode its direction. What vectors are missing?"),
        W(r"$c_1 \mathbf{v}_1 + c_2 \mathbf{v}_2$", r"Without exponentials there is no time dependence. What factor accompanies each eigenvector?"),
        W(r"$e^{\lambda_1 t}\mathbf{v}_1 \cdot e^{\lambda_2 t}\mathbf{v}_2$", r"Modes add, they do not multiply. How are they combined?"),
    ],
)
m15(
    "um_15_9",
    r"For the matrix with rows $(2, 1)$ and $(1, 2)$, what are the eigenvalues?",
    r"Use trace $4$ and determinant $3$, or the symmetric trick $\lambda = m \pm \sqrt{m^2 - p}$.",
    [
        C(r"$3$ and $1$", r"Correct. Trace $4$, determinant $3$ give $\lambda^2 - 4\lambda + 3 = 0$, so $\lambda = 3, 1$."),
        W(r"$2$ and $2$", r"The off-diagonal entries shift the eigenvalues off the diagonal. What does $\lambda^2 - 4\lambda + 3 = 0$ give?"),
        W(r"$4$ and $3$", r"Those are the trace and determinant, not the roots. What two numbers sum to $4$ and multiply to $3$?"),
        W(r"$3$ and $-1$", r"The product of the roots is $+3$, so both are positive. What is the second root?"),
    ],
)

# --- 15.3 Complex eigenvalues -----------------------------------------------
m15(
    "um_15_10",
    r"For $A$ with rows $(0, 1)$ and $(-1, 0)$, the eigenvalues are which pair?",
    r"The characteristic equation is $\lambda^2 + 1 = 0$.",
    [
        C(r"$\pm i$", r"Correct. $\lambda^2 + 1 = 0$ gives the purely imaginary pair $\pm i$."),
        W(r"$\pm 1$", r"Solve $\lambda^2 = -1$, not $\lambda^2 = 1$. What are the roots?"),
        W(r"$0$ and $0$", r"The constant term is $1$, so the roots are nonzero. What solves $\lambda^2 = -1$?"),
        W(r"$\pm i\sqrt{2}$", r"The equation is $\lambda^2 = -1$, not $\lambda^2 = -2$. What is the square root of $-1$?"),
    ],
)
m15(
    "um_15_11",
    r"Complex eigenvalues of a real matrix always appear how?",
    r"Real coefficients impose a symmetry on complex roots.",
    [
        C(r"In conjugate pairs $\alpha \pm \beta i$", r"Yes. A real characteristic polynomial forces conjugate complex roots."),
        W(r"As a single complex number", r"A real polynomial cannot have one lone complex root. What partner accompanies it?"),
        W(r"As two unrelated complex numbers", r"They are related by conjugation, not unrelated. What pairing is forced?"),
        W(r"As real numbers in disguise", r"If complex, they are genuinely complex. What conjugate structure holds?"),
    ],
)
m15(
    "um_15_12",
    r"For eigenvalues $\alpha \pm \beta i$, what do $\alpha$ and $\beta$ respectively control in the phase portrait?",
    r"One sets growth or decay; the other sets rotation speed.",
    [
        C(r"$\alpha$ sets growth or decay; $\beta$ sets the oscillation frequency", r"Yes. The real part is the growth rate and the imaginary part is the angular frequency."),
        W(r"$\alpha$ sets frequency; $\beta$ sets growth", r"The roles are reversed. Which part lives inside the cosine and sine?"),
        W(r"Both set the frequency", r"They play different roles. What does the real part govern?"),
        W(r"Both set the growth rate", r"Only the real part affects amplitude. What does the imaginary part control?"),
    ],
)
m15(
    "um_15_13",
    r"For complex eigenvalues with $\alpha = 0$ (purely imaginary), the origin is what?",
    r"With no growth envelope, the oscillation has constant amplitude.",
    [
        C(r"A center, with closed orbits", r"Yes. Zero real part means constant amplitude, so trajectories close into orbits, a center."),
        W(r"A stable spiral", r"A stable spiral needs a negative real part. What does $\alpha = 0$ give?"),
        W(r"A saddle", r"Saddles come from real opposite-sign eigenvalues. What do purely imaginary ones give?"),
        W(r"A stable node", r"Nodes come from real eigenvalues. What closed-orbit type results here?"),
    ],
)

# --- 15.4 The matrix exponential --------------------------------------------
m15(
    "um_15_14",
    r"How is the matrix exponential $e^{At}$ defined?",
    r"It copies the scalar power series with $A$ replacing the number.",
    [
        C(r"$I + At + \frac{(At)^2}{2!} + \frac{(At)^3}{3!} + \cdots$", r"Yes. It is the same power series as the scalar exponential, summing powers of $At$ over factorials."),
        W(r"$I + At$ only", r"That truncates after two terms. What infinite series is meant?"),
        W(r"$A e^{t}$", r"The matrix cannot factor out like that. What power series defines it?"),
        W(r"$\det(A)\,e^{t}$", r"The determinant is not involved in the definition. What series is used?"),
    ],
)
m15(
    "um_15_15",
    r"The solution of $\mathbf{x}' = A\mathbf{x}$ with $\mathbf{x}(0) = \mathbf{x}_0$ is which expression?",
    r"It mirrors the scalar $x = e^{at}x_0$.",
    [
        C(r"$\mathbf{x}(t) = e^{At}\mathbf{x}_0$", r"Yes. The matrix exponential propagates the initial vector forward in time."),
        W(r"$\mathbf{x}(t) = e^{At} + \mathbf{x}_0$", r"The initial vector is multiplied, not added. How does $e^{At}$ act on $\mathbf{x}_0$?"),
        W(r"$\mathbf{x}(t) = e^{t}\mathbf{x}_0$", r"A scalar exponential ignores the matrix. What exponential carries $A$?"),
        W(r"$\mathbf{x}(t) = A e^{t}\mathbf{x}_0$", r"The matrix belongs in the exponent. What is the correct form?"),
    ],
)
m15(
    "um_15_16",
    r"What is $\frac{d}{dt}e^{At}$?",
    r"Differentiate the power series term by term.",
    [
        C(r"$A\,e^{At}$", r"Yes. Differentiating brings down a factor $A$, giving $A e^{At}$."),
        W(r"$e^{At}$", r"A factor is brought down by differentiation. What constant matrix appears?"),
        W(r"$A^2 e^{At}$", r"One derivative brings down one factor of $A$, not two. What is the coefficient?"),
        W(r"$t e^{At}$", r"No extra $t$ appears. What matrix factor results?"),
    ],
)
m15(
    "um_15_17",
    r"For diagonalizable $A = PDP^{-1}$, the matrix exponential equals what?",
    r"Conjugation passes through every term of the series.",
    [
        C(r"$P\,e^{Dt}\,P^{-1}$", r"Yes. Since $A^n = PD^nP^{-1}$, the whole series gives $e^{At} = P e^{Dt} P^{-1}$."),
        W(r"$P^{-1} e^{Dt} P$", r"The factor order must match $A = PDP^{-1}$. Which comes first?"),
        W(r"$e^{Dt}$ alone", r"The change-of-basis matrices remain. What surrounds $e^{Dt}$?"),
        W(r"$P D e^{t} P^{-1}$", r"The diagonal matrix belongs inside the exponential. What is the middle factor?"),
    ],
)
m15(
    "um_15_18",
    r"For the decoupled system $x' = -x$, $y' = 4y$, what is $e^{At}$?",
    r"A diagonal matrix exponentiates entrywise.",
    [
        C(r"The diagonal matrix with entries $e^{-t}$ and $e^{4t}$", r"Yes. Each diagonal entry $d$ becomes $e^{dt}$."),
        W(r"The diagonal matrix with entries $-e^{t}$ and $4e^{t}$", r"The entries go into the exponent, not in front. What are $e^{-t}$ and $e^{4t}$?"),
        W(r"The diagonal matrix with entries $e^{-1}$ and $e^{4}$", r"The variable $t$ must be in the exponent. What time-dependent entries result?"),
        W(r"The diagonal matrix with entries $-t$ and $4t$", r"Exponentiation is required, not multiplication. What is $e^{dt}$?"),
    ],
)

# --- 15.5 Fundamental matrices ----------------------------------------------
m15(
    "um_15_19",
    r"The columns of a fundamental matrix $\Phi(t)$ are what?",
    r"They form a complete independent set of solutions.",
    [
        C(r"Linearly independent solutions of $\mathbf{x}' = A\mathbf{x}$", r"Yes. A fundamental matrix collects independent solution vectors as its columns."),
        W(r"The eigenvectors of $A$ without time dependence", r"Columns are full time-dependent solutions. What factor is missing?"),
        W(r"Constant vectors", r"Constant columns do not solve the system. What must the columns be?"),
        W(r"The rows of $A$", r"Rows of $A$ are not solutions. What objects fill the columns?"),
    ],
)
m15(
    "um_15_20",
    r"A fundamental matrix satisfies which matrix differential equation?",
    r"Each column solves $\mathbf{x}' = A\mathbf{x}$.",
    [
        C(r"$\Phi' = A\Phi$", r"Yes. Because every column obeys $\mathbf{x}' = A\mathbf{x}$, the matrix satisfies $\Phi' = A\Phi$."),
        W(r"$\Phi' = \Phi A$", r"The coefficient matrix multiplies on the left. Which side does $A$ take?"),
        W(r"$\Phi' = A + \Phi$", r"The relation is multiplicative. How does $A$ act on $\Phi$?"),
        W(r"$\Phi' = \det(A)\Phi$", r"The full matrix acts, not its determinant. What multiplies $\Phi$?"),
    ],
)
m15(
    "um_15_21",
    r"The matrix exponential $e^{At}$ is the fundamental matrix satisfying which normalization?",
    r"It equals the identity at the starting time.",
    [
        C(r"$\Phi(0) = I$", r"Yes. The matrix exponential is normalized so $\Phi(0) = I$."),
        W(r"$\Phi(0) = A$", r"At $t = 0$ the exponential is the identity. What is $e^{A \cdot 0}$?"),
        W(r"$\Phi(0) = 0$", r"A zero matrix could not be fundamental. What value does $e^{At}$ take at $0$?"),
        W(r"$\Phi(0) = A^{-1}$", r"The normalization gives the identity, not an inverse. What is $\Phi(0)$?"),
    ],
)
m15(
    "um_15_22",
    r"Using a fundamental matrix, the general solution of $\mathbf{x}' = A\mathbf{x}$ is which expression?",
    r"Combine the columns with a constant vector.",
    [
        C(r"$\mathbf{x}(t) = \Phi(t)\,\mathbf{c}$", r"Yes. Multiplying the fundamental matrix by an arbitrary constant vector gives every solution."),
        W(r"$\mathbf{x}(t) = \Phi(t) + \mathbf{c}$", r"The constants combine columns by multiplication. How does $\mathbf{c}$ act?"),
        W(r"$\mathbf{x}(t) = \Phi(t)^{-1}\mathbf{c}$", r"The matrix itself, not its inverse, builds the solution. What product is used?"),
        W(r"$\mathbf{x}(t) = A\Phi(t)$", r"That is the derivative relation, not the solution. What does $\Phi$ multiply?"),
    ],
)

# --- 15.6 Homogeneous systems, worked examples ------------------------------
m15(
    "um_15_23",
    r"For $A$ with rows $(1, 1)$ and $(4, 1)$, the eigenvalues are which pair?",
    r"Trace $2$, determinant $1 - 4 = -3$; factor $\lambda^2 - 2\lambda - 3$.",
    [
        C(r"$3$ and $-1$", r"Correct. $\lambda^2 - 2\lambda - 3 = (\lambda - 3)(\lambda + 1) = 0$ gives $3$ and $-1$."),
        W(r"$-3$ and $1$", r"Check the signs of $(\lambda - 3)(\lambda + 1)$. What roots result?"),
        W(r"$3$ and $1$", r"The determinant $-3$ forces opposite signs. What is the negative root?"),
        W(r"$2$ and $-3$", r"The roots sum to the trace $2$ and multiply to $-3$. What pair fits?"),
    ],
)
m15(
    "um_15_24",
    r"With eigenvalues $3$ and $-1$, the origin of $\mathbf{x}' = A\mathbf{x}$ is what kind of equilibrium?",
    r"The eigenvalues are real with opposite signs.",
    [
        C(r"A saddle (unstable)", r"Yes. Opposite-sign real eigenvalues produce a saddle, which is unstable."),
        W(r"A stable node", r"A stable node needs both negative. What does the positive eigenvalue do?"),
        W(r"An unstable node", r"An unstable node needs both positive. What does the negative eigenvalue change?"),
        W(r"A center", r"Centers need imaginary eigenvalues. What do real opposite-sign eigenvalues give?"),
    ],
)
m15(
    "um_15_25",
    r"For $\lambda = 3$ with $A$ rows $(1, 1)$ and $(4, 1)$, an eigenvector solves $(A - 3I)\mathbf{v} = 0$ with row $(-2, 1)$. Which vector works?",
    r"Solve $-2v_1 + v_2 = 0$.",
    [
        C(r"$(1, 2)$", r"Correct. $-2v_1 + v_2 = 0$ gives $v_2 = 2v_1$, so $(1, 2)$ works."),
        W(r"$(2, 1)$", r"The relation $v_2 = 2v_1$ makes the second component larger. Which ordering fits?"),
        W(r"$(1, -2)$", r"The equation gives a positive $v_2$. What sign should the second component have?"),
        W(r"$(1, 1)$", r"Equal components fail $v_2 = 2v_1$. What second component is forced?"),
    ],
)
m15(
    "um_15_26",
    r"For $A$ with rows $(3, 1)$ and $(1, 3)$ (eigenvalues $4$ and $2$), the origin is what?",
    r"Both eigenvalues are positive reals.",
    [
        C(r"An unstable node (source)", r"Yes. Two positive real eigenvalues push trajectories away, a source."),
        W(r"A stable node (sink)", r"A sink needs negative eigenvalues. What do two positive ones give?"),
        W(r"A saddle", r"A saddle needs opposite signs. Are $4$ and $2$ opposite?"),
        W(r"A center", r"Centers need imaginary eigenvalues. Are $4$ and $2$ real or imaginary?"),
    ],
)

# --- 15.7 Nonhomogeneous systems --------------------------------------------
m15(
    "um_15_27",
    r"The general solution of $\mathbf{x}' = A\mathbf{x} + \mathbf{g}(t)$ has which structure?",
    r"It mirrors the scalar nonhomogeneous case.",
    [
        C(r"$\mathbf{x} = \mathbf{x}_h + \mathbf{x}_p$", r"Yes. The homogeneous solution plus any particular solution gives the general solution."),
        W(r"$\mathbf{x} = \mathbf{x}_h \cdot \mathbf{x}_p$", r"The pieces add, not multiply. How do they combine?"),
        W(r"$\mathbf{x} = \mathbf{x}_p$ only", r"The free constants live in $\mathbf{x}_h$. What must be added?"),
        W(r"$\mathbf{x} = \mathbf{x}_h$ only", r"The forcing requires a particular piece. What is added to $\mathbf{x}_h$?"),
    ],
)
m15(
    "um_15_28",
    r"For constant forcing $\mathbf{g}$ with $A$ invertible, the constant (steady-state) particular solution is which vector?",
    r"Set $\mathbf{x}_p' = 0$ in $\mathbf{x}_p' = A\mathbf{x}_p + \mathbf{g}$.",
    [
        C(r"$\mathbf{x}_p = -A^{-1}\mathbf{g}$", r"Yes. A constant solution has zero derivative, so $0 = A\mathbf{x}_p + \mathbf{g}$ gives $\mathbf{x}_p = -A^{-1}\mathbf{g}$."),
        W(r"$\mathbf{x}_p = A^{-1}\mathbf{g}$", r"Move $\mathbf{g}$ across $0 = A\mathbf{x}_p + \mathbf{g}$. What sign appears?"),
        W(r"$\mathbf{x}_p = -A\mathbf{g}$", r"Solving for $\mathbf{x}_p$ needs the inverse of $A$. What operator acts on $\mathbf{g}$?"),
        W(r"$\mathbf{x}_p = \mathbf{g}$", r"The matrix $A$ cannot vanish. What does solving $A\mathbf{x}_p = -\mathbf{g}$ give?"),
    ],
)
m15(
    "um_15_29",
    r"Variation of parameters gives a particular solution of $\mathbf{x}' = A\mathbf{x} + \mathbf{g}$ of which form?",
    r"Use the fundamental matrix outside and its inverse inside the integral.",
    [
        C(r"$\mathbf{x}_p = \Phi(t)\int \Phi^{-1}(t)\,\mathbf{g}(t)\,dt$", r"Yes. This is the variation-of-parameters formula for systems."),
        W(r"$\mathbf{x}_p = \Phi^{-1}(t)\int \Phi(t)\,\mathbf{g}(t)\,dt$", r"The inverse goes inside and $\Phi$ outside. Which is which?"),
        W(r"$\mathbf{x}_p = \int \Phi(t)\,\mathbf{g}(t)\,dt$", r"The integrand needs $\Phi^{-1}\mathbf{g}$ with $\Phi$ outside. What is missing inside?"),
        W(r"$\mathbf{x}_p = \Phi(t)\,\mathbf{g}(t)$", r"An integral is required, not a plain product. What operation acts on $\Phi^{-1}\mathbf{g}$?"),
    ],
)
m15(
    "um_15_30",
    r"When the exponential forcing $e^{\lambda t}\mathbf{b}$ has $\lambda$ equal to an eigenvalue of $A$, the undetermined-coefficients trial must be modified how?",
    r"This is the resonant case, like the scalar one.",
    [
        C(r"Multiply the exponential guess by $t$ (and include lower-order terms)", r"Yes. Resonance with an eigenvalue forces a $t e^{\lambda t}$ term in the trial."),
        W(r"Leave the guess unchanged", r"A plain guess collides with the homogeneous solution. What factor resolves it?"),
        W(r"Replace the exponential with a constant", r"The forcing is exponential, so the trial must be too. What modification is standard?"),
        W(r"Divide the guess by $\lambda$", r"Resonance calls for a factor of $t$, not dividing by $\lambda$. What adjustment is used?"),
    ],
)

# ============================================================================
# UNIT 16 MASTERY  (30 items spanning modules 16.1 through 16.6)
# ============================================================================

# --- 16.1 Phase portraits of linear systems ---------------------------------
m16(
    "um_16_1",
    r"A phase portrait of $\mathbf{x}' = A\mathbf{x}$ plots what?",
    r"It shows the state variables against each other, not against time.",
    [
        C(r"Trajectories in the $x_1 x_2$ plane with arrows for the flow direction", r"Yes. A phase portrait shows solution curves in state space and the direction of motion."),
        W(r"Each variable versus time $t$", r"Those are time series. What plane does a phase portrait use?"),
        W(r"The eigenvalues in the complex plane", r"That is a spectrum plot. What curves fill a phase portrait?"),
        W(r"The entries of $A$ as a bar chart", r"The matrix entries are not plotted. What geometric objects appear?"),
    ],
)
m16(
    "um_16_2",
    r"For $\mathbf{x}' = A\mathbf{x}$ with invertible $A$, the only equilibrium is where?",
    r"Solve $A\mathbf{x} = \mathbf{0}$.",
    [
        C(r"At the origin", r"Yes. With $A$ invertible, $A\mathbf{x} = \mathbf{0}$ forces $\mathbf{x} = \mathbf{0}$."),
        W(r"At every eigenvector", r"Eigenvectors set directions, not equilibria. Where does $A\mathbf{x} = \mathbf{0}$ put it?"),
        W(r"Along an entire line", r"A line of equilibria needs a singular $A$. For invertible $A$, what single point solves it?"),
        W(r"Nowhere", r"The origin always satisfies $A\mathbf{x} = \mathbf{0}$. Where is the equilibrium?"),
    ],
)
m16(
    "um_16_3",
    r"For real distinct eigenvalues, the straight-line trajectories lie along which directions?",
    r"Solutions confined to a line follow a special direction of $A$.",
    [
        C(r"The eigenvectors of $A$", r"Yes. Motion along an eigenvector stays on that line, giving straight-line trajectories."),
        W(r"The coordinate axes always", r"The special lines are eigenvectors, not necessarily the axes. What directions stay invariant?"),
        W(r"Circles about the origin", r"Circles are not straight and arise for centers. What straight directions does $A$ pick out?"),
        W(r"The line $x_1 = x_2$ always", r"That line is not generally invariant. Which directions are?"),
    ],
)
m16(
    "um_16_4",
    r"As $t \to \infty$, trajectories of a system with two negative real eigenvalues do what?",
    r"Negative rates shrink every mode.",
    [
        C(r"Approach the origin (stable node)", r"Yes. Both modes decay, so trajectories tend to the origin."),
        W(r"Escape to infinity", r"Escape needs a positive eigenvalue. What do negative rates do?"),
        W(r"Circle the origin forever", r"Closed circling comes from imaginary eigenvalues. What do negative reals give?"),
        W(r"Remain fixed in place", r"Nonzero points still move. Where do decaying modes send them?"),
    ],
)
m16(
    "um_16_5",
    r"Approaching a node, trajectories become tangent to which eigenvector direction?",
    r"The mode that decays slowest dominates near the origin.",
    [
        C(r"The eigenvector of the eigenvalue closest to zero (the slow direction)", r"Yes. The slowest mode persists longest, so trajectories align with its eigenvector near the origin."),
        W(r"The eigenvector of the most negative eigenvalue", r"That fast mode dies first. Which direction lingers near the origin?"),
        W(r"The vertical axis always", r"Tangency follows an eigenvector, not a fixed axis. Which one governs the approach?"),
        W(r"A 45-degree line always", r"No fixed angle applies. Which eigenvalue's direction dominates?"),
    ],
)

# --- 16.2 Sources, sinks, saddles, spirals, centers -------------------------
m16(
    "um_16_6",
    r"Both eigenvalues real and positive give which equilibrium?",
    r"Positive rates push trajectories outward.",
    [
        C(r"A source (unstable node)", r"Yes. Two positive real eigenvalues send all trajectories away from the origin."),
        W(r"A sink (stable node)", r"A sink needs negative eigenvalues. What does the positive sign give?"),
        W(r"A saddle", r"A saddle needs opposite signs. What does the same positive sign give?"),
        W(r"A center", r"Centers need imaginary eigenvalues. What do positive reals give?"),
    ],
)
m16(
    "um_16_7",
    r"A saddle is detected by which condition on the determinant of $A$?",
    r"The determinant is the product of the eigenvalues.",
    [
        C(r"$\det(A) < 0$", r"Yes. A negative determinant means opposite-sign eigenvalues, the signature of a saddle."),
        W(r"$\det(A) > 0$", r"A positive determinant gives same-sign or complex eigenvalues. What sign signals a saddle?"),
        W(r"$\det(A) = 0$", r"A zero determinant gives a non-isolated equilibrium. What determinant sign indicates a saddle?"),
        W(r"$\det(A) = 1$", r"No special value of $1$ applies. What determinant sign marks a saddle?"),
    ],
)
m16(
    "um_16_8",
    r"Complex eigenvalues with nonzero real part produce which equilibrium?",
    r"Rotation plus growth or decay makes a spiral.",
    [
        C(r"A spiral", r"Yes. The imaginary part rotates and the nonzero real part scales the amplitude, giving a spiral."),
        W(r"A node", r"Nodes come from real eigenvalues. What do complex ones with nonzero real part give?"),
        W(r"A center", r"A center needs zero real part. What does a nonzero real part add?"),
        W(r"A saddle", r"Saddles come from real opposite-sign eigenvalues. What do complex ones give?"),
    ],
)
m16(
    "um_16_9",
    r"Using the trace and determinant, a center requires $\det(A) > 0$ together with what?",
    r"Purely imaginary conjugate eigenvalues sum to zero.",
    [
        C(r"$\text{tr}(A) = 0$", r"Yes. Zero trace with positive determinant gives purely imaginary eigenvalues, a center."),
        W(r"$\text{tr}(A) > 0$", r"A positive trace gives a spiral source. What trace gives pure rotation?"),
        W(r"$\text{tr}(A) < 0$", r"A negative trace gives a spiral sink. What trace gives a center?"),
        W(r"$\text{tr}(A) = 1$", r"No special value of $1$ applies. What trace forces purely imaginary eigenvalues?"),
    ],
)
m16(
    "um_16_10",
    r"For $A$ with rows $(-1, 0)$ and $(0, -3)$, the origin is what?",
    r"Read the eigenvalues off the diagonal and check signs.",
    [
        C(r"A stable node (sink)", r"Yes. Eigenvalues $-1$ and $-3$ are both negative reals, giving a stable node."),
        W(r"An unstable node", r"An unstable node needs positive eigenvalues. What does the negative sign give?"),
        W(r"A saddle", r"A saddle needs opposite signs. Are $-1$ and $-3$ opposite?"),
        W(r"A spiral", r"Spirals need complex eigenvalues. Are $-1$ and $-3$ real or complex?"),
    ],
)

# --- 16.3 Linearization near equilibria -------------------------------------
m16(
    "um_16_11",
    r"To approximate a nonlinear system near an equilibrium, which matrix is used?",
    r"It collects the first partial derivatives of the right-hand sides.",
    [
        C(r"The Jacobian matrix", r"Yes. The Jacobian of the right-hand sides at the equilibrium gives the linear approximation."),
        W(r"The identity matrix", r"The identity carries no system information. What derivative matrix is used?"),
        W(r"The inverse of $A$", r"There is no fixed $A$ for a nonlinear system. What matrix of partials approximates it?"),
        W(r"A diagonal matrix of equilibrium coordinates", r"The coordinates are not the linearization. What partial-derivative matrix is needed?"),
    ],
)
m16(
    "um_16_12",
    r"For $x' = f(x, y)$, $y' = g(x, y)$, the equilibria satisfy what?",
    r"At an equilibrium nothing changes in time.",
    [
        C(r"$f = 0$ and $g = 0$ simultaneously", r"Yes. Both right-hand sides vanish at an equilibrium."),
        W(r"$f = g$", r"Equality of the functions is not the condition. What value must each take?"),
        W(r"$f_x = g_y = 0$", r"Those are derivative conditions, not the equilibrium condition. What must the functions equal?"),
        W(r"$x = y$", r"No coordinate relation defines equilibria. What must $f$ and $g$ equal?"),
    ],
)
m16(
    "um_16_13",
    r"For $x' = f(x, y)$, $y' = g(x, y)$, the Jacobian has which rows?",
    r"Each row holds the partials of one right-hand side.",
    [
        C(r"$(f_x, f_y)$ and $(g_x, g_y)$", r"Yes. The first row is the partials of $f$, the second the partials of $g$."),
        W(r"$(f_x, g_x)$ and $(f_y, g_y)$", r"Each row should come from one function. What makes up the first row?"),
        W(r"$(f, g)$ and $(f, g)$", r"The Jacobian uses derivatives, not the functions. What partials fill the rows?"),
        W(r"$(f_{xx}, f_{yy})$ and $(g_{xx}, g_{yy})$", r"It uses first partials, not second. Which derivatives appear?"),
    ],
)
m16(
    "um_16_14",
    r"For $x' = y$, $y' = -\sin x$, the Jacobian at the origin is which matrix?",
    r"Differentiate, then use $\cos 0 = 1$.",
    [
        C(r"Rows $(0, 1)$ and $(-1, 0)$", r"Correct. The rows are $(0, 1)$ and $(-\cos x, 0)$; at $x = 0$ this is $(-1, 0)$."),
        W(r"Rows $(0, 1)$ and $(0, -1)$", r"The partial of $-\sin x$ in $x$ is $-\cos x$. What does it give at $0$?"),
        W(r"Rows $(1, 0)$ and $(-1, 0)$", r"The partial of $y$ in $x$ is $0$. What is the first row?"),
        W(r"Rows $(0, 1)$ and $(1, 0)$", r"The derivative of $-\sin x$ keeps a minus sign. What is $-\cos 0$?"),
    ],
)
m16(
    "um_16_15",
    r"The Hartman-Grobman theorem guarantees the linearization is reliable when the equilibrium is what?",
    r"No eigenvalue may sit on the imaginary axis.",
    [
        C(r"Hyperbolic (all eigenvalues have nonzero real part)", r"Yes. When no eigenvalue has zero real part, the linearization faithfully predicts local behavior."),
        W(r"Any equilibrium whatsoever", r"Borderline cases can fail. What eigenvalue restriction is required?"),
        W(r"One with a purely imaginary eigenvalue", r"That is the borderline failing case. What real-part condition is needed?"),
        W(r"One at the origin", r"Location is irrelevant. What eigenvalue condition matters?"),
    ],
)

# --- 16.4 Nullclines and stability for nonlinear systems --------------------
m16(
    "um_16_16",
    r"The $x$-nullcline of $x' = f(x, y)$, $y' = g(x, y)$ is the curve where what holds?",
    r"It is where the rate of change of $x$ vanishes.",
    [
        C(r"$x' = 0$, that is $f(x, y) = 0$", r"Yes. The $x$-nullcline is where $x' = f = 0$."),
        W(r"$y' = 0$", r"That is the $y$-nullcline. Which rate vanishes for the $x$-nullcline?"),
        W(r"$x = 0$", r"Setting the variable to zero differs from setting its rate to zero. What must vanish?"),
        W(r"$f = g$", r"Equality of rates is not a nullcline. What single rate is zero?"),
    ],
)
m16(
    "um_16_17",
    r"Equilibria are located where which curves intersect?",
    r"At an equilibrium both rates vanish at once.",
    [
        C(r"An $x$-nullcline and a $y$-nullcline", r"Yes. There both $x' = 0$ and $y' = 0$, so the point is an equilibrium."),
        W(r"Two $x$-nullclines", r"Both rates must vanish, from different nullclines. Which two kinds intersect?"),
        W(r"A nullcline and the $x$-axis", r"The axis is not generally a nullcline. Which two nullclines must cross?"),
        W(r"Any two trajectories", r"Trajectories do not cross. What nullcline intersection gives an equilibrium?"),
    ],
)
m16(
    "um_16_18",
    r"On the $x$-nullcline (where $x' = 0$), the flow points in which direction?",
    r"If $x$ is momentarily fixed, only $y$ changes.",
    [
        C(r"Purely vertically", r"Yes. With $x' = 0$ there is no horizontal component, so the flow is vertical."),
        W(r"Purely horizontally", r"The horizontal component is zero here. Which component remains?"),
        W(r"At 45 degrees", r"No fixed angle applies. What direction results when the horizontal rate is zero?"),
        W(r"No direction (no motion)", r"Motion stops only at equilibria. What single direction remains?"),
    ],
)
m16(
    "um_16_19",
    r"For $x' = x - y$, the $x$-nullcline is which line?",
    r"Set $x' = 0$ and solve.",
    [
        C(r"$y = x$", r"Correct. Setting $x - y = 0$ gives $y = x$."),
        W(r"$y = -x$", r"Solve $x - y = 0$, not $x + y = 0$. What line results?"),
        W(r"$x = 0$", r"The nullcline is $x - y = 0$, not $x = 0$. What line is that?"),
        W(r"$y = 0$", r"Setting $y = 0$ ignores the $x$ term. What does $x - y = 0$ give?"),
    ],
)
m16(
    "um_16_20",
    r"To classify a particular equilibrium of a nonlinear system, the Jacobian is evaluated where, and stability read from what?",
    r"Linearization is local; eigenvalues classify it.",
    [
        C(r"At that equilibrium, with stability from the Jacobian's eigenvalues", r"Yes. Evaluate the Jacobian at the equilibrium and read stability from its eigenvalues."),
        W(r"At the origin, from the determinant of the raw functions", r"Not every equilibrium is at the origin, and stability comes from eigenvalues. What is the correct point and data?"),
        W(r"At an arbitrary point, from the trace alone", r"The point must be the equilibrium and both eigenvalues matter. What is correct?"),
        W(r"Averaged over the plane, from the number of equilibria", r"Stability is local and spectral, not an average count. Where and from what is it read?"),
    ],
)

# --- 16.5 Nonlinear phase portraits -----------------------------------------
m16(
    "um_16_21",
    r"What does it mean for a system to be autonomous?",
    r"Check whether $t$ appears explicitly on the right-hand sides.",
    [
        C(r"The right-hand sides do not depend explicitly on $t$", r"Yes. An autonomous system depends only on the state, not directly on time."),
        W(r"The system is linear", r"Autonomy concerns time dependence, not linearity. What must be absent?"),
        W(r"All solutions are constant", r"Autonomous systems have many non-constant solutions. What defines autonomy?"),
        W(r"The right-hand sides depend on $t$ explicitly", r"That is the opposite. What dependence is excluded?"),
    ],
)
m16(
    "um_16_22",
    r"Can two distinct trajectories of an autonomous system cross in the phase plane?",
    r"Recall uniqueness of solutions.",
    [
        C(r"No; uniqueness forbids crossings", r"Yes. A crossing would make two solutions share a point, violating uniqueness."),
        W(r"Yes; they cross freely", r"That would break uniqueness. What does the theorem forbid?"),
        W(r"Only if the system is nonlinear", r"Nonlinearity does not permit crossings either. What principle blocks them?"),
        W(r"Only at the origin", r"Crossings are forbidden everywhere. What does uniqueness imply?"),
    ],
)
m16(
    "um_16_23",
    r"A limit cycle is which kind of feature?",
    r"It is an isolated closed loop nearby trajectories approach or leave.",
    [
        C(r"An isolated closed orbit (a nonlinear phenomenon)", r"Yes. A limit cycle is an isolated periodic orbit, possible only in nonlinear systems."),
        W(r"A straight-line trajectory", r"Limit cycles are closed loops, not lines. What isolated periodic feature is meant?"),
        W(r"One of a center's nested orbits", r"Center orbits are not isolated. What makes a limit cycle special?"),
        W(r"An equilibrium point", r"It is a closed curve, not a point. What periodic structure is it?"),
    ],
)
m16(
    "um_16_24",
    r"The standard strategy for a nonlinear autonomous system is what?",
    r"Treat each rest point with its own linearization.",
    [
        C(r"Find all equilibria, then linearize and classify each", r"Yes. Locating and linearizing at each equilibrium builds the local behavior throughout the plane."),
        W(r"Assume the system is globally linear", r"Nonlinear systems are not globally linear. What local procedure is used?"),
        W(r"Solve it exactly in closed form", r"Closed forms are rare for nonlinear systems. What qualitative procedure is standard?"),
        W(r"Compute one global eigenvalue", r"There is no single global matrix. What is done at each equilibrium?"),
    ],
)
m16(
    "um_16_25",
    r"A separatrix in a nonlinear phase portrait does what?",
    r"It is a boundary trajectory.",
    [
        C(r"Divides the plane into regions of different long-term behavior", r"Yes. A separatrix bounds basins leading to different eventual outcomes."),
        W(r"Connects all equilibria in one loop", r"It is a divider, not a connector. What does it separate?"),
        W(r"Marks where solutions are undefined", r"Solutions exist on separatrices. What boundary role does it play?"),
        W(r"Lists the system's eigenvalues", r"It is a curve, not a list of numbers. What regions does it bound?"),
    ],
)

# --- 16.6 Predator-prey dynamics --------------------------------------------
m16(
    "um_16_26",
    r"In $x' = ax - bxy$, $y' = -cy + dxy$, which species is the predator and why?",
    r"The predator declines on its own and gains from the interaction.",
    [
        C(r"$y$, since it decays as $-cy$ alone and grows with $+dxy$", r"Yes. The $-cy$ term is natural decline and $+dxy$ is the gain from consuming prey."),
        W(r"$x$, since it grows as $ax$ alone", r"Self-growth alone is the prey's trait. Which variable declines without the other?"),
        W(r"Both are predators", r"The roles are asymmetric, one of each. Which benefits from $+dxy$?"),
        W(r"Neither; both are prey", r"There is one predator. Which variable declines alone and grows by interaction?"),
    ],
)
m16(
    "um_16_27",
    r"Without predators ($y = 0$), the prey obeys $x' = ax$ and does what?",
    r"This is simple exponential growth.",
    [
        C(r"Grows exponentially", r"Yes. With no predators, $x' = ax$ gives unbounded exponential growth."),
        W(r"Decays to zero", r"The rate $a$ is positive. What does $x' = ax$ produce?"),
        W(r"Stays constant", r"A nonzero $ax$ forces change. What growth results?"),
        W(r"Oscillates", r"A single linear equation does not oscillate. What does $x' = ax$ give?"),
    ],
)
m16(
    "um_16_28",
    r"The coexistence equilibrium of $x' = ax - bxy$, $y' = -cy + dxy$ is at which point?",
    r"Set each rate to zero and factor out the nonzero population.",
    [
        C(r"$x = c/d$, $y = a/b$", r"Correct. From $a - by = 0$ and $-c + dx = 0$ we get $y = a/b$, $x = c/d$."),
        W(r"$x = a/b$, $y = c/d$", r"The prey equation gives $y = a/b$ and the predator equation gives $x = c/d$. Which is which?"),
        W(r"$x = b/a$, $y = d/c$", r"Solve $a - by = 0$ for $y$, getting $a/b$. What does each equation yield?"),
        W(r"$x = a/c$, $y = b/d$", r"Factor each equation: $-c + dx = 0$ gives $x = c/d$. What is $y$?"),
    ],
)
m16(
    "um_16_29",
    r"In the standard Lotka-Volterra model, the trajectories around the coexistence point are what?",
    r"The populations rise and fall repeatedly.",
    [
        C(r"Closed orbits, so populations oscillate periodically", r"Yes. The coexistence equilibrium is a center, so populations cycle periodically."),
        W(r"Inward spirals to a steady state", r"The classic model does not damp out. What closed shape do the orbits form?"),
        W(r"Straight lines to extinction", r"Coexistence trajectories do not run to extinction. What periodic shape results?"),
        W(r"A fixed point with no motion", r"Away from equilibrium the populations change. What closed curves do they trace?"),
    ],
)
m16(
    "um_16_30",
    r"At the origin of the predator-prey model, the linearization has eigenvalues $a > 0$ and $-c < 0$, so the origin is what?",
    r"The eigenvalues are real with opposite signs.",
    [
        C(r"A saddle (unstable)", r"Yes. Opposite-sign real eigenvalues make the origin a saddle."),
        W(r"A stable node", r"Stability needs both eigenvalues negative, but $a > 0$. What does the positive one give?"),
        W(r"A center", r"The eigenvalues are real and opposite, not imaginary. What type is that?"),
        W(r"A stable spiral", r"Spirals need complex eigenvalues; these are real. What opposite-sign type results?"),
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
    unit_new = (emit_unit_block(UNIT15_TITLE, MASTERY_15) + ",\n\n"
                + emit_unit_block(UNIT16_TITLE, MASTERY_16))
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
    data["unit_mastery"][UNIT15_TITLE] = [strip_item(it) for it in MASTERY_15]
    data["unit_mastery"][UNIT16_TITLE] = [strip_item(it) for it in MASTERY_16]

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
    for it in MASTERY_15 + MASTERY_16:
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
    assert len(MICRO) == 26, "expected 26 micro videos, got %d" % len(MICRO)
    assert len(MASTERY_15) == 30, "Unit 15 mastery not 30 items, got %d" % len(MASTERY_15)
    assert len(MASTERY_16) == 30, "Unit 16 mastery not 30 items, got %d" % len(MASTERY_16)
    one_correct(MASTERY_15, "mastery15")
    one_correct(MASTERY_16, "mastery16")
    for it in MASTERY_15 + MASTERY_16:
        assert it["id"] not in seen_ids, "duplicate id %s" % it["id"]
        seen_ids.add(it["id"])

    if bad:
        for where, s in bad:
            print("[!] FORBIDDEN CHAR in", where, "->", s)
        raise SystemExit("Validation failed: forbidden characters present")
    print("[+] validation passed: %d micro videos, %d + %d mastery items, copy rules OK"
          % (len(MICRO), len(MASTERY_15), len(MASTERY_16)))


if __name__ == "__main__":
    validate()
    update_js()
    update_json()
    print("[+] Unit 15 and Unit 16 quiz generation complete")
