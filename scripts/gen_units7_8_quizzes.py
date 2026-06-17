#!/usr/bin/env python3
"""
Generate Unit 7 (First-Order Exactness and Methods) and Unit 8 (Special
Equations and Classical Models) interactive quizzes in a single batch.

Authors the 27 video micro-practice quizzes (five items each) and the two 30
item unit mastery quizzes as one Python source of truth, then:
  1. Emits JS object literal text and splices it into app/js/quiz-data.js, into
     the existing micro_practice and unit_mastery objects (append only).
  2. Updates the documentation mirror app/data/quizzes.json so both stay in sync.

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

UNIT7_TITLE = "Unit 7: First-Order Exactness and Methods"
UNIT8_TITLE = "Unit 8: Special Equations and Classical Models"


def C(text, rationale):
    return {"text": text, "correct": True, "rationale": rationale}


def W(text, rationale):
    return {"text": text, "rationale": rationale}


def item(qid, prompt, hint, options):
    return {"id": qid, "prompt": prompt, "hint": hint, "answerOptions": options}


MICRO = []  # list of (video_id, comment_line, [items])


def add_micro(video_id, comment, items):
    MICRO.append((video_id, comment, items))


MASTERY_7 = []
MASTERY_8 = []


# ============================================================================
# UNIT 7 MICRO PRACTICE
# ============================================================================

# === 7.1 video 1 ============================================================
add_micro(
    "_c3iEPReTVQ",
    'Unit 7, Module 7.1, video 1\n           "What are Exact Differential Equations (Differential Equations 28)"',
    [
        item(
            "mp__c3iEPReTVQ_1",
            r"A first-order equation written as $M(x,y)\,dx + N(x,y)\,dy = 0$ is called exact when which condition holds?",
            r"Exactness means the left side is the total differential of some potential $F$, which forces a symmetry between the mixed partials.",
            [
                C(r"$\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}$", r"Yes. When the cross partials match, $M\,dx + N\,dy$ is the total differential $dF$ of a potential function."),
                W(r"$\frac{\partial M}{\partial x} = \frac{\partial N}{\partial y}$", r"Those are the straight partials, not the cross partials. Which derivative of $M$ should you compare with which derivative of $N$?"),
                W(r"$M = N$", r"The two functions rarely equal each other. Which mixed partial derivatives must agree for a total differential to exist?"),
                W(r"$M + N = 0$", r"That is an algebraic balance, not a derivative condition. What symmetry of partials signals exactness?"),
            ],
        ),
        item(
            "mp__c3iEPReTVQ_2",
            r"If $M\,dx + N\,dy = dF$ for some function $F(x,y)$, then $M$ equals which partial derivative?",
            r"Match the differential $dF = F_x\,dx + F_y\,dy$ term by term against $M\,dx + N\,dy$.",
            [
                C(r"$M = \frac{\partial F}{\partial x}$", r"Yes. The coefficient of $dx$ in $dF$ is $F_x$, so $M = F_x$."),
                W(r"$M = \frac{\partial F}{\partial y}$", r"That coefficient belongs to $dy$. Which differential, $dx$ or $dy$, does $M$ multiply?"),
                W(r"$M = F$", r"$M$ is a rate of change of $F$, not $F$ itself. Which partial multiplies $dx$?"),
                W(r"$M = \frac{\partial^2 F}{\partial x \partial y}$", r"That is a second derivative. The coefficient of $dx$ in $dF$ is a first partial. Which one?"),
            ],
        ),
        item(
            "mp__c3iEPReTVQ_3",
            r"Test whether $(2xy)\,dx + (x^2)\,dy = 0$ is exact.",
            r"Compute $M_y$ for $M = 2xy$ and $N_x$ for $N = x^2$, then compare.",
            [
                C(r"Exact, since $M_y = 2x = N_x$", r"Correct. Both cross partials equal $2x$, so the equation is exact."),
                W(r"Not exact, since $M_y \neq N_x$", r"Recompute. What is $\frac{\partial}{\partial y}(2xy)$ and $\frac{\partial}{\partial x}(x^2)$?"),
                W(r"Exact, since $M = N$", r"Here $2xy$ and $x^2$ are not equal, yet the equation can still be exact. Which partials decide it?"),
                W(r"Cannot be determined", r"The cross partials settle the question directly. What are $M_y$ and $N_x$?"),
            ],
        ),
        item(
            "mp__c3iEPReTVQ_4",
            r"The solution of an exact equation $M\,dx + N\,dy = 0$ takes which implicit form?",
            r"Once a potential $F$ exists with $dF = M\,dx + N\,dy$, the equation says $dF = 0$ along solutions.",
            [
                C(r"$F(x, y) = C$ for a constant $C$", r"Yes. Since $dF = 0$ along a solution, $F$ stays constant on each solution curve."),
                W(r"$F(x, y) = 0$ only", r"Zero is just one level curve. What general value does $F$ hold along a solution?"),
                W(r"$M(x, y) = C$", r"The constant belongs to the potential $F$, not to $M$ alone. What function is held constant?"),
                W(r"$F(x, y) = x + y$", r"The right side is an arbitrary constant, not a specific expression. What does $dF = 0$ imply about $F$?"),
            ],
        ),
        item(
            "mp__c3iEPReTVQ_5",
            r"Why does exactness guarantee a potential function $F$ exists on a simply connected region?",
            r"The matching cross partials are exactly the integrability condition that lets you reconstruct $F$ by integrating.",
            [
                C(r"The condition $M_y = N_x$ is the integrability condition that makes the pair $(M, N)$ a gradient", r"Yes. Equal cross partials let you integrate $M$ and $N$ consistently into a single potential $F$."),
                W(r"Every pair of functions is automatically a gradient", r"Most pairs are not gradients. What special condition must $(M, N)$ satisfy first?"),
                W(r"Because $M$ and $N$ are continuous", r"Continuity alone is not enough. What derivative condition guarantees a consistent potential?"),
                W(r"Because the equation is first order", r"Order does not create a potential. Which equality of partials makes $(M, N)$ a gradient?"),
            ],
        ),
    ],
)

# === 7.1 video 2 ============================================================
add_micro(
    "pgJci5CI9n4",
    'Unit 7, Module 7.1, video 2\n           "Exact Equations [ODE]"',
    [
        item(
            "mp_pgJci5CI9n4_1",
            r"For the exact equation $(2x + y)\,dx + (x + 2y)\,dy = 0$, integrating $M = 2x + y$ with respect to $x$ gives what?",
            r"Integrate $2x + y$ treating $y$ as a constant, and remember the constant of integration may depend on $y$.",
            [
                C(r"$F = x^2 + xy + g(y)$", r"Correct. Integrating in $x$ gives $x^2 + xy$, plus an unknown function $g(y)$."),
                W(r"$F = x^2 + xy$", r"You integrated correctly but dropped the integration term. What unknown function of $y$ should you append?"),
                W(r"$F = x^2 + xy + C$", r"A bare constant is too restrictive when integrating in $x$. What more general $y$ dependent term belongs here?"),
                W(r"$F = 2 + 0$", r"You differentiated instead of integrated. What is $\int (2x + y)\,dx$ with $y$ held fixed?"),
            ],
        ),
        item(
            "mp_pgJci5CI9n4_2",
            r"Continuing, you have $F = x^2 + xy + g(y)$ and need $F_y = N = x + 2y$. What is $g'(y)$?",
            r"Differentiate $F$ in $y$, set it equal to $N$, and solve for $g'(y)$.",
            [
                C(r"$g'(y) = 2y$", r"Correct. $F_y = x + g'(y)$, and setting it equal to $x + 2y$ gives $g'(y) = 2y$."),
                W(r"$g'(y) = x + 2y$", r"The $x$ term already appears in $F_y$. After subtracting it, what remains for $g'(y)$?"),
                W(r"$g'(y) = x$", r"That is the part already accounted for by $xy$. What is left over after matching the $x$ terms?"),
                W(r"$g'(y) = 0$", r"That would ignore the $2y$ in $N$. What does $F_y = x + 2y$ leave for $g'(y)$?"),
            ],
        ),
        item(
            "mp_pgJci5CI9n4_3",
            r"With $g'(y) = 2y$, the full implicit solution of $(2x + y)\,dx + (x + 2y)\,dy = 0$ is what?",
            r"Integrate $g'(y) = 2y$ to get $g(y)$, assemble $F$, and set it equal to a constant.",
            [
                C(r"$x^2 + xy + y^2 = C$", r"Correct. Integrating $g'(y) = 2y$ gives $y^2$, so $F = x^2 + xy + y^2 = C$."),
                W(r"$x^2 + xy = C$", r"You left out $g(y)$. What is $\int 2y\,dy$, and where does it go?"),
                W(r"$x^2 + xy + 2y = C$", r"That is $g'(y)$, not its integral. What is $\int 2y\,dy$?"),
                W(r"$x^2 + y^2 = C$", r"You dropped the mixed term $xy$ from integrating $M$. Which cross term belongs in $F$?"),
            ],
        ),
        item(
            "mp_pgJci5CI9n4_4",
            r"When solving an exact equation, why does integrating $M$ in $x$ produce an unknown function $g(y)$ rather than a constant?",
            r"Think about what vanishes under the partial derivative $\frac{\partial}{\partial x}$.",
            [
                C(r"Any function of $y$ alone has zero $x$ partial, so it is invisible to the $x$ integration", r"Yes. Since $\frac{\partial}{\partial x}g(y) = 0$, the recovery from $M$ cannot see $g(y)$, so it stays unknown."),
                W(r"Because $y$ is the independent variable", r"In this framing $x$ and $y$ are symmetric coordinates. What term is invisible to the operator $\frac{\partial}{\partial x}$?"),
                W(r"Because integration always adds a constant", r"A plain constant is too narrow here. What broader family of terms has zero $x$ partial?"),
                W(r"Because $M$ depends only on $x$", r"$M$ may depend on both variables. What kind of leftover term does the $x$ integration miss?"),
            ],
        ),
        item(
            "mp_pgJci5CI9n4_5",
            r"After finding a candidate potential $F$, how can you verify your exact-equation solution is correct?",
            r"The defining property is that $dF$ reproduces the original differential form.",
            [
                C(r"Check that $F_x = M$ and $F_y = N$", r"Yes. If both partials of $F$ return the original coefficients, the potential is correct."),
                W(r"Check that $F = 0$", r"The solution sets $F$ to a constant, not to zero. What should the partials of $F$ recover?"),
                W(r"Check that $M = N$", r"$M$ and $N$ need not be equal. Which derivatives of $F$ should reproduce them?"),
                W(r"Check that $F_x = F_y$", r"There is no reason the two partials match each other. What should each partial equal individually?"),
            ],
        ),
    ],
)

# === 7.2 video 1 ============================================================
add_micro(
    "iEpqcdaJNTQ",
    'Unit 7, Module 7.2, video 1\n           "Exact equations intuition 1 (proofy) Khan Academy"',
    [
        item(
            "mp_iEpqcdaJNTQ_1",
            r"If $F(x, y) = C$ defines $y$ implicitly as a function of $x$, differentiating both sides with respect to $x$ gives which relation?",
            r"Apply the chain rule to $F(x, y(x))$, remembering that $y$ depends on $x$.",
            [
                C(r"$F_x + F_y \frac{dy}{dx} = 0$", r"Yes. The total derivative of $F(x, y(x))$ with respect to $x$ vanishes because $F$ is constant."),
                W(r"$F_x + F_y = 0$", r"You dropped the chain rule factor on the $y$ term. What multiplies $F_y$ when $y$ depends on $x$?"),
                W(r"$F_x \frac{dy}{dx} + F_y = 0$", r"The chain rule factor attaches to the $y$ partial, not the $x$ partial. Which term carries $\frac{dy}{dx}$?"),
                W(r"$F_x + F_y \frac{dy}{dx} = C$", r"The derivative of a constant is zero, not $C$. What does the right side become after differentiating?"),
            ],
        ),
        item(
            "mp_iEpqcdaJNTQ_2",
            r"The relation $F_x + F_y \frac{dy}{dx} = 0$ matches $M\,dx + N\,dy = 0$ when you identify which pairing?",
            r"Rewrite $M\,dx + N\,dy = 0$ as $M + N\frac{dy}{dx} = 0$ and compare coefficients.",
            [
                C(r"$M = F_x$ and $N = F_y$", r"Yes. Matching the two forms term by term gives $M = F_x$ and $N = F_y$."),
                W(r"$M = F_y$ and $N = F_x$", r"The coefficient of $dx$ pairs with the $x$ partial. Which partial equals $M$?"),
                W(r"$M = N = F$", r"$M$ and $N$ are partials of $F$, not $F$ itself. Which partial matches each coefficient?"),
                W(r"$M = F_x F_y$ and $N = 1$", r"The coefficients are single partials, not products. What does $M$ equal directly?"),
            ],
        ),
        item(
            "mp_iEpqcdaJNTQ_3",
            r"Given $M = F_x$ and $N = F_y$, why must $M_y = N_x$ for a twice continuously differentiable $F$?",
            r"This is Clairaut's theorem on the symmetry of second mixed partial derivatives.",
            [
                C(r"Because $M_y = F_{xy}$ and $N_x = F_{yx}$, and mixed partials are equal", r"Yes. The equality of mixed second partials forces $M_y = N_x$."),
                W(r"Because $M$ and $N$ are equal", r"They are different partials of $F$. Which second derivatives do $M_y$ and $N_x$ become?"),
                W(r"Because $F$ is constant", r"$F$ being constant on a solution does not give this identity. What property of mixed partials does?"),
                W(r"Because $x = y$", r"The variables are independent and distinct. What theorem about second partials applies?"),
            ],
        ),
        item(
            "mp_iEpqcdaJNTQ_4",
            r"The slope of a solution curve to an exact equation at a point can be written as which ratio?",
            r"Solve $M + N\frac{dy}{dx} = 0$ for $\frac{dy}{dx}$.",
            [
                C(r"$\frac{dy}{dx} = -\frac{M}{N}$", r"Yes. Solving $M + N\frac{dy}{dx} = 0$ gives the slope as $-M/N$."),
                W(r"$\frac{dy}{dx} = \frac{M}{N}$", r"Check the sign when you move $M$ to the other side. What sign does the slope carry?"),
                W(r"$\frac{dy}{dx} = -\frac{N}{M}$", r"The roles of $M$ and $N$ are swapped. Which coefficient ends up in the numerator?"),
                W(r"$\frac{dy}{dx} = M N$", r"Solving a linear relation for the slope yields a ratio, not a product. What is that ratio?"),
            ],
        ),
        item(
            "mp_iEpqcdaJNTQ_5",
            r"The level curves $F(x, y) = C$ are exactly the solution curves of the exact equation because of what?",
            r"On each level curve $F$ stays constant, so its total differential is zero there.",
            [
                C(r"Along each level curve $dF = 0$, which is precisely the equation $M\,dx + N\,dy = 0$", r"Yes. The solutions are the curves where the potential stays constant."),
                W(r"The level curves are straight lines", r"Level curves are generally curved. What property of $F$ along them matches the equation?"),
                W(r"$F$ changes fastest along them", r"$F$ is constant, not changing, along a level curve. What does that constancy say about $dF$?"),
                W(r"They are perpendicular to all solutions", r"They are the solutions themselves, not perpendicular to them. What does $dF = 0$ describe?"),
            ],
        ),
    ],
)

# === 7.2 video 2 ============================================================
add_micro(
    "a7wYAtMjORQ",
    'Unit 7, Module 7.2, video 2\n           "Exact equations intuition 2 (proofy) Khan Academy"',
    [
        item(
            "mp_a7wYAtMjORQ_1",
            r"To reconstruct the potential $F$ from $F_x = M$, the natural step is to do what?",
            r"Reverse the partial differentiation in $x$ by partially integrating $M$ in $x$.",
            [
                C(r"Integrate $M$ with respect to $x$, holding $y$ fixed", r"Yes. Partial integration of $M$ in $x$ recovers $F$ up to a function of $y$."),
                W(r"Differentiate $M$ with respect to $y$", r"That moves away from $F$, not toward it. What operation undoes $F_x = M$?"),
                W(r"Integrate $M$ with respect to $y$", r"You should reverse the $x$ derivative, so integrate in the matching variable. Which variable is that?"),
                W(r"Set $F = M$", r"$M$ is the $x$ partial of $F$, not $F$ itself. What operation recovers $F$ from its partial?"),
            ],
        ),
        item(
            "mp_a7wYAtMjORQ_2",
            r"After integrating $M$ in $x$ to get $F = \int M\,dx + g(y)$, how do you determine $g(y)$?",
            r"Differentiate this $F$ in $y$, set the result equal to $N$, and solve.",
            [
                C(r"Set $\frac{\partial}{\partial y}\left(\int M\,dx\right) + g'(y) = N$ and solve for $g'(y)$", r"Yes. Matching $F_y$ to $N$ isolates $g'(y)$, which you then integrate."),
                W(r"Set $g(y) = N$", r"$N$ equals $F_y$, not $g(y)$ directly. What equation involving $g'(y)$ should you form?"),
                W(r"Set $g(y) = \int N\,dx$", r"You integrate the leftover in $y$, not $N$ in $x$. What condition pins down $g'(y)$?"),
                W(r"Differentiate $N$ in $x$", r"That tests exactness, it does not find $g$. Which matching condition gives $g'(y)$?"),
            ],
        ),
        item(
            "mp_a7wYAtMjORQ_3",
            r"For $(y^2)\,dx + (2xy)\,dy = 0$, integrating $M = y^2$ in $x$ gives which candidate potential?",
            r"Integrate $y^2$ in $x$ treating $y$ as constant, then add $g(y)$.",
            [
                C(r"$F = x y^2 + g(y)$", r"Correct. $\int y^2\,dx = x y^2$, plus the unknown $g(y)$."),
                W(r"$F = \frac{y^3}{3} + g(y)$", r"That integrates in $y$, not $x$. What is $\int y^2\,dx$ with $y$ held fixed?"),
                W(r"$F = x y^2$", r"You omitted the integration term. What function of $y$ should be appended?"),
                W(r"$F = 2xy + g(y)$", r"That looks like $N$, not the integral of $M$. What is $\int y^2\,dx$?"),
            ],
        ),
        item(
            "mp_a7wYAtMjORQ_4",
            r"Continuing the previous problem with $F = x y^2 + g(y)$ and $N = 2xy$, what is $g'(y)$?",
            r"Compute $F_y$ and set it equal to $N = 2xy$.",
            [
                C(r"$g'(y) = 0$", r"Correct. $F_y = 2xy + g'(y)$ must equal $2xy$, so $g'(y) = 0$."),
                W(r"$g'(y) = 2xy$", r"The $2xy$ already appears in $F_y$. What remains after subtracting it?"),
                W(r"$g'(y) = 2y$", r"There is no leftover linear term here. What does $2xy - 2xy$ equal?"),
                W(r"$g'(y) = x y^2$", r"That is part of $F$, not the leftover for $g'$. What is $N - F_y$ here?"),
            ],
        ),
        item(
            "mp_a7wYAtMjORQ_5",
            r"With $g'(y) = 0$, the implicit solution of $(y^2)\,dx + (2xy)\,dy = 0$ is what?",
            r"A zero $g'(y)$ means $g$ is a constant, which merges into the right-hand constant.",
            [
                C(r"$x y^2 = C$", r"Correct. With $g$ constant, the potential is $x y^2$, so $x y^2 = C$."),
                W(r"$x y^2 + y = C$", r"Since $g'(y) = 0$, no extra $y$ term appears. What is the potential without it?"),
                W(r"$\frac{y^3}{3} = C$", r"That came from integrating in the wrong variable. What did integrating $M$ in $x$ give?"),
                W(r"$2xy = C$", r"That is $N$, not the potential. What constant expression did the potential reduce to?"),
            ],
        ),
    ],
)

# === 7.3 video 1 ============================================================
add_micro(
    "VlE2jWCtH8c",
    'Unit 7, Module 7.3, video 1\n           "MAT 230 - First Order ODE Exact Equations Part I - Motivation"',
    [
        item(
            "mp_VlE2jWCtH8c_1",
            r"The total differential of a function $F(x, y)$ is given by which expression?",
            r"A small change in $F$ collects the contribution from changing $x$ and the contribution from changing $y$.",
            [
                C(r"$dF = F_x\,dx + F_y\,dy$", r"Yes. The total differential sums each partial times the change in its variable."),
                W(r"$dF = F_x\,dy + F_y\,dx$", r"The partials are paired with the wrong differentials. Which change does $F_x$ multiply?"),
                W(r"$dF = F_x + F_y$", r"The differentials $dx$ and $dy$ are missing. What multiplies each partial?"),
                W(r"$dF = F_{xx}\,dx + F_{yy}\,dy$", r"Those are second partials. Which order of derivative appears in the total differential?"),
            ],
        ),
        item(
            "mp_VlE2jWCtH8c_2",
            r"Exact equations are motivated by reversing which process?",
            r"Think about where a differential form like $M\,dx + N\,dy$ could have come from.",
            [
                C(r"Taking the total differential of an unknown potential $F$ and setting it to zero", r"Yes. An exact equation is the total differential of some $F$ set equal to zero, and solving recovers $F$."),
                W(r"Separating variables", r"Separation is a different technique. What operation on a potential produces $M\,dx + N\,dy$?"),
                W(r"Multiplying through by an integrating factor", r"That repairs non-exact equations. What process does an already exact equation reverse?"),
                W(r"Taking a Laplace transform", r"Transforms are unrelated here. What differential operation on $F$ yields the exact form?"),
            ],
        ),
        item(
            "mp_VlE2jWCtH8c_3",
            r"If $F(x, y) = x^2 y$, what is its total differential $dF$?",
            r"Compute $F_x$ and $F_y$, then assemble $F_x\,dx + F_y\,dy$.",
            [
                C(r"$dF = 2xy\,dx + x^2\,dy$", r"Correct. $F_x = 2xy$ and $F_y = x^2$ give this differential."),
                W(r"$dF = x^2\,dx + 2xy\,dy$", r"The partials are attached to the wrong differentials. What is $F_x$ here?"),
                W(r"$dF = 2xy\,dx + 2xy\,dy$", r"The $y$ partial is not $2xy$. What is $\frac{\partial}{\partial y}(x^2 y)$?"),
                W(r"$dF = 2x\,dx + 1\,dy$", r"You differentiated as if $y$ and $x$ were absent from the other factor. What are the full partials of $x^2 y$?"),
            ],
        ),
        item(
            "mp_VlE2jWCtH8c_4",
            r"Setting the total differential of a constant level $F(x, y) = C$ equal to zero expresses what physical idea?",
            r"On a level set the value of $F$ does not change as you move along the curve.",
            [
                C(r"Motion along a curve where $F$ is conserved, so no net change in $F$ occurs", r"Yes. The solution curves are paths of constant $F$, where the conserved quantity does not change."),
                W(r"Motion in the direction $F$ increases fastest", r"That is the gradient direction, across the level curve. What happens to $F$ along the solution curve?"),
                W(r"A region where $F$ is undefined", r"$F$ is well defined on its level curves. What stays constant as you move along one?"),
                W(r"A point where $F$ has a maximum", r"A level curve is generally not a single extremum. What value of $F$ is held fixed along it?"),
            ],
        ),
        item(
            "mp_VlE2jWCtH8c_5",
            r"Why is recognizing a differential form as exact useful for solving the equation?",
            r"If the form is already a total differential, solving reduces to undoing one differentiation.",
            [
                C(r"It reduces solving to finding a single potential $F$ whose differential is the given form", r"Yes. Exactness turns the problem into reconstructing one function $F$, then writing $F = C$."),
                W(r"It guarantees the solution is a straight line", r"Solutions are general level curves, not lines. What single object does exactness let you find?"),
                W(r"It removes the need for any integration", r"Recovering $F$ still requires integration. What does exactness simplify the task to?"),
                W(r"It makes the equation second order", r"Exactness keeps the equation first order. What solving shortcut does it provide?"),
            ],
        ),
    ],
)

# === 7.3 video 2 ============================================================
add_micro(
    "ljMaoSYfE1Q",
    'Unit 7, Module 7.3, video 2\n           "Exact Differential Equations - Providing Solutions using a Constructive Proof"',
    [
        item(
            "mp_ljMaoSYfE1Q_1",
            r"The constructive proof that an exact equation has a solution builds $F$ by which method?",
            r"It integrates one coefficient, then fixes the leftover by matching the other coefficient.",
            [
                C(r"Integrate $M$ in $x$, then differentiate in $y$ and match $N$ to fix the unknown function", r"Yes. This two-step construction produces an explicit potential $F$."),
                W(r"Guess $F$ and check it works", r"The proof is systematic, not a guess. What ordered steps build $F$ explicitly?"),
                W(r"Solve a second-order equation for $F$", r"No higher-order equation is needed. What pair of first-order steps recovers $F$?"),
                W(r"Take the Laplace transform of $M$ and $N$", r"Transforms are not part of this construction. What direct integration builds $F$?"),
            ],
        ),
        item(
            "mp_ljMaoSYfE1Q_2",
            r"In the construction, the exactness condition $M_y = N_x$ is what guarantees what step succeeds?",
            r"After differentiating $\int M\,dx$ in $y$ and subtracting from $N$, the leftover must not depend on $x$.",
            [
                C(r"The leftover that defines $g'(y)$ depends only on $y$, so it can be integrated", r"Yes. Exactness ensures the $x$ dependence cancels, leaving a pure function of $y$ to integrate."),
                W(r"The leftover is always zero", r"It need not be zero, only free of $x$. What does exactness ensure about the leftover's variables?"),
                W(r"The integral of $M$ diverges", r"Exactness does not cause divergence. What does it guarantee about the leftover term?"),
                W(r"The function $F$ becomes linear", r"$F$ need not be linear. What property of the $g'(y)$ leftover does exactness secure?"),
            ],
        ),
        item(
            "mp_ljMaoSYfE1Q_3",
            r"Solve the exact equation $(3x^2 + y)\,dx + (x)\,dy = 0$. What is the implicit solution?",
            r"Integrate $M = 3x^2 + y$ in $x$, then match $F_y$ to $N = x$.",
            [
                C(r"$x^3 + xy = C$", r"Correct. Integrating gives $x^3 + xy + g(y)$, and matching $N$ forces $g'(y) = 0$."),
                W(r"$x^3 + xy + y = C$", r"Matching $F_y = x$ to $N = x$ leaves $g'(y) = 0$, so no extra $y$ term. What is the potential then?"),
                W(r"$x^3 + y = C$", r"You dropped the cross term from integrating $y$ in $x$. What is $\int (3x^2 + y)\,dx$?"),
                W(r"$6x + xy = C$", r"That differentiates the cubic instead of integrating. What is $\int 3x^2\,dx$?"),
            ],
        ),
        item(
            "mp_ljMaoSYfE1Q_4",
            r"The constructive proof shows that an exact equation's solution is unique up to what?",
            r"The potential $F$ is determined only to within something that has zero differential.",
            [
                C(r"An additive constant in $F$", r"Yes. Any constant can be absorbed into the right-hand side, so $F$ is fixed up to a constant."),
                W(r"A multiplicative constant in $F$", r"Scaling $F$ would scale its differential. What additive change leaves the differential unchanged?"),
                W(r"An arbitrary function of $x$", r"A nonconstant function of $x$ changes the differential. What term has zero differential?"),
                W(r"Nothing, the solution is exactly one curve", r"The solution is a whole family of level curves. What freedom remains in $F$?"),
            ],
        ),
        item(
            "mp_ljMaoSYfE1Q_5",
            r"Could you equally well begin the construction by integrating $N$ in $y$ first?",
            r"The roles of $x$ and $y$ are symmetric in the exactness setup.",
            [
                C(r"Yes, integrating $N$ in $y$ and matching $M$ gives the same potential", r"Yes. The construction is symmetric, so either coefficient can start the process."),
                W(r"No, only $M$ can be integrated first", r"The setup treats $x$ and $y$ symmetrically. Which coefficient could you integrate in $y$ instead?"),
                W(r"No, integrating $N$ gives a different solution", r"A correct construction yields the same level curves. Why does starting with $N$ also work?"),
                W(r"Only if the equation is also separable", r"Separability is not required. What symmetry lets you start from $N$?"),
            ],
        ),
    ],
)

# === 7.4 video 1 ============================================================
add_micro(
    "rPZG1pfeJK0",
    'Unit 7, Module 7.4, video 1\n           "Non-Exact Differential Equations"',
    [
        item(
            "mp_rPZG1pfeJK0_1",
            r"Is the equation $(y)\,dx + (2x)\,dy = 0$ exact?",
            r"Compare $M_y$ for $M = y$ with $N_x$ for $N = 2x$.",
            [
                C(r"No, since $M_y = 1$ but $N_x = 2$", r"Correct. The cross partials differ, so the equation is not exact as written."),
                W(r"Yes, since $M_y = N_x$", r"Recompute. What is $\frac{\partial}{\partial y}(y)$ versus $\frac{\partial}{\partial x}(2x)$?"),
                W(r"Yes, since both are linear", r"Linearity does not ensure exactness. What do the cross partials equal here?"),
                W(r"It is undefined", r"The test applies cleanly. What are $M_y$ and $N_x$?"),
            ],
        ),
        item(
            "mp_rPZG1pfeJK0_2",
            r"When an equation fails the exactness test, the standard remedy is to multiply by what?",
            r"You want to rescale $M$ and $N$ so the cross partials line up.",
            [
                C(r"An integrating factor $\mu$ that makes the rescaled equation exact", r"Yes. A well chosen integrating factor restores the equality of cross partials."),
                W(r"A constant of integration", r"A constant does not change the cross partial mismatch. What variable factor can fix it?"),
                W(r"The derivative of $M$", r"Multiplying by a derivative is not the method. What factor is designed to restore exactness?"),
                W(r"Zero", r"Multiplying by zero destroys the equation. What nonzero factor repairs exactness?"),
            ],
        ),
        item(
            "mp_rPZG1pfeJK0_3",
            r"After multiplying by $\mu(x, y)$, the new equation $\mu M\,dx + \mu N\,dy = 0$ is exact when which condition holds?",
            r"Apply the exactness test to the rescaled coefficients $\mu M$ and $\mu N$.",
            [
                C(r"$\frac{\partial}{\partial y}(\mu M) = \frac{\partial}{\partial x}(\mu N)$", r"Yes. The exactness test now applies to the products $\mu M$ and $\mu N$."),
                W(r"$\mu M = \mu N$", r"Equality of the coefficients is not the test. Which cross partials of the products must match?"),
                W(r"$\mu_y = \mu_x$", r"The factor's own partials are not the condition. What cross partials of the rescaled coefficients must agree?"),
                W(r"$\frac{\partial}{\partial x}(\mu M) = \frac{\partial}{\partial y}(\mu N)$", r"The cross partials are taken in the opposite variables. Which derivative of $\mu M$ should match which of $\mu N$?"),
            ],
        ),
        item(
            "mp_rPZG1pfeJK0_4",
            r"For $(y)\,dx + (2x)\,dy = 0$, the expression $\frac{N_x - M_y}{M}$ equals what?",
            r"Use $M_y = 1$, $N_x = 2$, and $M = y$.",
            [
                C(r"$\frac{1}{y}$", r"Correct. $\frac{2 - 1}{y} = \frac{1}{y}$, a function of $y$ alone, signaling a $y$-only integrating factor."),
                W(r"$\frac{1}{x}$", r"The denominator here is $M = y$, not $x$. What is $\frac{N_x - M_y}{M}$?"),
                W(r"$\frac{1}{2x}$", r"That uses $N$ in the denominator, a different test. What does dividing by $M = y$ give?"),
                W(r"$0$", r"The numerator $N_x - M_y = 2 - 1$ is not zero. What is $\frac{1}{y}$?"),
            ],
        ),
        item(
            "mp_rPZG1pfeJK0_5",
            r"Why does a non-exact equation still describe the same solution curves as its exactified version?",
            r"Multiplying $M\,dx + N\,dy = 0$ by a nonzero factor does not change where the left side equals zero.",
            [
                C(r"Multiplying by a nonzero factor leaves the zero set unchanged, so the solutions are the same", r"Yes. Scaling both sides by a nonzero $\mu$ preserves the equation's solution curves."),
                W(r"The integrating factor changes the solutions entirely", r"A nonzero factor cannot change where the form equals zero. What stays the same after multiplying?"),
                W(r"Only the exact version has solutions", r"Both versions share solutions. Why does multiplying by nonzero $\mu$ preserve them?"),
                W(r"The factor shifts the curves by a constant", r"It rescales, it does not shift. What property of multiplying by nonzero $\mu$ keeps solutions fixed?"),
            ],
        ),
    ],
)

# === 7.4 video 2 ============================================================
add_micro(
    "wQ0lwznTSvY",
    'Unit 7, Module 7.4, video 2\n           "Integrating Factor for Exact Differential Equations (Differential Equations 30)"',
    [
        item(
            "mp_wQ0lwznTSvY_1",
            r"If $\frac{M_y - N_x}{N}$ depends on $x$ alone, the integrating factor is which function?",
            r"This case yields a factor depending only on $x$, found by integrating that ratio.",
            [
                C(r"$\mu(x) = \exp\left(\int \frac{M_y - N_x}{N}\,dx\right)$", r"Yes. When the ratio depends only on $x$, this exponential integrating factor restores exactness."),
                W(r"$\mu(x) = \int \frac{M_y - N_x}{N}\,dx$", r"The factor is the exponential of that integral, not the integral itself. What wraps the integral?"),
                W(r"$\mu(y) = \exp\left(\int \frac{M_y - N_x}{N}\,dy\right)$", r"A ratio depending on $x$ gives an $x$-only factor. Which variable should you integrate over?"),
                W(r"$\mu(x) = \frac{M_y - N_x}{N}$", r"That is the ratio before integrating and exponentiating. What two operations turn it into $\mu$?"),
            ],
        ),
        item(
            "mp_wQ0lwznTSvY_2",
            r"If instead $\frac{N_x - M_y}{M}$ depends on $y$ alone, the integrating factor is which function?",
            r"Mirror the previous case, swapping the roles of $x$ and $y$ and the order of the partials.",
            [
                C(r"$\mu(y) = \exp\left(\int \frac{N_x - M_y}{M}\,dy\right)$", r"Yes. When the ratio depends only on $y$, this exponential gives a $y$-only integrating factor."),
                W(r"$\mu(x) = \exp\left(\int \frac{N_x - M_y}{M}\,dx\right)$", r"A ratio depending on $y$ gives a $y$-only factor. Over which variable should you integrate?"),
                W(r"$\mu(y) = \frac{N_x - M_y}{M}$", r"That is just the ratio. What two operations convert it into the factor $\mu$?"),
                W(r"$\mu(y) = \ln\left(\frac{N_x - M_y}{M}\right)$", r"The factor uses an exponential of an integral, not a logarithm. What is the correct form?"),
            ],
        ),
        item(
            "mp_wQ0lwznTSvY_3",
            r"For $(y)\,dx + (2x)\,dy = 0$, the test $\frac{N_x - M_y}{M} = \frac{1}{y}$ leads to which integrating factor?",
            r"Integrate $\frac{1}{y}$ in $y$ and exponentiate.",
            [
                C(r"$\mu(y) = y$", r"Correct. $\exp\left(\int \frac{1}{y}\,dy\right) = \exp(\ln y) = y$."),
                W(r"$\mu(y) = \ln y$", r"That is the integral before exponentiating. What is $\exp(\ln y)$?"),
                W(r"$\mu(y) = \frac{1}{y}$", r"That is the ratio itself, not the factor. What does integrating and exponentiating give?"),
                W(r"$\mu(y) = e^y$", r"The integral is $\ln y$, not $y$. What is $\exp(\ln y)$?"),
            ],
        ),
        item(
            "mp_wQ0lwznTSvY_4",
            r"Multiplying $(y)\,dx + (2x)\,dy = 0$ by $\mu(y) = y$ gives which exact equation?",
            r"Distribute the factor $y$ across both coefficients.",
            [
                C(r"$(y^2)\,dx + (2xy)\,dy = 0$", r"Correct. Now $M_y = 2y = N_x$, so the equation is exact."),
                W(r"$(y)\,dx + (2xy)\,dy = 0$", r"The first coefficient must also be multiplied by $y$. What is $y \cdot y$?"),
                W(r"$(y^2)\,dx + (2x)\,dy = 0$", r"The second coefficient must also be multiplied by $y$. What is $y \cdot 2x$?"),
                W(r"$(2y)\,dx + (2xy)\,dy = 0$", r"Multiplying $y$ by $y$ gives $y^2$, not $2y$. What is the new first coefficient?"),
            ],
        ),
        item(
            "mp_wQ0lwznTSvY_5",
            r"Why must you check that $\frac{M_y - N_x}{N}$ depends on $x$ alone before using the $x$-only integrating factor formula?",
            r"The exponential formula in $x$ only makes sense if the integrand has no $y$ dependence.",
            [
                C(r"If the ratio still contains $y$, no purely $x$-dependent factor can fix the equation", r"Yes. The $x$-only formula applies precisely when the ratio is free of $y$."),
                W(r"Because the formula always works regardless", r"It only works in a special case. What must be true of the ratio for an $x$-only factor to exist?"),
                W(r"Because $N$ must be constant", r"$N$ need not be constant. What condition on the ratio justifies the $x$-only formula?"),
                W(r"Because $x$ must be positive", r"Sign of $x$ is not the issue. What dependence must the ratio avoid for this formula?"),
            ],
        ),
    ],
)

# === 7.5 video 1 ============================================================
add_micro(
    "u5NGfwNNqHw",
    'Unit 7, Module 7.5, video 1\n           "Almost Exact Differential equation and special integrating factor"',
    [
        item(
            "mp_u5NGfwNNqHw_1",
            r"An almost exact equation is one that is not exact but becomes exact after multiplying by what?",
            r"The phrase signals that a single special factor is all that stands between the equation and exactness.",
            [
                C(r"A special integrating factor", r"Yes. An almost exact equation needs just one integrating factor to become exact."),
                W(r"A second derivative", r"No higher derivative is introduced. What single factor restores exactness?"),
                W(r"A change of independent variable", r"The variables stay the same. What multiplier turns it exact?"),
                W(r"A boundary condition", r"Boundary data does not affect exactness. What factor does?"),
            ],
        ),
        item(
            "mp_u5NGfwNNqHw_2",
            r"For $(3xy + y^2)\,dx + (x^2 + xy)\,dy = 0$, computing $M_y - N_x$ gives what?",
            r"With $M = 3xy + y^2$ and $N = x^2 + xy$, find $M_y = 3x + 2y$ and $N_x = 2x + y$, then subtract.",
            [
                C(r"$x + y$", r"Correct. $(3x + 2y) - (2x + y) = x + y$."),
                W(r"$x - y$", r"Recheck the $y$ terms: $2y - y = y$, not $-y$. What is the full difference?"),
                W(r"$5x + 3y$", r"That added the partials instead of subtracting. What is $M_y - N_x$?"),
                W(r"$0$", r"The equation is not exact here. What nonzero expression is $M_y - N_x$?"),
            ],
        ),
        item(
            "mp_u5NGfwNNqHw_3",
            r"For that same equation, $\frac{M_y - N_x}{N} = \frac{x + y}{x^2 + xy}$ simplifies to which $x$-only function?",
            r"Factor the denominator as $x(x + y)$ and cancel.",
            [
                C(r"$\frac{1}{x}$", r"Correct. $\frac{x + y}{x(x + y)} = \frac{1}{x}$, which depends on $x$ alone."),
                W(r"$\frac{1}{y}$", r"The cancellation leaves $x$ in the denominator, not $y$. What is $\frac{x+y}{x(x+y)}$?"),
                W(r"$x + y$", r"You skipped the cancellation with the denominator. What remains after dividing by $x(x+y)$?"),
                W(r"$\frac{1}{x + y}$", r"Both numerator and one denominator factor are $x + y$ and cancel. What single factor remains?"),
            ],
        ),
        item(
            "mp_u5NGfwNNqHw_4",
            r"Given $\frac{M_y - N_x}{N} = \frac{1}{x}$, the integrating factor for that equation is which function?",
            r"Integrate $\frac{1}{x}$ in $x$ and exponentiate.",
            [
                C(r"$\mu(x) = x$", r"Correct. $\exp\left(\int \frac{1}{x}\,dx\right) = \exp(\ln x) = x$."),
                W(r"$\mu(x) = \ln x$", r"That is the integral before exponentiating. What is $\exp(\ln x)$?"),
                W(r"$\mu(x) = e^x$", r"The integral is $\ln x$, not $x$. What is $\exp(\ln x)$?"),
                W(r"$\mu(x) = \frac{1}{x}$", r"That is the ratio, not the factor. What does integrating and exponentiating produce?"),
            ],
        ),
        item(
            "mp_u5NGfwNNqHw_5",
            r"How do you decide whether to seek an integrating factor depending on $x$ alone versus $y$ alone?",
            r"Test which of the two diagnostic ratios collapses to a single-variable expression.",
            [
                C(r"Check if $\frac{M_y - N_x}{N}$ is $x$-only, otherwise check if $\frac{N_x - M_y}{M}$ is $y$-only", r"Yes. Whichever ratio reduces to one variable tells you which kind of factor to use."),
                W(r"Always use an $x$-only factor first", r"It only works when its ratio is $x$-only. What do you check before committing?"),
                W(r"Pick whichever variable appears in $M$", r"Appearance in $M$ is not the criterion. Which diagnostic ratios do you actually test?"),
                W(r"Use a $y$-only factor whenever $N$ is larger", r"Size of $N$ is irrelevant. What property of the diagnostic ratios decides the choice?"),
            ],
        ),
    ],
)

# === 7.5 video 2 ============================================================
add_micro(
    "tOdlvZpdako",
    'Unit 7, Module 7.5, video 2\n           "Lecture 11: Solving Almost Exact Differential Equations"',
    [
        item(
            "mp_tOdlvZpdako_1",
            r"After multiplying an almost exact equation by its integrating factor, the next step is to do what?",
            r"Once exact, the equation is solved by the standard potential reconstruction.",
            [
                C(r"Solve the now-exact equation by finding a potential $F$ with $F = C$", r"Yes. With exactness restored, you reconstruct $F$ and write $F = C$."),
                W(r"Differentiate the equation again", r"No further differentiation is needed. What standard procedure solves an exact equation?"),
                W(r"Separate the variables", r"The equation may not be separable. What method applies once it is exact?"),
                W(r"Apply a second integrating factor", r"One factor already made it exact. What do you do with an exact equation?"),
            ],
        ),
        item(
            "mp_tOdlvZpdako_2",
            r"After multiplying by $\mu(x) = x$, the equation $(3xy + y^2)\,dx + (x^2 + xy)\,dy = 0$ becomes which exact form?",
            r"Distribute $x$ across both coefficients.",
            [
                C(r"$(3x^2 y + x y^2)\,dx + (x^3 + x^2 y)\,dy = 0$", r"Correct. Each coefficient is multiplied by $x$, and now the cross partials match."),
                W(r"$(3xy + y^2)\,dx + (x^3 + x^2 y)\,dy = 0$", r"The first coefficient also needs the factor $x$. What is $x(3xy + y^2)$?"),
                W(r"$(3x^2 y + x y^2)\,dx + (x^2 + xy)\,dy = 0$", r"The second coefficient also needs the factor $x$. What is $x(x^2 + xy)$?"),
                W(r"$(3x^2 y + y^2)\,dx + (x^3 + xy)\,dy = 0$", r"Every term in each coefficient gets the factor $x$. What is $x \cdot y^2$ and $x \cdot xy$?"),
            ],
        ),
        item(
            "mp_tOdlvZpdako_3",
            r"For the exact form $(3x^2 y + x y^2)\,dx + (x^3 + x^2 y)\,dy = 0$, integrating $M$ in $x$ gives which potential candidate?",
            r"Integrate $3x^2 y + x y^2$ in $x$, treating $y$ as constant.",
            [
                C(r"$F = x^3 y + \frac{x^2 y^2}{2} + g(y)$", r"Correct. $\int 3x^2 y\,dx = x^3 y$ and $\int x y^2\,dx = \frac{x^2 y^2}{2}$, plus $g(y)$."),
                W(r"$F = x^3 y + x^2 y^2 + g(y)$", r"Recheck $\int x y^2\,dx$. What power and coefficient does integrating $x$ produce?"),
                W(r"$F = 6xy + y^2 + g(y)$", r"That differentiates instead of integrates. What is $\int 3x^2 y\,dx$?"),
                W(r"$F = x^3 y + \frac{x^2 y^2}{2}$", r"You omitted the integration term. What function of $y$ should be appended?"),
            ],
        ),
        item(
            "mp_tOdlvZpdako_4",
            r"Completing that solution, matching $F_y$ to $N = x^3 + x^2 y$ yields which implicit solution?",
            r"Differentiate $F = x^3 y + \frac{x^2 y^2}{2} + g(y)$ in $y$, compare with $N$, and solve for $g$.",
            [
                C(r"$x^3 y + \frac{x^2 y^2}{2} = C$", r"Correct. $F_y$ already equals $N$, so $g'(y) = 0$ and the potential is complete."),
                W(r"$x^3 y + \frac{x^2 y^2}{2} + y = C$", r"Matching $F_y$ to $N$ gives $g'(y) = 0$, so no extra $y$ term. What is the potential then?"),
                W(r"$x^3 y + x^2 y^2 = C$", r"The cross term carries a factor of one half from integration. What is the correct coefficient?"),
                W(r"$x^3 + x^2 y = C$", r"That is $N$, not the potential built from $M$. What did integrating $M$ in $x$ produce?"),
            ],
        ),
        item(
            "mp_tOdlvZpdako_5",
            r"Why is it important that the integrating factor be nonzero on the region of interest?",
            r"Multiplying by a factor that vanishes could erase or distort the original solution curves.",
            [
                C(r"A zero of the factor could introduce or remove solutions, so the equivalence holds only where it is nonzero", r"Yes. Solution equivalence between the two forms requires the factor to stay nonzero."),
                W(r"A zero makes the equation second order", r"Order is unchanged. What problem does a vanishing factor cause for the solutions?"),
                W(r"A zero speeds up the integration", r"Vanishing is a hazard, not a benefit. What can a zero of the factor do to solutions?"),
                W(r"It has no effect at all", r"Zeros of the factor matter. How can they alter the solution set?"),
            ],
        ),
    ],
)

# === 7.6 video 1 ============================================================
add_micro(
    "3rrfhp-VCMM",
    'Unit 7, Module 7.6, video 1\n           "DEqns: conservative vector fields and exact equations, part 1"',
    [
        item(
            "mp_3rrfhp-VCMM_1",
            r"An exact equation $M\,dx + N\,dy = 0$ corresponds to which kind of vector field $(M, N)$?",
            r"Exactness means $(M, N)$ is the gradient of a scalar potential.",
            [
                C(r"A conservative (gradient) vector field", r"Yes. Exactness is the statement that $(M, N) = \nabla F$, a conservative field."),
                W(r"A divergence-free field", r"Divergence-free is a different condition. What gradient structure does exactness express?"),
                W(r"A purely rotational field", r"Conservative fields have no rotation. What kind of field is $(M, N)$ when exact?"),
                W(r"A time-dependent field", r"Time is not involved here. What structural property does exactness give $(M, N)$?"),
            ],
        ),
        item(
            "mp_3rrfhp-VCMM_2",
            r"For a field $(M, N)$ on a simply connected region, the conservative test mirrors the exactness test as which equation?",
            r"Both conditions compare the same pair of cross partials.",
            [
                C(r"$M_y = N_x$", r"Yes. The conservative test and the exactness test are the same equality of cross partials."),
                W(r"$M_x = N_y$", r"Those are the straight partials. Which cross partials must agree?"),
                W(r"$M + N = 0$", r"That is not a derivative test. What partial derivative equality defines both?"),
                W(r"$\nabla \cdot (M, N) = 0$", r"That is the divergence-free condition, a different property. What test matches exactness?"),
            ],
        ),
        item(
            "mp_3rrfhp-VCMM_3",
            r"The potential function $F$ from solving an exact equation plays which role for the vector field?",
            r"The field is the gradient of $F$, so $F$ is its scalar potential.",
            [
                C(r"It is the scalar potential whose gradient is $(M, N)$", r"Yes. $F$ is the scalar potential, and $\nabla F = (M, N)$."),
                W(r"It is the divergence of the field", r"Divergence is a scalar built from derivatives, not the potential. What is $F$ to the field?"),
                W(r"It is the curl of the field", r"Curl measures rotation, not a potential. What scalar function has gradient $(M, N)$?"),
                W(r"It is the magnitude of the field", r"Magnitude is not a potential. What role does $F$ play with respect to the gradient?"),
            ],
        ),
        item(
            "mp_3rrfhp-VCMM_4",
            r"For a conservative field, the line integral $\int_C M\,dx + N\,dy$ between two points depends on what?",
            r"With a potential available, the fundamental theorem of line integrals applies.",
            [
                C(r"Only the endpoints, not the path taken", r"Yes. The integral equals the potential difference, so only the endpoints matter."),
                W(r"The length of the path", r"Length does not enter a potential difference. What does the integral depend on?"),
                W(r"The curvature of the path", r"Curvature is irrelevant for a gradient field. What fixes the integral's value?"),
                W(r"The orientation of the axes", r"Axis orientation does not change it. What two features set the value?"),
            ],
        ),
        item(
            "mp_3rrfhp-VCMM_5",
            r"Why does the level-curve picture of $F(x, y) = C$ unify exact equations and conservative fields?",
            r"The solution curves of the equation and the equipotential curves of the field are the same level sets.",
            [
                C(r"The solution curves of the exact equation are exactly the equipotential curves of the conservative field", r"Yes. Both describe the level sets of the same potential $F$."),
                W(r"They are unrelated coincidences", r"They share the same potential $F$. What curves do both frameworks describe?"),
                W(r"Only the field has level curves", r"The exact equation's solutions are level curves too. What common object do they share?"),
                W(r"The field has no potential", r"A conservative field does have a potential. What level sets connect the two views?"),
            ],
        ),
    ],
)

# === 7.6 video 2 ============================================================
add_micro(
    "1Db3jPmQTsI",
    'Unit 7, Module 7.6, video 2\n           "Differential Equations: exact equations and vector fields"',
    [
        item(
            "mp_1Db3jPmQTsI_1",
            r"The gradient $\nabla F$ at a point is oriented how relative to the solution curve $F = C$ through that point?",
            r"The gradient points toward steepest increase, straight across a level curve.",
            [
                C(r"Perpendicular to the solution curve", r"Yes. The gradient is always perpendicular to the level curve $F = C$."),
                W(r"Tangent to the solution curve", r"Along the curve $F$ is constant, but the gradient points where $F$ changes. What angle is that?"),
                W(r"Anti-parallel to the curve", r"There is no consistent parallel direction along a curve for the gradient. How is it oriented?"),
                W(r"At a fixed 30 degrees", r"The angle is set by geometry, not a fixed degree. What is it?"),
            ],
        ),
        item(
            "mp_1Db3jPmQTsI_2",
            r"Is the field $(M, N) = (2x, 2y)$ conservative, and if so what is a potential?",
            r"Check $M_y = N_x$, then integrate to find $F$.",
            [
                C(r"Yes, with potential $F = x^2 + y^2$", r"Correct. $M_y = 0 = N_x$, and $\nabla(x^2 + y^2) = (2x, 2y)$."),
                W(r"No, it is not conservative", r"Recompute $M_y$ and $N_x$. Are they equal here?"),
                W(r"Yes, with potential $F = 2x + 2y$", r"Check the gradient of $2x + 2y$; it is $(2, 2)$. What potential gives $(2x, 2y)$?"),
                W(r"Yes, with potential $F = xy$", r"The gradient of $xy$ is $(y, x)$. What potential yields $(2x, 2y)$?"),
            ],
        ),
        item(
            "mp_1Db3jPmQTsI_3",
            r"A field whose cross partials do not match, such as $(M, N) = (-y, x)$, is what?",
            r"Test $M_y$ against $N_x$ for $M = -y$, $N = x$.",
            [
                C(r"Not conservative, since $M_y = -1 \neq 1 = N_x$", r"Correct. The cross partials differ, so the field is not conservative and the equation is not exact."),
                W(r"Conservative, since $M_y = N_x$", r"Recompute. What are $\frac{\partial}{\partial y}(-y)$ and $\frac{\partial}{\partial x}(x)$?"),
                W(r"Conservative, since it rotates", r"Rotation is the opposite of conservative behavior. What do the cross partials say?"),
                W(r"Exact after no changes", r"It fails the exactness test as written. What do $M_y$ and $N_x$ equal?"),
            ],
        ),
        item(
            "mp_1Db3jPmQTsI_4",
            r"The line integral of a conservative field around a closed loop equals what?",
            r"On a closed loop the start and end points coincide, so the potential difference vanishes.",
            [
                C(r"Zero", r"Yes. With start equal to end, the potential difference, and thus the integral, is zero."),
                W(r"The area enclosed", r"Area is a different quantity. What does the potential difference give when the points coincide?"),
                W(r"The perimeter length", r"Length does not enter a gradient integral. What is the value on a closed loop?"),
                W(r"A nonzero circulation", r"Conservative fields have zero circulation. Why must the closed-loop integral vanish?"),
            ],
        ),
        item(
            "mp_1Db3jPmQTsI_5",
            r"Why does the simply connected requirement matter for concluding that $M_y = N_x$ implies a potential exists?",
            r"On domains with holes, matching cross partials can fail to guarantee a single-valued potential.",
            [
                C(r"On a region with holes, matching cross partials may not yield a single-valued global potential", r"Yes. Simple connectivity rules out holes that could block a global potential."),
                W(r"It guarantees the field is constant", r"Connectivity does not force constancy. What does it ensure about the potential?"),
                W(r"It makes the cross partials automatically equal", r"Connectivity does not create the equality; it lets the equality imply a potential. Why is that needed?"),
                W(r"It is never actually required", r"It genuinely matters on domains with holes. What can go wrong without it?"),
            ],
        ),
    ],
)

# === 7.7 video 1 ============================================================
add_micro(
    "S8exyRjtatE",
    'Unit 7, Module 7.7, video 1\n           "state functions as exact differentials"',
    [
        item(
            "mp_S8exyRjtatE_1",
            r"In thermodynamics, a state function has a differential that is what?",
            r"A state function depends only on the current state, so its change depends only on endpoints.",
            [
                C(r"An exact differential, path independent", r"Yes. State functions have exact differentials, so changes depend only on the endpoints."),
                W(r"An inexact differential, path dependent", r"Path dependence is the signature of a process quantity, not a state function. What is a state function's differential?"),
                W(r"Always zero", r"State functions can change. What kind of differential do they have?"),
                W(r"Undefined", r"State functions have well defined differentials. Which type, exact or inexact?"),
            ],
        ),
        item(
            "mp_S8exyRjtatE_2",
            r"Which of these is a state function, with an exact differential?",
            r"State functions describe the condition of a system, not the process used to reach it.",
            [
                C(r"Internal energy $U$", r"Yes. Internal energy is a state function with the exact differential $dU$."),
                W(r"Heat $Q$", r"Heat is exchanged during a process and depends on the path. Which listed quantity describes only the state?"),
                W(r"Work $W$", r"Work depends on the path of the process. Which quantity depends only on the current state?"),
                W(r"Heat plus work along a path", r"That is path dependent by construction. Which single quantity is a state function?"),
            ],
        ),
        item(
            "mp_S8exyRjtatE_3",
            r"For an exact differential $dU = M\,dT + N\,dV$, the Maxwell-type condition requires which equality?",
            r"Apply the exactness test to the coefficients of $dT$ and $dV$.",
            [
                C(r"$\frac{\partial M}{\partial V} = \frac{\partial N}{\partial T}$", r"Yes. Exactness of $dU$ forces the cross partials in $T$ and $V$ to match."),
                W(r"$\frac{\partial M}{\partial T} = \frac{\partial N}{\partial V}$", r"Those are the straight partials. Which cross partials must agree for exactness?"),
                W(r"$M = N$", r"The coefficients need not be equal. Which derivatives must match?"),
                W(r"$M + N = 0$", r"That is not the exactness condition. Which cross partials must be equal?"),
            ],
        ),
        item(
            "mp_S8exyRjtatE_4",
            r"The closed-loop integral $\oint dU$ of a state function around any cyclic process equals what?",
            r"After a full cycle the system returns to its starting state.",
            [
                C(r"Zero", r"Yes. Returning to the same state gives no net change, so the cyclic integral is zero."),
                W(r"The net heat added", r"Net heat over a cycle need not be zero, but the state function change is. What is $\oint dU$?"),
                W(r"The total work done", r"Work over a cycle can be nonzero, unlike the state function change. What is the cyclic integral of $dU$?"),
                W(r"Always positive", r"A state function returns to its value after a cycle. What is its net change?"),
            ],
        ),
        item(
            "mp_S8exyRjtatE_5",
            r"Why is the exact-differential idea from differential equations the right language for state functions?",
            r"Both express that a quantity is recovered from a potential and changes only between endpoints.",
            [
                C(r"Both describe a quantity recovered from a potential whose change depends only on the endpoints", r"Yes. State functions are potentials, and their exact differentials are path independent, exactly as in exact equations."),
                W(r"Because thermodynamics avoids calculus", r"Thermodynamics relies heavily on calculus. What shared structure links the two?"),
                W(r"Because heat is always exact", r"Heat is the inexact example, not the exact one. What property do state functions share with exact equations?"),
                W(r"Because every differential is exact", r"Many differentials are inexact. What special property do state functions have in common with exact equations?"),
            ],
        ),
    ],
)

# === 7.7 video 2 ============================================================
add_micro(
    "ATEKyjK9b4Y",
    'Unit 7, Module 7.7, video 2\n           "Exact and Inexact differential equations, Thermodynamics"',
    [
        item(
            "mp_ATEKyjK9b4Y_1",
            r"An inexact differential, often written $\delta Q$, signals that the quantity is what?",
            r"The special delta symbol warns that the quantity is not a state function.",
            [
                C(r"Path dependent, not a state function", r"Yes. The delta notation marks a path-dependent process quantity like heat."),
                W(r"Path independent, a state function", r"The delta symbol marks the opposite of a state function. What kind of quantity is it?"),
                W(r"Always larger than $dU$", r"Magnitude is not the point. What does the inexact notation indicate about the path?"),
                W(r"A second derivative", r"It is a first-order differential, just inexact. What does it tell you about path dependence?"),
            ],
        ),
        item(
            "mp_ATEKyjK9b4Y_2",
            r"The first law of thermodynamics is often written $dU = \delta Q - \delta W$. Which term is the exact differential?",
            r"Only the change in a state function is exact.",
            [
                C(r"$dU$, since $U$ is a state function", r"Yes. Internal energy is a state function, so $dU$ is exact, while $\delta Q$ and $\delta W$ are inexact."),
                W(r"$\delta Q$, since heat is conserved", r"Heat is path dependent and its differential is inexact. Which term here is exact?"),
                W(r"$\delta W$, since work is a force times distance", r"Work is path dependent, so $\delta W$ is inexact. Which differential is exact?"),
                W(r"All three are exact", r"Two of these are inexact process quantities. Which single term is the exact differential?"),
            ],
        ),
        item(
            "mp_ATEKyjK9b4Y_3",
            r"How can an inexact differential like $\delta Q$ sometimes be converted into an exact one?",
            r"Dividing heat by temperature produces the differential of entropy, a state function.",
            [
                C(r"Multiply by an integrating factor, for example $\frac{1}{T}$, giving the exact differential $dS$", r"Yes. The factor $1/T$ turns $\delta Q$ into the exact differential of entropy."),
                W(r"Add a constant to it", r"Adding a constant does not change exactness. What multiplier converts $\delta Q$ to an exact form?"),
                W(r"Differentiate it once more", r"Differentiation does not exactify it. What integrating factor produces $dS$?"),
                W(r"Set it equal to $dW$", r"Both are inexact, so that does not help. What factor makes $\delta Q$ exact?"),
            ],
        ),
        item(
            "mp_ATEKyjK9b4Y_4",
            r"The role of $\frac{1}{T}$ in producing $dS = \frac{\delta Q}{T}$ for a reversible process is best described as what?",
            r"This is the same idea as repairing a non-exact differential equation.",
            [
                C(r"An integrating factor that exactifies the inexact heat differential", r"Yes. Temperature's reciprocal is the integrating factor that makes the heat differential exact."),
                W(r"A boundary condition", r"It is a multiplier, not a boundary value. What standard device does $1/T$ act as?"),
                W(r"A separation constant", r"It does not separate variables. What does multiplying $\delta Q$ by $1/T$ accomplish?"),
                W(r"A second potential", r"It is not itself a potential. What function does $1/T$ serve in exactifying $\delta Q$?"),
            ],
        ),
        item(
            "mp_ATEKyjK9b4Y_5",
            r"Why does distinguishing exact from inexact differentials matter physically in thermodynamics?",
            r"It tells you whether a quantity is fixed by the state or depends on how the change was carried out.",
            [
                C(r"It separates state functions, fixed by the current state, from process quantities that depend on the path", r"Yes. The distinction tells you which quantities are properties of the state and which depend on the process."),
                W(r"It determines the units of temperature", r"Units are unrelated to exactness. What physical distinction does it capture?"),
                W(r"It makes all processes reversible", r"Exactness does not force reversibility. What does the distinction actually classify?"),
                W(r"It eliminates the need for the first law", r"The first law still holds. What does the exact versus inexact split clarify physically?"),
            ],
        ),
    ],
)


# ============================================================================
# UNIT 8 MICRO PRACTICE
# ============================================================================

# === 8.1 video 1 ============================================================
add_micro(
    "A1hy1skVwzI",
    'Unit 8, Module 8.1, video 1\n           "The Clairaut Differential Equation and Singular Solutions"',
    [
        item(
            "mp_A1hy1skVwzI_1",
            r"A Clairaut equation has which general form, writing $p = \frac{dy}{dx}$?",
            r"The hallmark is $y$ standing alone equal to $x$ times its slope plus a function of the slope.",
            [
                C(r"$y = x p + f(p)$", r"Yes. The Clairaut form sets $y$ equal to $xp$ plus a function of the slope $p$."),
                W(r"$y = x + f(p)$", r"The slope must multiply $x$ in this form. What factor sits in front of $x$?"),
                W(r"$y = p^2 + f(x)$", r"The extra function depends on $p$, not $x$, and $x$ appears times $p$. What is the correct structure?"),
                W(r"$y' = x y + f(y)$", r"That is not the Clairaut pattern. How does $y$ relate to $xp$ and $f(p)$?"),
            ],
        ),
        item(
            "mp_A1hy1skVwzI_2",
            r"The general solution of a Clairaut equation $y = xp + f(p)$ is obtained by replacing $p$ with what?",
            r"Differentiating leads to a factor that vanishes when the slope is constant.",
            [
                C(r"An arbitrary constant $c$, giving $y = cx + f(c)$", r"Yes. The general solution is the one-parameter family of straight lines $y = cx + f(c)$."),
                W(r"Zero, giving $y = f(0)$", r"Setting $p = 0$ gives one line, not the family. What replaces $p$ to produce all solution lines?"),
                W(r"$x$, giving $y = x^2 + f(x)$", r"The slope is a constant in the general solution, not $x$. What constant replaces $p$?"),
                W(r"$\frac{1}{x}$", r"The general solution is a family of lines with constant slope. What replaces $p$?"),
            ],
        ),
        item(
            "mp_A1hy1skVwzI_3",
            r"For $y = xp + p^2$, the general solution is which family?",
            r"Replace $p$ by a constant $c$ in $y = xp + f(p)$ with $f(p) = p^2$.",
            [
                C(r"$y = cx + c^2$", r"Correct. Substituting the constant slope $c$ gives the line family $y = cx + c^2$."),
                W(r"$y = cx - c^2$", r"Check the sign of $f(c) = c^2$. Is it added or subtracted in the Clairaut form?"),
                W(r"$y = cx^2 + c$", r"The constant $c$ is the slope multiplying $x$ to the first power. What is the line family?"),
                W(r"$y = x c^2$", r"The term $xp$ becomes $cx$, plus $f(c)$. What is the full expression?"),
            ],
        ),
        item(
            "mp_A1hy1skVwzI_4",
            r"Differentiating $y = xp + f(p)$ with respect to $x$ leads to which factored condition?",
            r"Use the product rule on $xp$ and the chain rule on $f(p)$, then collect the $\frac{dp}{dx}$ terms.",
            [
                C(r"$\left(x + f'(p)\right)\frac{dp}{dx} = 0$", r"Yes. After cancellation, the equation factors into this product set equal to zero."),
                W(r"$p + f'(p) = 0$", r"The factor $\frac{dp}{dx}$ is missing. What multiplies $x + f'(p)$ after differentiating?"),
                W(r"$x \frac{dp}{dx} = 0$", r"The term $f'(p)\frac{dp}{dx}$ also belongs. What full factor multiplies $\frac{dp}{dx}$?"),
                W(r"$\frac{dp}{dx} = p$", r"Differentiating yields a product equal to zero, not this. What factored form results?"),
            ],
        ),
        item(
            "mp_A1hy1skVwzI_5",
            r"The two cases from $\left(x + f'(p)\right)\frac{dp}{dx} = 0$ correspond to which pair of solution types?",
            r"One factor being zero gives constant slope; the other gives a special curve.",
            [
                C(r"$\frac{dp}{dx} = 0$ gives the general line family, and $x + f'(p) = 0$ gives the singular solution", r"Yes. Constant slope yields the lines, while the other factor yields the singular envelope solution."),
                W(r"Both factors give the same line family", r"The two factors give genuinely different solution types. What does $x + f'(p) = 0$ produce?"),
                W(r"$\frac{dp}{dx} = 0$ gives the singular solution", r"Constant slope produces the straight-line family, not the singular one. Which factor gives the singular solution?"),
                W(r"Neither factor yields a valid solution", r"Both lead to solutions. What does each factor produce?"),
            ],
        ),
    ],
)

# === 8.1 video 2 ============================================================
add_micro(
    "DNT2eXBTW34",
    'Unit 8, Module 8.1, video 2\n           "Clairaut Differential Equation (general, singular solutions and their graphs)"',
    [
        item(
            "mp_DNT2eXBTW34_1",
            r"The singular solution of a Clairaut equation is geometrically what, relative to the family of solution lines?",
            r"It is the curve that each line in the family touches tangentially.",
            [
                C(r"The envelope of the family of straight-line solutions", r"Yes. The singular solution is the envelope tangent to every line in the general family."),
                W(r"One specific line in the family", r"The singular solution is generally curved, not a member line. What curve do all the lines touch?"),
                W(r"A line perpendicular to all solutions", r"It is tangent to the lines, not perpendicular. What curve is that?"),
                W(r"The $x$-axis always", r"The envelope depends on $f$, not always the axis. What is the singular solution in general?"),
            ],
        ),
        item(
            "mp_DNT2eXBTW34_2",
            r"For $y = xp + p^2$, the singular solution comes from eliminating $p$ between $y = xp + p^2$ and which equation?",
            r"Set the other factor $x + f'(p) = 0$ with $f(p) = p^2$.",
            [
                C(r"$x + 2p = 0$", r"Yes. Since $f'(p) = 2p$, the condition is $x + 2p = 0$."),
                W(r"$x + p = 0$", r"Recompute $f'(p)$ for $f(p) = p^2$. What is the derivative?"),
                W(r"$x + p^2 = 0$", r"That is $f(p)$, not $f'(p)$. What is $\frac{d}{dp}(p^2)$?"),
                W(r"$2x + p = 0$", r"The derivative attaches to $f$, giving $x + f'(p)$. What is $f'(p)$ here?"),
            ],
        ),
        item(
            "mp_DNT2eXBTW34_3",
            r"Solving $x + 2p = 0$ for $p$ and substituting into $y = xp + p^2$ gives which singular solution?",
            r"From $p = -x/2$, substitute into $y = xp + p^2$ and simplify.",
            [
                C(r"$y = -\frac{x^2}{4}$", r"Correct. With $p = -x/2$, $y = x(-x/2) + (x/2)^2 = -x^2/4$."),
                W(r"$y = \frac{x^2}{4}$", r"Check the sign of $xp = x(-x/2)$. Is the dominant term positive or negative?"),
                W(r"$y = -\frac{x^2}{2}$", r"Combine $-x^2/2 + x^2/4$ carefully. What is the sum?"),
                W(r"$y = -x^2$", r"Recompute $x(-x/2) + (x/2)^2$. What single term results?"),
            ],
        ),
        item(
            "mp_DNT2eXBTW34_4",
            r"Why is the singular solution not part of the general one-parameter family?",
            r"No single choice of the constant slope reproduces a curved envelope.",
            [
                C(r"No value of the constant $c$ produces it, since it is the envelope rather than a member line", r"Yes. The envelope is a separate solution that no constant slope generates."),
                W(r"It violates the differential equation", r"The singular solution does satisfy the equation. Why is it still outside the family?"),
                W(r"It is just $c = 0$", r"A single constant gives a line, not the curved envelope. Why can no constant produce it?"),
                W(r"It is the same as every line", r"It is tangent to the lines but distinct from them. Why is it not in the family?"),
            ],
        ),
        item(
            "mp_DNT2eXBTW34_5",
            r"On a graph, how does the singular solution relate to each line of the general family?",
            r"An envelope touches each family member at exactly one point.",
            [
                C(r"It is tangent to each line at one point", r"Yes. The envelope touches every solution line tangentially at a single point."),
                W(r"It crosses each line twice", r"An envelope touches, it does not generally cross twice. How does it meet each line?"),
                W(r"It never touches any line", r"The envelope is defined by touching the lines. How does it meet each one?"),
                W(r"It coincides with one line everywhere", r"It is a distinct curve, not a single line. How does it touch the family members?"),
            ],
        ),
    ],
)

# === 8.2 video 1 ============================================================
add_micro(
    "5kyE-vUoymU",
    'Unit 8, Module 8.2, video 1\n           "Boat Pursuit Problem (Pursuit Curves Explained)"',
    [
        item(
            "mp_5kyE-vUoymU_1",
            r"In a pursuit curve problem, the pursuer's velocity vector is always directed how?",
            r"The chaser steers straight at the target at every instant.",
            [
                C(r"Toward the target's current position", r"Yes. The defining rule is that the pursuer always points at where the target is now."),
                W(r"Toward the target's starting position", r"The chaser updates direction continuously, not toward the start. Where does it point at each instant?"),
                W(r"Perpendicular to the target's motion", r"The chaser aims at the target, not at a right angle. Which direction does its velocity take?"),
                W(r"Along a fixed straight line", r"The direction changes as the target moves. What position does the pursuer aim at?"),
            ],
        ),
        item(
            "mp_5kyE-vUoymU_2",
            r"The pursuit condition translates into a differential equation by setting the pursuer's slope equal to what?",
            r"The line from pursuer to target has a slope determined by their coordinate differences.",
            [
                C(r"The slope of the line connecting the pursuer to the target", r"Yes. The pursuer's path slope must match the slope toward the target's location."),
                W(r"Zero at all times", r"The slope is generally nonzero and changing. What geometric slope does it match?"),
                W(r"The target's speed", r"Speed is not a slope. What direction does the pursuer's slope align with?"),
                W(r"A constant equal to one", r"The slope varies with position. What line's slope does it equal?"),
            ],
        ),
        item(
            "mp_5kyE-vUoymU_3",
            r"In the classic boat problem, what physical quantities are typically given to set up the model?",
            r"You need how fast each object moves to relate the distances traveled.",
            [
                C(r"The speeds of the pursuer and the target", r"Yes. The ratio of the two speeds drives the geometry of the pursuit curve."),
                W(r"Only the starting positions", r"Positions alone cannot determine the curve without motion rates. What speeds are needed?"),
                W(r"The water temperature", r"Temperature is irrelevant to the geometry. What kinematic quantities matter?"),
                W(r"The color of the boats", r"Color plays no role. What speeds set up the pursuit model?"),
            ],
        ),
        item(
            "mp_5kyE-vUoymU_4",
            r"Whether the pursuer ever catches the target generally depends on what comparison?",
            r"Catching up requires moving fast enough relative to the one being chased.",
            [
                C(r"Whether the pursuer's speed exceeds the target's speed", r"Yes. The outcome hinges on the ratio of speeds, with a faster pursuer able to catch up."),
                W(r"Whether the pursuer starts higher", r"Starting height does not decide capture. What speed comparison does?"),
                W(r"Whether the path is a straight line", r"Pursuit paths are typically curved regardless. What determines capture?"),
                W(r"The number of turns made", r"Turn count is not the criterion. Which speed comparison governs capture?"),
            ],
        ),
        item(
            "mp_5kyE-vUoymU_5",
            r"Why does the pursuit curve generally bend rather than stay straight?",
            r"The aim point keeps moving, so the steering direction continuously updates.",
            [
                C(r"Because the target moves, the pursuer must continually redirect, curving its path", r"Yes. Constantly re-aiming at a moving target produces a curved trajectory."),
                W(r"Because the pursuer slows down", r"Speed changes are not the cause. What about the target forces continual redirection?"),
                W(r"Because the water pushes it sideways", r"External currents are not assumed. What makes the aim direction change over time?"),
                W(r"Because the path must be a circle", r"Pursuit curves are not generally circles. Why does the path bend at all?"),
            ],
        ),
    ],
)

# === 8.2 video 2 ============================================================
add_micro(
    "apf5UDQU1NE",
    'Unit 8, Module 8.2, video 2\n           "The Tractrix: A Calculus Problem"',
    [
        item(
            "mp_apf5UDQU1NE_1",
            r"The tractrix is the path traced by an object dragged by a string of constant length when the puller moves along a straight line. What stays constant along the curve?",
            r"Picture the taut string as a tangent segment reaching from the curve to the line the puller follows.",
            [
                C(r"The length of the tangent segment from the curve to the line is constant", r"Yes. The defining property is that the tangent segment from the curve to the axis has fixed length."),
                W(r"The slope of the curve is constant", r"The slope changes along a tractrix. What length stays fixed instead?"),
                W(r"The area under the curve is constant", r"Area is not the invariant here. What tangent-segment length is fixed?"),
                W(r"The height $y$ is constant", r"The height decreases along the curve. What constant length defines the tractrix?"),
            ],
        ),
        item(
            "mp_apf5UDQU1NE_2",
            r"For a tractrix with string length $a$ dragged along the $x$-axis, the differential equation is which of these?",
            r"The tangent length condition gives a slope built from $y$ and $\sqrt{a^2 - y^2}$.",
            [
                C(r"$\frac{dy}{dx} = -\frac{y}{\sqrt{a^2 - y^2}}$", r"Yes. The constant tangent length yields this slope, negative as the curve descends toward the axis."),
                W(r"$\frac{dy}{dx} = \frac{\sqrt{a^2 - y^2}}{y}$", r"That is the reciprocal slope. Which quantity belongs in the numerator for a descending curve?"),
                W(r"$\frac{dy}{dx} = -\frac{\sqrt{a^2 - y^2}}{y}$", r"The numerator and denominator are swapped. Which expression sits over the square root?"),
                W(r"$\frac{dy}{dx} = \frac{y}{a}$", r"The slope involves $\sqrt{a^2 - y^2}$, not just $a$. What is the correct denominator?"),
            ],
        ),
        item(
            "mp_apf5UDQU1NE_3",
            r"As the dragged object approaches the line of travel, the tractrix does what?",
            r"As $y \to 0$, consider the height and the slope behavior of the curve.",
            [
                C(r"It approaches the line asymptotically, getting ever closer without reaching it in finite distance", r"Yes. The tractrix approaches the axis asymptotically as the object trails behind."),
                W(r"It crosses the line at a right angle", r"The curve flattens toward the line rather than crossing sharply. How does it approach the axis?"),
                W(r"It loops back upward", r"The tractrix descends monotonically. What does it do near the axis?"),
                W(r"It stops abruptly at the line", r"The approach is gradual and asymptotic. How does the curve meet the axis?"),
            ],
        ),
        item(
            "mp_apf5UDQU1NE_4",
            r"The tractrix is an example of which broader class of problems from this module?",
            r"It arises from one object trailing another that moves along a path.",
            [
                C(r"Pursuit and dragging problems", r"Yes. The tractrix is a dragging problem, closely related to pursuit curves."),
                W(r"Resonance problems", r"Resonance concerns oscillators, not dragging. Which class does the tractrix belong to?"),
                W(r"Heat conduction problems", r"Heat flow is unrelated to this geometry. What class fits a dragged object?"),
                W(r"Eigenvalue problems", r"Eigenvalues are not involved here. What kind of problem is a dragged-string curve?"),
            ],
        ),
        item(
            "mp_apf5UDQU1NE_5",
            r"Why does the square root $\sqrt{a^2 - y^2}$ appear in the tractrix equation?",
            r"It is the horizontal leg of a right triangle whose hypotenuse is the string of length $a$ and whose vertical leg is $y$.",
            [
                C(r"It is the horizontal leg of a right triangle with hypotenuse $a$ and vertical leg $y$", r"Yes. The Pythagorean relation on the string triangle produces $\sqrt{a^2 - y^2}$."),
                W(r"It is the area of the triangle", r"That expression is a length, not an area. Which leg of the string triangle is it?"),
                W(r"It is the slope of the string", r"It is a length used in the slope, not the slope itself. What geometric leg is it?"),
                W(r"It is an arbitrary constant", r"It depends on $y$ and $a$ by geometry. What triangle leg does it represent?"),
            ],
        ),
    ],
)

# === 8.3 video 1 ============================================================
add_micro(
    "hFcgcxw_TPo",
    'Unit 8, Module 8.3, video 1\n           "Fluid Dynamics - Differential Equations in Action"',
    [
        item(
            "mp_hFcgcxw_TPo_1",
            r"Fluid dynamics models the motion of fluids using which mathematical tool?",
            r"Rates of change of velocity in space and time are described by derivatives.",
            [
                C(r"Differential equations relating velocity, pressure, and their rates of change", r"Yes. Fluid motion is governed by differential equations linking velocity, pressure, and their derivatives."),
                W(r"Only algebraic equations", r"Static algebra cannot capture changing flow. What kind of equations describe rates of change?"),
                W(r"Only probability distributions", r"Randomness is not the core tool here. What equations model the flow's evolution?"),
                W(r"Simple linear interpolation", r"Interpolation does not model dynamics. What mathematical objects govern fluid motion?"),
            ],
        ),
        item(
            "mp_hFcgcxw_TPo_2",
            r"A conservation law in fluid dynamics, such as conservation of mass, is expressed by which kind of equation?",
            r"Mass conservation balances how much fluid flows in against how much accumulates.",
            [
                C(r"A continuity equation balancing inflow, outflow, and accumulation", r"Yes. The continuity equation enforces conservation of mass through a balance of flow and storage."),
                W(r"A single number", r"A conservation law is a relation, not a constant. What balancing equation expresses it?"),
                W(r"An unrelated geometric identity", r"It is a physical balance, not pure geometry. What equation encodes mass conservation?"),
                W(r"A purely statistical average", r"Conservation is deterministic here. What flow-balance equation states it?"),
            ],
        ),
        item(
            "mp_hFcgcxw_TPo_3",
            r"Why are many realistic fluid flow equations difficult to solve exactly?",
            r"The terms describing how flow carries itself along make the equations nonlinear.",
            [
                C(r"They are nonlinear, so superposition and simple closed forms generally fail", r"Yes. Nonlinearity blocks superposition and usually prevents simple exact solutions."),
                W(r"They have no solutions at all", r"Solutions exist but are hard to find. What property makes them difficult?"),
                W(r"They are always trivially linear", r"If they were linear they would be easy; the trouble is the opposite. What property complicates them?"),
                W(r"They ignore all physical laws", r"They encode physical laws faithfully. What mathematical feature makes them hard?"),
            ],
        ),
        item(
            "mp_hFcgcxw_TPo_4",
            r"A streamline in a steady flow is best described as what?",
            r"It is the curve that the velocity field is tangent to everywhere.",
            [
                C(r"A curve tangent to the velocity vector at every point", r"Yes. Streamlines are everywhere tangent to the flow's velocity field."),
                W(r"A curve perpendicular to the velocity", r"Streamlines follow the flow, not cross it. How do they relate to the velocity vector?"),
                W(r"A line of constant pressure only", r"Constant-pressure lines are a different concept. What does a streamline stay tangent to?"),
                W(r"The boundary of the container", r"The boundary is fixed geometry, not a streamline in general. What field is a streamline tangent to?"),
            ],
        ),
        item(
            "mp_hFcgcxw_TPo_5",
            r"Why are differential equations the natural language for fluid flow?",
            r"Flow is defined by how velocity and pressure change from point to point and moment to moment.",
            [
                C(r"They capture how local quantities change continuously in space and time", r"Yes. Differential equations express the continuous local changes that define a flow."),
                W(r"Because fluids never change", r"Fluids change constantly; that is why derivatives are needed. What do the equations capture?"),
                W(r"Because flow is purely random", r"Flow has deterministic structure. What continuous changes do the equations describe?"),
                W(r"Because they avoid calculus", r"They are built from calculus. Why is that the right tool for flow?"),
            ],
        ),
    ],
)

# === 8.3 video 2 ============================================================
add_micro(
    "VvDJyhYSJv8",
    'Unit 8, Module 8.3, video 2\n           "Understanding Viscosity"',
    [
        item(
            "mp_VvDJyhYSJv8_1",
            r"Viscosity is a measure of a fluid's what?",
            r"It quantifies how strongly a fluid resists being sheared or made to flow.",
            [
                C(r"Resistance to flow, or internal friction between layers", r"Yes. Viscosity measures a fluid's internal resistance to shearing flow."),
                W(r"Total mass", r"Mass is unrelated to viscosity. What flow property does viscosity quantify?"),
                W(r"Color and clarity", r"Optical traits are not viscosity. What resistance does it measure?"),
                W(r"Temperature alone", r"Temperature affects viscosity but is not its definition. What does viscosity measure?"),
            ],
        ),
        item(
            "mp_VvDJyhYSJv8_2",
            r"For a Newtonian fluid, the shear stress is proportional to which quantity?",
            r"It depends on how quickly velocity changes across the layers of fluid.",
            [
                C(r"The velocity gradient, the rate of change of velocity across the flow", r"Yes. Newtonian shear stress is proportional to the velocity gradient, with viscosity as the constant."),
                W(r"The total volume of fluid", r"Volume is not the driver. What spatial rate of change sets the shear stress?"),
                W(r"The color of the fluid", r"Color is irrelevant. What gradient governs the stress?"),
                W(r"The square of the pressure", r"Pressure squared is not the relation. What velocity-related gradient applies?"),
            ],
        ),
        item(
            "mp_VvDJyhYSJv8_3",
            r"In the Newtonian relation $\tau = \mu \frac{du}{dy}$, what does the symbol $\mu$ represent?",
            r"It is the proportionality constant linking stress to the velocity gradient.",
            [
                C(r"The dynamic viscosity of the fluid", r"Yes. The constant $\mu$ is the dynamic viscosity relating stress to the velocity gradient."),
                W(r"The fluid's density", r"Density is a different property, often written with another symbol. What does $\mu$ denote here?"),
                W(r"The pressure", r"Pressure is not the proportionality constant. What does $\mu$ stand for?"),
                W(r"The velocity itself", r"Velocity appears in the gradient, not as $\mu$. What is $\mu$?"),
            ],
        ),
        item(
            "mp_VvDJyhYSJv8_4",
            r"Comparing honey and water, which statement about viscosity is correct?",
            r"Thicker, slower-pouring fluids resist flow more.",
            [
                C(r"Honey has higher viscosity than water", r"Yes. Honey resists flow much more strongly, so its viscosity is higher."),
                W(r"Water has higher viscosity than honey", r"Water pours far more freely than honey. Which fluid resists flow more?"),
                W(r"They have identical viscosity", r"Their flow behavior differs greatly. Which one is more viscous?"),
                W(r"Neither fluid has viscosity", r"Both real fluids have viscosity. Which has the larger value?"),
            ],
        ),
        item(
            "mp_VvDJyhYSJv8_5",
            r"Why does viscosity enter the differential equations of fluid flow?",
            r"Internal friction transfers momentum between fluid layers moving at different speeds.",
            [
                C(r"It models the momentum transfer and resistance between layers moving at different speeds", r"Yes. Viscous terms capture how internal friction transfers momentum across the flow."),
                W(r"It sets the color of the fluid", r"Color is not modeled by the equations. What physical effect does viscosity add?"),
                W(r"It removes all derivatives", r"Viscosity introduces derivative terms rather than removing them. What does it represent physically?"),
                W(r"It makes the flow instantaneous", r"Viscosity slows transfer rather than speeding it. What resistance does it model?"),
            ],
        ),
    ],
)

# === 8.4 video 1 ============================================================
add_micro(
    "yvFr5D7UAMQ",
    'Unit 8, Module 8.4, video 1\n           "A Differential Equation for Supply, Demand and Price of a Commodity"',
    [
        item(
            "mp_yvFr5D7UAMQ_1",
            r"In a simple market model, the rate of change of price is often taken proportional to what?",
            r"Price rises when buyers want more than sellers offer and falls in the opposite case.",
            [
                C(r"The excess demand, the difference between demand and supply", r"Yes. Price adjusts in proportion to excess demand, rising when demand exceeds supply."),
                W(r"The total supply alone", r"Supply by itself does not set the direction of price change. What difference drives it?"),
                W(r"The price squared", r"The model uses the supply-demand gap, not the price squared. What quantity is the rate proportional to?"),
                W(r"A fixed constant only", r"A constant rate ignores the market. What difference does the price respond to?"),
            ],
        ),
        item(
            "mp_yvFr5D7UAMQ_2",
            r"Writing $\frac{dp}{dt} = k(D - S)$ with $k > 0$, what happens when demand $D$ exceeds supply $S$?",
            r"A positive excess demand makes the right side positive.",
            [
                C(r"The price increases", r"Yes. With $D > S$, the right side is positive, so the price rises."),
                W(r"The price decreases", r"A positive excess demand gives a positive rate. Which direction does the price move?"),
                W(r"The price stays constant", r"The rate is nonzero when $D \neq S$. What does a positive rate do to price?"),
                W(r"The price oscillates forever", r"A single sign of the rate does not create oscillation. What does $D > S$ do to price?"),
            ],
        ),
        item(
            "mp_yvFr5D7UAMQ_3",
            r"The equilibrium price in this model occurs where which condition holds?",
            r"At equilibrium the price stops changing, so the rate is zero.",
            [
                C(r"Demand equals supply, so $\frac{dp}{dt} = 0$", r"Yes. When demand equals supply the rate vanishes and the price holds steady."),
                W(r"Demand is maximized", r"Maximum demand is not the equilibrium condition. What balance makes the rate zero?"),
                W(r"Supply is zero", r"Zero supply is not equilibrium. What equality of demand and supply stops price change?"),
                W(r"Price is zero", r"Equilibrium price is generally nonzero. What condition makes $\frac{dp}{dt} = 0$?"),
            ],
        ),
        item(
            "mp_yvFr5D7UAMQ_4",
            r"Suppose demand is $D = 100 - 2p$ and supply is $S = 20 + 3p$. What is the equilibrium price?",
            r"Set $D = S$ and solve $100 - 2p = 20 + 3p$ for $p$.",
            [
                C(r"$p = 16$", r"Correct. $100 - 2p = 20 + 3p$ gives $80 = 5p$, so $p = 16$."),
                W(r"$p = 20$", r"Recheck the algebra. After combining, $80 = 5p$; what is $p$?"),
                W(r"$p = 24$", r"Move all $p$ terms to one side carefully. What does $80 = 5p$ give?"),
                W(r"$p = 80$", r"You stopped before dividing by the coefficient of $p$. What is $80 / 5$?"),
            ],
        ),
        item(
            "mp_yvFr5D7UAMQ_5",
            r"If the equilibrium price is stable, a small displacement of price will do what over time?",
            r"Stability means the adjustment pushes price back toward the balance point.",
            [
                C(r"Return toward the equilibrium price", r"Yes. A stable equilibrium draws nearby prices back toward it over time."),
                W(r"Move away from the equilibrium price", r"That describes instability. What does a stable equilibrium do to nearby prices?"),
                W(r"Stay displaced permanently", r"A stable adjustment does not leave price stuck off balance. Where does it head?"),
                W(r"Jump to zero", r"Stability does not send price to zero. Toward what value does it return?"),
            ],
        ),
    ],
)

# === 8.5 video 1 ============================================================
add_micro(
    "Tc05IbqTsFM",
    'Unit 8, Module 8.5, video 1\n           "Predator-Prey Model (Lotka-Volterra)"',
    [
        item(
            "mp_Tc05IbqTsFM_1",
            r"In the Lotka-Volterra model with prey $x$ and predator $y$, the prey equation $\frac{dx}{dt} = ax - bxy$ says the prey population does what without predators?",
            r"Set $y = 0$ and read the remaining growth term.",
            [
                C(r"Grows exponentially at rate $a$", r"Yes. With $y = 0$, the equation reduces to $\frac{dx}{dt} = ax$, exponential growth."),
                W(r"Decays exponentially", r"The remaining term $ax$ has a positive coefficient. Does the prey grow or shrink without predators?"),
                W(r"Stays constant", r"The term $ax$ is nonzero for positive $x$. What kind of change does it produce?"),
                W(r"Oscillates on its own", r"A single linear term gives no oscillation. What behavior does $\frac{dx}{dt} = ax$ describe?"),
            ],
        ),
        item(
            "mp_Tc05IbqTsFM_2",
            r"In the predator equation $\frac{dy}{dt} = -cy + dxy$, what happens to predators when prey are absent?",
            r"Set $x = 0$ and read the remaining term.",
            [
                C(r"They decline exponentially at rate $c$", r"Yes. With $x = 0$, the equation becomes $\frac{dy}{dt} = -cy$, exponential decline."),
                W(r"They grow exponentially", r"The remaining term $-cy$ is negative. Do predators rise or fall without prey?"),
                W(r"They stay constant", r"The term $-cy$ is nonzero for positive $y$. What change does it cause?"),
                W(r"They double instantly", r"The decay is gradual and negative. What does $\frac{dy}{dt} = -cy$ describe?"),
            ],
        ),
        item(
            "mp_Tc05IbqTsFM_3",
            r"The interaction term $bxy$ in the prey equation represents what?",
            r"It models how often predators and prey meet, which scales with both populations.",
            [
                C(r"Loss of prey due to predation, proportional to encounters between the two species", r"Yes. The product $xy$ measures encounters, and $b$ scales the prey lost to predation."),
                W(r"Growth of prey from reproduction", r"Reproduction is the $ax$ term. What does the $xy$ product with a minus sign represent?"),
                W(r"Immigration of new prey", r"Immigration is not in this term. What does the predator-prey encounter product capture?"),
                W(r"Random noise", r"The model is deterministic. What biological effect does $bxy$ model?"),
            ],
        ),
        item(
            "mp_Tc05IbqTsFM_4",
            r"The nonzero coexistence equilibrium of the Lotka-Volterra system occurs at which point?",
            r"Set both rates to zero and solve, factoring out the nonzero populations.",
            [
                C(r"$x = \frac{c}{d}$ and $y = \frac{a}{b}$", r"Yes. Setting $ax - bxy = 0$ and $-cy + dxy = 0$ gives $x = c/d$ and $y = a/b$."),
                W(r"$x = \frac{a}{b}$ and $y = \frac{c}{d}$", r"The equilibrium values are swapped. Which equation determines $x$, and which determines $y$?"),
                W(r"$x = 0$ and $y = 0$", r"That is the trivial extinction equilibrium, not the coexistence one. What positive values solve the equations?"),
                W(r"$x = a$ and $y = c$", r"The ratios of parameters matter, not the bare constants. What are $x$ and $y$ at coexistence?"),
            ],
        ),
        item(
            "mp_Tc05IbqTsFM_5",
            r"Solution trajectories of the Lotka-Volterra model in the phase plane typically form what?",
            r"The populations rise and fall in a repeating chase without settling down.",
            [
                C(r"Closed cycles, indicating periodic oscillations of both populations", r"Yes. The trajectories are closed loops, so predator and prey numbers oscillate periodically."),
                W(r"Curves spiraling into the equilibrium", r"The classic model does not damp to the equilibrium. What closed shape do the orbits form?"),
                W(r"Straight lines to extinction", r"The populations cycle rather than die out. What closed curves appear?"),
                W(r"A single fixed point only", r"Generic trajectories move around, not stay put. What repeating shape do they trace?"),
            ],
        ),
    ],
)

# === 8.5 video 2 ============================================================
add_micro(
    "QXLmsKKr1Zs",
    'Unit 8, Module 8.5, video 2\n           "Predator-Prey Interactions, Episode 1: Understanding the Lotka-Volterra Equations"',
    [
        item(
            "mp_QXLmsKKr1Zs_1",
            r"The Lotka-Volterra model is a system of how many coupled differential equations?",
            r"There is one equation for each interacting population.",
            [
                C(r"Two, one for the prey and one for the predator", r"Yes. The model couples two equations, one per population."),
                W(r"One equation only", r"A single equation cannot track two interacting species. How many are coupled?"),
                W(r"Three equations", r"The basic model has one equation per species, and there are two species. How many is that?"),
                W(r"Four equations", r"The classic two-species model uses fewer. How many equations does it have?"),
            ],
        ),
        item(
            "mp_QXLmsKKr1Zs_2",
            r"Why are the two Lotka-Volterra equations described as coupled?",
            r"Each population's rate of change involves the other population.",
            [
                C(r"Each equation contains the other species through the interaction term $xy$", r"Yes. The shared $xy$ term ties the two equations together, making them coupled."),
                W(r"They are written on the same page", r"Coupling is mathematical, not typographical. What links the two equations?"),
                W(r"They have the same constant $a$", r"Sharing a constant is not what coupling means. What variable links them?"),
                W(r"They are actually independent", r"They are not independent; each affects the other. What term couples them?"),
            ],
        ),
        item(
            "mp_QXLmsKKr1Zs_3",
            r"In the predator-prey cycle, a rise in prey is typically followed by what?",
            r"More prey means more food, so predators respond after a lag.",
            [
                C(r"A rise in predators, as more food becomes available", r"Yes. Abundant prey fuels predator growth, which lags behind the prey peak."),
                W(r"An immediate crash of prey to zero", r"Prey do not vanish instantly. What does abundant prey do to predators next?"),
                W(r"A permanent drop in predators", r"Predators rise, not fall, when prey are plentiful. What follows a prey rise?"),
                W(r"No change in predators ever", r"Predators respond to prey abundance. What change follows a prey increase?"),
            ],
        ),
        item(
            "mp_QXLmsKKr1Zs_4",
            r"After predators become abundant, the prey population typically does what?",
            r"Heavy predation outpaces prey reproduction.",
            [
                C(r"Declines, since predation now exceeds prey reproduction", r"Yes. Abundant predators drive the prey down, completing part of the cycle."),
                W(r"Continues to grow without limit", r"Heavy predation checks prey growth. What does the prey population do?"),
                W(r"Stays exactly constant", r"The cycle keeps moving. What happens to prey under abundant predators?"),
                W(r"Instantly recovers", r"Recovery comes later, after predators decline. What happens to prey first?"),
            ],
        ),
        item(
            "mp_QXLmsKKr1Zs_5",
            r"A key simplifying assumption of the basic Lotka-Volterra model is what?",
            r"The prey have unlimited resources in the absence of predators.",
            [
                C(r"Prey grow without any resource limit when predators are absent", r"Yes. The basic model assumes unbounded prey growth without predators, ignoring carrying capacity."),
                W(r"Predators never die", r"Predators do decline without prey in the model. What unrealistic prey assumption is made?"),
                W(r"The populations are always equal", r"The populations differ and cycle. What assumption about prey growth is built in?"),
                W(r"There is no interaction term", r"The interaction term is central to the model. What simplification about prey growth is assumed?"),
            ],
        ),
    ],
)

# === 8.6 video 1 ============================================================
add_micro(
    "8GxwFrAyD9Q",
    'Unit 8, Module 8.6, video 1\n           "Competition Explained by Lotka-Volterra Model"',
    [
        item(
            "mp_8GxwFrAyD9Q_1",
            r"In a competition model, the interaction term between two species has which effect on each population?",
            r"Competitors reduce one another's growth rather than feed on one another.",
            [
                C(r"It is negative for both species, since each suppresses the other's growth", r"Yes. In competition each species lowers the other's growth, so both interaction effects are negative."),
                W(r"It helps one and harms the other", r"That asymmetry describes predation, not competition. How does competition affect both species?"),
                W(r"It helps both species", r"Mutual benefit is cooperation, not competition. What sign do the competitive effects carry?"),
                W(r"It has no effect on either", r"Competition does affect growth. What sign does its effect take for each species?"),
            ],
        ),
        item(
            "mp_8GxwFrAyD9Q_2",
            r"Competition models extend the logistic equation by adding what?",
            r"Each species already limits itself; competition adds a term for the other species.",
            [
                C(r"A term for the suppressing effect of the competing species", r"Yes. Beyond self-limitation, a cross term captures the rival species' suppressing effect."),
                W(r"A predation term that feeds one species", r"Competition is not predation; no species gains nourishment. What term is added instead?"),
                W(r"A constant immigration rate", r"Immigration is not the competitive addition. What cross-species term appears?"),
                W(r"Nothing beyond the logistic term", r"Competition requires a cross term. What does it add to the logistic model?"),
            ],
        ),
        item(
            "mp_8GxwFrAyD9Q_3",
            r"The principle of competitive exclusion states what?",
            r"Two species filling the exact same niche cannot both persist indefinitely.",
            [
                C(r"Two species competing for the identical limiting resource cannot coexist indefinitely; one is excluded", r"Yes. Competitive exclusion says identical competitors cannot coexist forever, and one wins out."),
                W(r"Competing species always coexist peacefully", r"Identical competitors typically cannot both persist. What does exclusion predict instead?"),
                W(r"Both species always go extinct", r"Exclusion removes one, not necessarily both. What is the usual outcome?"),
                W(r"Competition has no long-term effect", r"It strongly shapes long-term outcomes. What does the exclusion principle assert?"),
            ],
        ),
        item(
            "mp_8GxwFrAyD9Q_4",
            r"Whether two competing species can coexist generally depends on what?",
            r"Coexistence requires each species to limit itself more than it limits its rival.",
            [
                C(r"The relative strengths of intraspecific versus interspecific competition", r"Yes. Coexistence is favored when self-limitation outweighs the cross-species competition."),
                W(r"Only the initial population sizes", r"Starting sizes do not by themselves decide the long-term outcome. What competition comparison does?"),
                W(r"The color of each species", r"Color is irrelevant. Which comparison of competition strengths matters?"),
                W(r"The time of day", r"Timing is not the factor. What balance of competition terms governs coexistence?"),
            ],
        ),
        item(
            "mp_8GxwFrAyD9Q_5",
            r"How does a competition model differ structurally from the predator-prey model?",
            r"Compare the signs of how each species affects the other.",
            [
                C(r"Both cross terms are negative in competition, whereas predator-prey has one positive and one negative", r"Yes. Competition harms both, while predation benefits the predator and harms the prey."),
                W(r"They are structurally identical", r"The signs of the interaction terms differ. How do the cross-term signs compare?"),
                W(r"Competition has only one equation", r"Both are two-species systems. What distinguishes their interaction signs?"),
                W(r"Predator-prey has no interaction term", r"Predator-prey is built on its interaction term. How do the two models' cross-term signs differ?"),
            ],
        ),
    ],
)

# === 8.6 video 2 ============================================================
add_micro(
    "obasfCufOr0",
    'Unit 8, Module 8.6, video 2\n           "Modelling Interspecific Competition"',
    [
        item(
            "mp_obasfCufOr0_1",
            r"Interspecific competition refers to competition between what?",
            r"The prefix inter means between, pointing to different species.",
            [
                C(r"Members of different species", r"Yes. Interspecific competition is competition between members of different species."),
                W(r"Members of the same species", r"That is intraspecific competition. What does the prefix inter indicate?"),
                W(r"Predators and their prey", r"That is predation, not competition. Between whom does interspecific competition occur?"),
                W(r"Cells within one organism", r"The term is ecological, between organisms. Which groups compete interspecifically?"),
            ],
        ),
        item(
            "mp_obasfCufOr0_2",
            r"In the competition equations, the coefficient on the cross term measures what?",
            r"It scales how strongly one species' presence suppresses the other's growth.",
            [
                C(r"The per-capita competitive effect of one species on the other", r"Yes. The cross coefficient measures how strongly each individual of one species suppresses the other's growth."),
                W(r"The reproduction rate of a single species", r"Self-reproduction is a different term. What does the cross coefficient quantify?"),
                W(r"The total area of the habitat", r"Area is not encoded in that coefficient. What competitive effect does it scale?"),
                W(r"The fluid viscosity", r"Viscosity is unrelated. What competitive influence does the cross term measure?"),
            ],
        ),
        item(
            "mp_obasfCufOr0_3",
            r"A phase-plane analysis of the competition model uses which curves to locate equilibria?",
            r"Equilibria sit where each species' rate of change is zero.",
            [
                C(r"The nullclines, where each species' growth rate is zero", r"Yes. Equilibria occur at intersections of the nullclines, where both growth rates vanish."),
                W(r"The streamlines of a fluid", r"Streamlines belong to fluid flow, not this model. What zero-growth curves are used?"),
                W(r"The level curves of viscosity", r"Viscosity is unrelated here. What curves mark zero growth?"),
                W(r"The contour lines of temperature", r"Temperature is not in the model. What curves locate the equilibria?"),
            ],
        ),
        item(
            "mp_obasfCufOr0_4",
            r"One possible long-term outcome of interspecific competition is which of these?",
            r"Strong competition can drive one species out entirely.",
            [
                C(r"Competitive exclusion, where one species drives the other to extinction", r"Yes. Strong interspecific competition can lead to exclusion of one species."),
                W(r"Both species growing without bound", r"Resource limits prevent unbounded growth. What exclusion outcome is possible?"),
                W(r"The species merging into one", r"Species do not merge in this model. What is a realistic competitive outcome?"),
                W(r"No change ever occurring", r"Competition does change populations. What long-term outcome can result?"),
            ],
        ),
        item(
            "mp_obasfCufOr0_5",
            r"Stable coexistence of two competitors corresponds to which feature in the phase plane?",
            r"It is an interior equilibrium that nearby trajectories approach.",
            [
                C(r"A stable interior equilibrium with both populations positive", r"Yes. Stable coexistence is a stable equilibrium with both species present at positive levels."),
                W(r"An equilibrium on an axis with one species at zero", r"An axis equilibrium means one species is absent, which is exclusion. What interior point gives coexistence?"),
                W(r"A trajectory escaping to infinity", r"Unbounded escape is not coexistence. What stable point represents it?"),
                W(r"The origin", r"The origin means both species are extinct. What positive interior point gives coexistence?"),
            ],
        ),
    ],
)

# === 8.7 video 1 ============================================================
add_micro(
    "4K8-PAX0VYQ",
    'Unit 8, Module 8.7, video 1\n           "Solving 8 Differential Equations using 8 methods"',
    [
        item(
            "mp_4K8-PAX0VYQ_1",
            r"Which method is the natural first choice for $\frac{dy}{dx} = \frac{g(x)}{h(y)}$, where the variables separate cleanly?",
            r"If you can put all the $y$ on one side and all the $x$ on the other, one technique applies directly.",
            [
                C(r"Separation of variables", r"Yes. When the equation factors into an $x$ part and a $y$ part, you separate and integrate."),
                W(r"Integrating factor for linear equations", r"That is for first-order linear form. Which method fits a cleanly separable equation?"),
                W(r"Exact equation potential method", r"That targets total-differential form. What simpler method handles separable equations?"),
                W(r"Laplace transform", r"Transforms are heavier machinery. What direct method suits a separable equation?"),
            ],
        ),
        item(
            "mp_4K8-PAX0VYQ_2",
            r"For a first-order linear equation $y' + P(x)y = Q(x)$, which method applies?",
            r"You multiply by a factor that turns the left side into a single derivative.",
            [
                C(r"Multiply by the integrating factor $\mu(x) = e^{\int P\,dx}$", r"Yes. The integrating factor makes the left side the derivative of $\mu y$."),
                W(r"Separation of variables", r"The mixed $P(x)y$ and $Q(x)$ terms block clean separation. What factor linearizes the left side into a derivative?"),
                W(r"The Clairaut substitution", r"Clairaut form is different. What standard factor solves the linear first-order equation?"),
                W(r"Partial fractions only", r"Partial fractions is a sub-step at most. What method handles the full linear equation?"),
            ],
        ),
        item(
            "mp_4K8-PAX0VYQ_3",
            r"A Bernoulli equation $y' + P(x)y = Q(x)y^n$ is solved by which substitution?",
            r"You introduce a new variable that turns the nonlinear equation into a linear one.",
            [
                C(r"$v = y^{1-n}$, which linearizes the equation", r"Yes. The substitution $v = y^{1-n}$ converts the Bernoulli equation into a linear one in $v$."),
                W(r"$v = y^n$", r"That exponent does not linearize it. What power of $y$ produces a linear equation?"),
                W(r"$v = e^y$", r"An exponential substitution does not apply here. What power substitution works for Bernoulli?"),
                W(r"$v = \ln y$", r"A logarithm is not the Bernoulli substitution. What power of $y$ linearizes it?"),
            ],
        ),
        item(
            "mp_4K8-PAX0VYQ_4",
            r"For $M\,dx + N\,dy = 0$ with $M_y = N_x$, which method should you reach for?",
            r"The matching cross partials signal a total differential.",
            [
                C(r"The exact-equation method, finding a potential $F$ with $F = C$", r"Yes. Matching cross partials means the form is exact, so you reconstruct the potential."),
                W(r"Separation of variables", r"The equation may not separate. What does $M_y = N_x$ specifically indicate?"),
                W(r"The Bernoulli substitution", r"Bernoulli targets a different form. What method fits a form with equal cross partials?"),
                W(r"An eigenvalue computation", r"Eigenvalues are for linear systems. What first-order method does exactness call for?"),
            ],
        ),
        item(
            "mp_4K8-PAX0VYQ_5",
            r"Why is it valuable to recognize the type of a differential equation before solving?",
            r"Each form has a tailored technique that avoids wasted effort.",
            [
                C(r"The form points to the most efficient matching method, saving effort", r"Yes. Identifying the type directs you to the technique built for it."),
                W(r"All equations use the same method anyway", r"Different forms need different methods. Why does identifying the type help?"),
                W(r"Classification changes the solution's value", r"The solution is what it is; classification guides the route, not the answer. Why classify first?"),
                W(r"It avoids the need to integrate", r"Integration is usually still required. What does classification actually streamline?"),
            ],
        ),
    ],
)

# === 8.7 video 2 ============================================================
add_micro(
    "0kY3Wpvutfs",
    'Unit 8, Module 8.7, video 2\n           "Physics Students Need to Know These 5 Methods for Differential Equations"',
    [
        item(
            "mp_0kY3Wpvutfs_1",
            r"For a constant-coefficient linear homogeneous equation, the standard approach is to try which trial solution?",
            r"An exponential reproduces itself under differentiation, turning the equation into algebra.",
            [
                C(r"$y = e^{rx}$, leading to a characteristic equation in $r$", r"Yes. Substituting $e^{rx}$ converts the differential equation into an algebraic characteristic equation."),
                W(r"$y = x^n$ for integer $n$", r"Power trials suit equidimensional equations, not constant-coefficient ones. What trial reproduces itself under differentiation?"),
                W(r"$y = \sin x$ only", r"A single sine is too restrictive. What exponential trial yields a characteristic equation?"),
                W(r"$y = \ln x$", r"A logarithm does not fit this form. What exponential should you try?"),
            ],
        ),
        item(
            "mp_0kY3Wpvutfs_2",
            r"To handle a nonhomogeneous term, physicists often use which method to get a particular solution?",
            r"You guess a form resembling the forcing term and fix its coefficients.",
            [
                C(r"The method of undetermined coefficients", r"Yes. You guess a particular solution patterned on the forcing term and solve for its coefficients."),
                W(r"Separation of variables", r"Separation does not target the forced response of a linear equation. What guessing method does?"),
                W(r"The exactness test", r"Exactness applies to first-order forms, not forced linear equations. What method finds a particular solution?"),
                W(r"The tractrix construction", r"That is a specific geometry problem. What general method gives a particular solution?"),
            ],
        ),
        item(
            "mp_0kY3Wpvutfs_3",
            r"For problems with initial conditions and discontinuous or impulsive forcing, which tool is especially useful?",
            r"It turns differentiation into algebra and folds the initial conditions in directly.",
            [
                C(r"The Laplace transform", r"Yes. The Laplace transform handles impulsive forcing and builds in the initial conditions."),
                W(r"The integrating factor", r"That suits first-order linear equations, not impulsive forcing with initial data. What transform is built for it?"),
                W(r"Separation of variables", r"Separation does not manage impulses or initial-value bookkeeping well. What transform does?"),
                W(r"The Clairaut method", r"Clairaut form is unrelated. What transform tackles impulsive forcing?"),
            ],
        ),
        item(
            "mp_0kY3Wpvutfs_4",
            r"When an equation cannot be solved in closed form, what is a standard fallback for physicists?",
            r"You can still step the solution forward approximately on a computer.",
            [
                C(r"Numerical methods, such as Euler or Runge-Kutta", r"Yes. Numerical integration approximates the solution when no closed form exists."),
                W(r"Declaring the problem unsolvable", r"An approximate solution is still attainable. What computational approach applies?"),
                W(r"Ignoring the initial conditions", r"Initial conditions are needed to step forward. What numerical approach uses them?"),
                W(r"Switching to algebra only", r"Algebra alone cannot integrate the dynamics. What numerical methods step the solution forward?"),
            ],
        ),
        item(
            "mp_0kY3Wpvutfs_5",
            r"Why do physicists value having several solution methods rather than one?",
            r"Different equations and forcing types yield to different techniques.",
            [
                C(r"Different equation forms and forcing types are best handled by different matching methods", r"Yes. A toolkit lets you match each problem to the technique suited to it."),
                W(r"One method always works for everything", r"No single method covers all forms. Why keep several?"),
                W(r"More methods make the answers different", r"The solution is unique regardless of method; the route differs. Why have several routes?"),
                W(r"It avoids ever needing calculus", r"Calculus remains central. Why is a variety of methods useful?"),
            ],
        ),
    ],
)


# ============================================================================
# UNIT 7 MASTERY (30 items)
# ============================================================================

MASTERY_7.extend([
    # --- Exactness test (7.1) ---
    item(
        "um_7_1",
        r"The differential equation $M\,dx + N\,dy = 0$ is exact precisely when which equation holds?",
        r"Compare the cross partials of the two coefficients.",
        [
            C(r"$M_y = N_x$", r"Yes. Equal cross partials make the form a total differential."),
            W(r"$M_x = N_y$", r"Those are the straight partials. Which cross partials must match?"),
            W(r"$M = N$", r"The coefficients need not be equal. Which derivatives must agree?"),
            W(r"$M_x = N_x$", r"Both are $x$ partials of different functions, not the exactness test. Which mixed partials must match?"),
        ],
    ),
    item(
        "um_7_2",
        r"Is $(3x^2 + y)\,dx + (x - 2y)\,dy = 0$ exact?",
        r"Compute $M_y$ for $M = 3x^2 + y$ and $N_x$ for $N = x - 2y$.",
        [
            C(r"Yes, since $M_y = 1 = N_x$", r"Correct. Both cross partials equal $1$, so the equation is exact."),
            W(r"No, since $M_y \neq N_x$", r"Recompute. What is $\frac{\partial}{\partial y}(3x^2 + y)$ and $\frac{\partial}{\partial x}(x - 2y)$?"),
            W(r"Yes, since both contain $x$", r"Shared variables do not decide exactness. What do the cross partials equal?"),
            W(r"Cannot be determined", r"The cross partials settle it. What are $M_y$ and $N_x$?"),
        ],
    ),
    item(
        "um_7_3",
        r"For $M = 2xy^3$, what is $M_y$?",
        r"Differentiate $2xy^3$ with respect to $y$, treating $x$ as constant.",
        [
            C(r"$6xy^2$", r"Correct. The power rule on $y^3$ gives $3y^2$, times $2x$."),
            W(r"$2y^3$", r"That is $M_x$, the $x$ partial. What is the $y$ partial?"),
            W(r"$6x y^3$", r"The exponent on $y$ should drop by one after differentiating. What is $\frac{\partial}{\partial y}(y^3)$?"),
            W(r"$2xy^2$", r"You dropped the factor from the exponent. What does the power rule contribute?"),
        ],
    ),
    item(
        "um_7_4",
        r"For $N = x^2 \cos y$, what is $N_x$?",
        r"Differentiate $x^2 \cos y$ with respect to $x$, treating $y$ as constant.",
        [
            C(r"$2x \cos y$", r"Correct. The factor $\cos y$ is constant in $x$, and $\frac{\partial}{\partial x}(x^2) = 2x$."),
            W(r"$-x^2 \sin y$", r"That is the $y$ partial. What is the $x$ partial?"),
            W(r"$2x \sin y$", r"Differentiating in $x$ leaves $\cos y$ untouched, not turned into $\sin y$. What is $N_x$?"),
            W(r"$x^2 \cos y$", r"You did not differentiate. What is $\frac{\partial}{\partial x}(x^2 \cos y)$?"),
        ],
    ),
    item(
        "um_7_5",
        r"Which differential form is exact?",
        r"Test $M_y = N_x$ for each candidate.",
        [
            C(r"$y\,dx + x\,dy$", r"Correct. Here $M_y = 1 = N_x$, so it is exact, with potential $xy$."),
            W(r"$y\,dx - x\,dy$", r"Check the signs: $M_y = 1$ but $N_x = -1$. Do they match?"),
            W(r"$2y\,dx + x\,dy$", r"Compute $M_y = 2$ and $N_x = 1$. Are they equal?"),
            W(r"$x\,dx + y^2\,dy$ with a cross check failing", r"Reconsider which option has matching cross partials. Which one gives $M_y = N_x$?"),
        ],
    ),
    # --- Building potentials and solving (7.1, 7.3) ---
    item(
        "um_7_6",
        r"To solve an exact equation, after integrating $M$ in $x$ you obtain $F = \int M\,dx + g(y)$. What determines $g(y)$?",
        r"Differentiate this $F$ in $y$ and match it to $N$.",
        [
            C(r"Setting $F_y = N$ and solving for $g'(y)$, then integrating", r"Yes. Matching $F_y$ to $N$ isolates $g'(y)$, which you integrate to get $g(y)$."),
            W(r"Setting $g(y) = N$", r"$N$ equals $F_y$, not $g$ itself. What equation involving $g'(y)$ should you form?"),
            W(r"Setting $F_x = N$", r"You already used $F_x = M$. Which partial should you now match to $N$?"),
            W(r"Differentiating $N$ in $x$", r"That checks exactness, it does not find $g$. What condition pins down $g'(y)$?"),
        ],
    ),
    item(
        "um_7_7",
        r"Solve the exact equation $(2x + y)\,dx + (x + 2y)\,dy = 0$.",
        r"Integrate $M$ in $x$, then match $F_y$ to $N$.",
        [
            C(r"$x^2 + xy + y^2 = C$", r"Correct. The potential is $x^2 + xy + y^2$, held constant."),
            W(r"$x^2 + 2xy + y^2 = C$", r"Recheck the cross term from integrating $M$. What is the coefficient of $xy$?"),
            W(r"$x^2 + y^2 = C$", r"You dropped the mixed term. Which cross term comes from $M$ and $N$?"),
            W(r"$2x + 2y = C$", r"That differentiates rather than integrates. What is $\int (2x + y)\,dx$?"),
        ],
    ),
    item(
        "um_7_8",
        r"A potential for the exact form $y\,dx + x\,dy$ is which function?",
        r"Find $F$ with $F_x = y$ and $F_y = x$.",
        [
            C(r"$F = xy$", r"Correct. Its partials are $F_x = y$ and $F_y = x$."),
            W(r"$F = x + y$", r"Its partials are both $1$, not $y$ and $x$. What product has those partials?"),
            W(r"$F = \frac{x^2 + y^2}{2}$", r"Its partials are $x$ and $y$, but paired the wrong way. What gives $F_x = y$?"),
            W(r"$F = x^2 y^2$", r"Its partials are far too large. What simple product yields $F_x = y$?"),
        ],
    ),
    item(
        "um_7_9",
        r"Solve $(\cos y)\,dx + (-x \sin y)\,dy = 0$ as an exact equation.",
        r"Check exactness, then integrate $M = \cos y$ in $x$.",
        [
            C(r"$x \cos y = C$", r"Correct. With $F = x \cos y$, the partials are $\cos y$ and $-x \sin y$."),
            W(r"$x \sin y = C$", r"Differentiate $x \sin y$ in $x$: you get $\sin y$, not $\cos y$. What potential gives $\cos y$?"),
            W(r"$\cos y = C$", r"That omits the $x$ from integrating $M$ in $x$. What is $\int \cos y\,dx$?"),
            W(r"$-x \sin y = C$", r"That is $N$, not the potential. What function $F$ has $F_x = \cos y$?"),
        ],
    ),
    item(
        "um_7_10",
        r"The implicit solution $F(x, y) = C$ of an exact equation represents what geometrically?",
        r"The solutions are the curves on which the potential stays fixed.",
        [
            C(r"The level curves of the potential $F$", r"Yes. Each solution is a level curve where $F$ is constant."),
            W(r"The gradient field of $F$", r"The gradient is perpendicular to the solutions, not the solutions themselves. What curves are they?"),
            W(r"The critical points of $F$", r"Solutions are curves, not isolated points. What level sets do they form?"),
            W(r"The tangent planes to $F$", r"Planes are not the solution curves. What constant-value curves are they?"),
        ],
    ),
    # --- Non-exact and integrating factors (7.4) ---
    item(
        "um_7_11",
        r"When $M\,dx + N\,dy = 0$ is not exact, the goal of an integrating factor $\mu$ is to make which form exact?",
        r"You multiply both coefficients by $\mu$ and re-test.",
        [
            C(r"$\mu M\,dx + \mu N\,dy = 0$", r"Yes. The factor multiplies both coefficients, and exactness is tested on the products."),
            W(r"$M\,dx + \mu N\,dy = 0$", r"Only one coefficient is multiplied here. What must $\mu$ multiply?"),
            W(r"$\mu(M + N) = 0$", r"The factor distributes across the differential form, not a bare sum. What is the rescaled form?"),
            W(r"$M_y\,dx + N_x\,dy = 0$", r"That replaces coefficients with their partials. What form does $\mu$ actually produce?"),
        ],
    ),
    item(
        "um_7_12",
        r"If $\frac{M_y - N_x}{N}$ is a function of $x$ alone, the integrating factor is which expression?",
        r"Integrate that ratio in $x$ and exponentiate.",
        [
            C(r"$\mu(x) = \exp\left(\int \frac{M_y - N_x}{N}\,dx\right)$", r"Yes. This exponential of the integral restores exactness when the ratio is $x$-only."),
            W(r"$\mu(x) = \frac{M_y - N_x}{N}$", r"That is the ratio, not the factor. What two operations build $\mu$?"),
            W(r"$\mu(y) = \exp\left(\int \frac{M_y - N_x}{N}\,dy\right)$", r"An $x$-only ratio gives an $x$-only factor. Over which variable do you integrate?"),
            W(r"$\mu(x) = \ln\left(\frac{M_y - N_x}{N}\right)$", r"The factor uses an exponential, not a logarithm. What is the correct form?"),
        ],
    ),
    item(
        "um_7_13",
        r"For $(y)\,dx + (2x)\,dy = 0$, the ratio $\frac{N_x - M_y}{M}$ equals what?",
        r"Use $M_y = 1$, $N_x = 2$, and $M = y$.",
        [
            C(r"$\frac{1}{y}$", r"Correct. $\frac{2 - 1}{y} = \frac{1}{y}$, a function of $y$ alone."),
            W(r"$\frac{1}{x}$", r"The denominator here is $M = y$. What is $\frac{N_x - M_y}{M}$?"),
            W(r"$\frac{1}{2x}$", r"That uses $N$ in the denominator, the other test. What does dividing by $M = y$ give?"),
            W(r"$-\frac{1}{y}$", r"Check the sign: $N_x - M_y = 2 - 1 = 1$, positive. What is the ratio?"),
        ],
    ),
    item(
        "um_7_14",
        r"Using $\frac{N_x - M_y}{M} = \frac{1}{y}$, the integrating factor for $(y)\,dx + (2x)\,dy = 0$ is what?",
        r"Integrate $\frac{1}{y}$ in $y$ and exponentiate.",
        [
            C(r"$\mu(y) = y$", r"Correct. $\exp(\ln y) = y$."),
            W(r"$\mu(y) = \frac{1}{y}$", r"That is the ratio, not the factor. What does exponentiating the integral give?"),
            W(r"$\mu(y) = \ln y$", r"That is the integral before exponentiating. What is $\exp(\ln y)$?"),
            W(r"$\mu(y) = e^y$", r"The integral is $\ln y$, not $y$. What is $\exp(\ln y)$?"),
        ],
    ),
    item(
        "um_7_15",
        r"After multiplying $(y)\,dx + (2x)\,dy = 0$ by $\mu(y) = y$, the exact equation and its solution are what?",
        r"Distribute $y$, then find the potential of $(y^2)\,dx + (2xy)\,dy = 0$.",
        [
            C(r"$x y^2 = C$", r"Correct. The exact form $(y^2)\,dx + (2xy)\,dy = 0$ has potential $x y^2$."),
            W(r"$xy = C$", r"That omits the squared factor introduced by $\mu = y$. What is the potential after multiplying?"),
            W(r"$2xy = C$", r"That is the second coefficient, not the potential. What function has $F_x = y^2$?"),
            W(r"$y^2 = C$", r"You dropped the $x$ from integrating $y^2$ in $x$. What is $\int y^2\,dx$?"),
        ],
    ),
    # --- Almost exact (7.5) ---
    item(
        "um_7_16",
        r"An almost exact equation is best described as one that is what?",
        r"It misses exactness by exactly one integrating factor.",
        [
            C(r"Not exact as written, but exact after multiplying by a suitable integrating factor", r"Yes. A single integrating factor turns an almost exact equation into an exact one."),
            W(r"Already exact with no changes", r"Then it would not be called almost exact. What small repair does it need?"),
            W(r"Impossible to make exact", r"An almost exact equation can be exactified. What makes it exact?"),
            W(r"Exact only after differentiating", r"Differentiation is not the repair. What multiplication restores exactness?"),
        ],
    ),
    item(
        "um_7_17",
        r"For $(3xy + y^2)\,dx + (x^2 + xy)\,dy = 0$, the quantity $M_y - N_x$ equals what?",
        r"Compute $M_y = 3x + 2y$ and $N_x = 2x + y$, then subtract.",
        [
            C(r"$x + y$", r"Correct. $(3x + 2y) - (2x + y) = x + y$."),
            W(r"$5x + 3y$", r"That added the partials. What is $M_y - N_x$?"),
            W(r"$x - y$", r"Recheck the $y$ terms: $2y - y = y$. What is the full difference?"),
            W(r"$0$", r"The equation is not exact here. What nonzero expression results?"),
        ],
    ),
    item(
        "um_7_18",
        r"For that same equation, $\frac{M_y - N_x}{N}$ reduces to which $x$-only function?",
        r"Factor $N = x^2 + xy = x(x + y)$ and cancel with the numerator $x + y$.",
        [
            C(r"$\frac{1}{x}$", r"Correct. $\frac{x + y}{x(x + y)} = \frac{1}{x}$."),
            W(r"$\frac{1}{y}$", r"The surviving factor is $x$, not $y$. What remains after cancellation?"),
            W(r"$x + y$", r"You skipped the cancellation with $N$. What is $\frac{x+y}{x(x+y)}$?"),
            W(r"$\frac{1}{x + y}$", r"Both $x + y$ factors cancel. What single term is left?"),
        ],
    ),
    item(
        "um_7_19",
        r"With integrating factor $\mu(x) = x$, the equation $(3xy + y^2)\,dx + (x^2 + xy)\,dy = 0$ has which solution?",
        r"Multiply by $x$, then find the potential of the resulting exact equation.",
        [
            C(r"$x^3 y + \frac{x^2 y^2}{2} = C$", r"Correct. The exact form integrates to this potential."),
            W(r"$x^3 y + x^2 y^2 = C$", r"Recheck the coefficient on the second term from integration. What factor of one half appears?"),
            W(r"$3xy + y^2 = C$", r"That is the original $M$, not the potential after exactifying. What does integrating the rescaled $M$ give?"),
            W(r"$x^2 y + xy^2 = C$", r"The powers are too low; you must include the factor $x$. What is the rescaled potential?"),
        ],
    ),
    item(
        "um_7_20",
        r"Why must an integrating factor be nonzero on the region where you apply it?",
        r"Multiplying by zero would change which curves satisfy the equation.",
        [
            C(r"A zero of the factor can add or remove solutions, breaking the equivalence", r"Yes. Solution equivalence holds only where the factor stays nonzero."),
            W(r"A zero makes the equation linear", r"Linearity is unrelated. What does a vanishing factor risk doing to solutions?"),
            W(r"A zero speeds the integration", r"Vanishing is a hazard, not a help. What can it do to the solution set?"),
            W(r"It never matters", r"Zeros of the factor do matter. How can they distort solutions?"),
        ],
    ),
    # --- Conservative fields (7.6) ---
    item(
        "um_7_21",
        r"An exact equation corresponds to which type of vector field $(M, N)$?",
        r"Exactness means the pair is a gradient.",
        [
            C(r"A conservative field, the gradient of a potential", r"Yes. Exactness says $(M, N) = \nabla F$."),
            W(r"A rotational field", r"Conservative fields have no rotation. What gradient structure does exactness give?"),
            W(r"A divergence-free field", r"That is a different condition. What kind of field is $(M, N)$ when exact?"),
            W(r"A random field", r"There is nothing random here. What structured field does exactness produce?"),
        ],
    ),
    item(
        "um_7_22",
        r"For a conservative field, the line integral around a closed loop equals what?",
        r"On a closed loop the start and end points coincide.",
        [
            C(r"Zero", r"Yes. The potential difference vanishes when the endpoints coincide."),
            W(r"The enclosed area", r"Area is a different quantity. What is the value when start equals end?"),
            W(r"A nonzero circulation", r"Conservative fields have zero circulation. Why must the loop integral vanish?"),
            W(r"The loop's length", r"Length does not enter. What is the closed-loop value?"),
        ],
    ),
    item(
        "um_7_23",
        r"Is $(M, N) = (2xy, x^2)$ conservative?",
        r"Compare $M_y$ with $N_x$.",
        [
            C(r"Yes, since $M_y = 2x = N_x$", r"Correct. The cross partials match, so the field is conservative."),
            W(r"No, since $M_y \neq N_x$", r"Recompute. What is $\frac{\partial}{\partial y}(2xy)$ and $\frac{\partial}{\partial x}(x^2)$?"),
            W(r"Yes, since $M = N$", r"The components are not equal, yet it can be conservative. Which partials decide it?"),
            W(r"Cannot be determined", r"The cross partials decide it. What are $M_y$ and $N_x$?"),
        ],
    ),
    item(
        "um_7_24",
        r"The line integral $\int_C \nabla f \cdot d\mathbf{r}$ from $(0, 0)$ to $(1, 2)$ with $f = x^2 + y^2$ equals what?",
        r"Apply $f(\text{end}) - f(\text{start})$.",
        [
            C(r"$5$", r"Correct. $f(1, 2) - f(0, 0) = 5 - 0 = 5$."),
            W(r"$0$", r"The endpoints differ. What is $f(1, 2) - f(0, 0)$?"),
            W(r"$3$", r"Recompute $f(1, 2) = 1 + 4$. What is that minus zero?"),
            W(r"$\sqrt{5}$", r"The potential is $x^2 + y^2$, not its root. What is the difference?"),
        ],
    ),
    item(
        "um_7_25",
        r"Why does the simply connected condition matter for the test $M_y = N_x$ to guarantee a potential?",
        r"Holes in the domain can block a single-valued global potential.",
        [
            C(r"On a domain with holes, matching cross partials may not produce a single-valued global potential", r"Yes. Simple connectivity rules out holes that would obstruct a global potential."),
            W(r"It forces the field to be constant", r"Connectivity does not force constancy. What does it ensure?"),
            W(r"It is never required", r"It genuinely matters on domains with holes. What can fail without it?"),
            W(r"It makes the partials equal", r"It does not create the equality; it lets the equality imply a potential. Why is that needed?"),
        ],
    ),
    # --- Thermodynamics (7.7) ---
    item(
        "um_7_26",
        r"A thermodynamic state function has which type of differential?",
        r"Its change depends only on the endpoints, not the path.",
        [
            C(r"An exact differential", r"Yes. State functions have exact, path-independent differentials."),
            W(r"An inexact differential", r"That marks a path-dependent process quantity. What kind of differential does a state function have?"),
            W(r"A zero differential always", r"State functions can change. What type of differential do they have?"),
            W(r"An undefined differential", r"State functions have well defined differentials. Which type?"),
        ],
    ),
    item(
        "um_7_27",
        r"Which thermodynamic quantity is a state function?",
        r"State functions describe the condition of the system, not the process.",
        [
            C(r"Internal energy $U$", r"Yes. Internal energy is a state function with exact differential $dU$."),
            W(r"Heat $Q$", r"Heat is path dependent. Which listed quantity depends only on the state?"),
            W(r"Work $W$", r"Work is path dependent. Which quantity is a state function?"),
            W(r"Heat absorbed along a given path", r"That is path dependent by definition. Which quantity is a state function?"),
        ],
    ),
    item(
        "um_7_28",
        r"The inexact heat differential $\delta Q$ can be made exact for a reversible process by multiplying by what?",
        r"Dividing heat by temperature produces the differential of entropy.",
        [
            C(r"The integrating factor $\frac{1}{T}$, giving $dS = \frac{\delta Q}{T}$", r"Yes. The factor $1/T$ turns $\delta Q$ into the exact differential of entropy."),
            W(r"A constant", r"A constant does not exactify it. What temperature-based factor does?"),
            W(r"The pressure $P$", r"Pressure is not the integrating factor for heat. What factor yields $dS$?"),
            W(r"The volume $V$", r"Volume is not the factor. What reciprocal quantity exactifies $\delta Q$?"),
        ],
    ),
    item(
        "um_7_29",
        r"The cyclic integral $\oint dU$ of internal energy around any closed thermodynamic cycle equals what?",
        r"After a full cycle the system returns to its starting state.",
        [
            C(r"Zero", r"Yes. Returning to the same state gives zero net change in a state function."),
            W(r"The net work done", r"Work over a cycle can be nonzero, but the state function change is not. What is $\oint dU$?"),
            W(r"The net heat added", r"Net heat need not vanish, but the internal energy change does. What is the cyclic integral?"),
            W(r"Always positive", r"A state function returns to its value. What is its net change over a cycle?"),
        ],
    ),
    item(
        "um_7_30",
        r"Why is the exact-differential framework the natural language for thermodynamic state functions?",
        r"Both describe a potential whose change depends only on endpoints.",
        [
            C(r"Both describe potentials whose changes are path independent, fixed only by the endpoints", r"Yes. State functions are potentials with exact, path-independent differentials, exactly as in exact equations."),
            W(r"Because thermodynamics avoids derivatives", r"It relies on derivatives heavily. What shared structure connects the two?"),
            W(r"Because all heat is exact", r"Heat is the inexact example. What property do state functions share with exact equations?"),
            W(r"Because every differential is exact", r"Many are inexact. What special property do state functions have in common with exact forms?"),
        ],
    ),
])


# ============================================================================
# UNIT 8 MASTERY (30 items)
# ============================================================================

MASTERY_8.extend([
    # --- Clairaut and singular solutions (8.1) ---
    item(
        "um_8_1",
        r"A Clairaut equation has which general form, with $p = \frac{dy}{dx}$?",
        r"The hallmark is $y$ alone equal to $x$ times its slope plus a function of the slope.",
        [
            C(r"$y = x p + f(p)$", r"Yes. This is the defining Clairaut structure."),
            W(r"$y = x + f(p)$", r"The slope must multiply $x$. What factor sits before $x$?"),
            W(r"$y = p^2 + f(x)$", r"The added function depends on $p$, and $x$ appears times $p$. What is the correct form?"),
            W(r"$y' = xy + f(y)$", r"That is not the Clairaut pattern. How does $y$ relate to $xp$ and $f(p)$?"),
        ],
    ),
    item(
        "um_8_2",
        r"The general solution of a Clairaut equation is obtained by replacing $p$ with what?",
        r"One factor of the differentiated equation gives constant slope.",
        [
            C(r"An arbitrary constant $c$, giving the line family $y = cx + f(c)$", r"Yes. The general solution is a one-parameter family of straight lines."),
            W(r"Zero", r"That gives a single line, not the family. What replaces $p$ to give all the lines?"),
            W(r"$x$", r"The slope is constant in the general solution, not $x$. What replaces $p$?"),
            W(r"$f(p)$", r"You replace the slope by a constant, not by $f$. What constant goes in?"),
        ],
    ),
    item(
        "um_8_3",
        r"For $y = xp + p^2$, the general solution is which family?",
        r"Replace $p$ by $c$ in $y = xp + f(p)$ with $f(p) = p^2$.",
        [
            C(r"$y = cx + c^2$", r"Correct. Substituting the constant slope $c$ gives this line family."),
            W(r"$y = cx - c^2$", r"Check the sign of $f(c) = c^2$. Is it added or subtracted?"),
            W(r"$y = cx^2 + c$", r"The slope $c$ multiplies $x$ to the first power. What is the family?"),
            W(r"$y = c^2 x$", r"The term $f(c) = c^2$ is added, not multiplied onto $x$. What is the full family?"),
        ],
    ),
    item(
        "um_8_4",
        r"The singular solution of a Clairaut equation is geometrically what?",
        r"It is the curve every solution line touches tangentially.",
        [
            C(r"The envelope of the family of solution lines", r"Yes. The singular solution is the envelope tangent to every line."),
            W(r"One member line of the family", r"The singular solution is generally curved and not in the family. What curve do all lines touch?"),
            W(r"A line perpendicular to all solutions", r"It is tangent to the lines, not perpendicular. What curve is it?"),
            W(r"The $y$-axis", r"The envelope depends on $f$, not a fixed axis. What is the singular solution in general?"),
        ],
    ),
    item(
        "um_8_5",
        r"For $y = xp + p^2$, eliminating $p$ between $y = xp + p^2$ and $x + 2p = 0$ gives which singular solution?",
        r"Solve $x + 2p = 0$ for $p = -x/2$, then substitute.",
        [
            C(r"$y = -\frac{x^2}{4}$", r"Correct. With $p = -x/2$, $y = x(-x/2) + (x/2)^2 = -x^2/4$."),
            W(r"$y = \frac{x^2}{4}$", r"Check the sign of $xp$. Is the leading term positive or negative?"),
            W(r"$y = -\frac{x^2}{2}$", r"Combine $-x^2/2 + x^2/4$. What is the sum?"),
            W(r"$y = -x^2$", r"Recompute $x(-x/2) + (x/2)^2$. What single term results?"),
        ],
    ),
    item(
        "um_8_6",
        r"Why is the singular solution not part of the general one-parameter family?",
        r"No single constant slope produces a curved envelope.",
        [
            C(r"No value of $c$ generates it, since it is the envelope rather than a member line", r"Yes. The envelope is a distinct solution that no constant slope produces."),
            W(r"It fails to satisfy the equation", r"It does satisfy the equation. Why is it still outside the family?"),
            W(r"It is just $c = 1$", r"A single constant gives a line, not the curved envelope. Why can no constant produce it?"),
            W(r"It equals every line at once", r"It is tangent to the lines but distinct from them. Why is it separate?"),
        ],
    ),
    # --- Pursuit curves and tractrix (8.2) ---
    item(
        "um_8_7",
        r"In a pursuit problem, the pursuer's velocity always points where?",
        r"The chaser steers straight at the target at each instant.",
        [
            C(r"Toward the target's current position", r"Yes. The pursuer continually aims at where the target is now."),
            W(r"Toward the target's starting position", r"The direction updates continuously. Where does the pursuer aim at each instant?"),
            W(r"Perpendicular to the target's path", r"The chaser aims at the target, not at a right angle. Which direction does its velocity take?"),
            W(r"Along a fixed line", r"The direction changes as the target moves. What position does it aim at?"),
        ],
    ),
    item(
        "um_8_8",
        r"The tractrix is defined by which constant quantity?",
        r"Picture the taut string as a tangent segment from the curve to the line of travel.",
        [
            C(r"The length of the tangent segment from the curve to the line is constant", r"Yes. The fixed tangent-segment length defines the tractrix."),
            W(r"The slope is constant", r"The slope varies along a tractrix. What length is fixed?"),
            W(r"The area under the curve is constant", r"Area is not the invariant. What tangent length stays fixed?"),
            W(r"The height is constant", r"The height decreases along the curve. What length is constant?"),
        ],
    ),
    item(
        "um_8_9",
        r"For a tractrix with string length $a$ along the $x$-axis, the differential equation is which of these?",
        r"The tangent-length condition gives a slope built from $y$ and $\sqrt{a^2 - y^2}$.",
        [
            C(r"$\frac{dy}{dx} = -\frac{y}{\sqrt{a^2 - y^2}}$", r"Yes. The constant tangent length yields this descending slope."),
            W(r"$\frac{dy}{dx} = \frac{\sqrt{a^2 - y^2}}{y}$", r"That is the reciprocal. Which quantity belongs on top for a descending curve?"),
            W(r"$\frac{dy}{dx} = -\frac{\sqrt{a^2 - y^2}}{y}$", r"Numerator and denominator are swapped. Which sits over the square root?"),
            W(r"$\frac{dy}{dx} = \frac{y}{a}$", r"The denominator involves $\sqrt{a^2 - y^2}$, not just $a$. What is the correct slope?"),
        ],
    ),
    item(
        "um_8_10",
        r"Why does $\sqrt{a^2 - y^2}$ appear in the tractrix equation?",
        r"It is a leg of a right triangle with hypotenuse $a$ and vertical leg $y$.",
        [
            C(r"It is the horizontal leg of the string triangle with hypotenuse $a$ and vertical leg $y$", r"Yes. The Pythagorean relation gives this horizontal leg."),
            W(r"It is the triangle's area", r"That expression is a length, not an area. Which leg is it?"),
            W(r"It is the slope of the string", r"It is a length used in the slope, not the slope itself. What leg is it?"),
            W(r"It is an arbitrary constant", r"It depends on $y$ and $a$. What triangle leg is it?"),
        ],
    ),
    item(
        "um_8_11",
        r"Whether a pursuer catches the target generally depends on what comparison?",
        r"Catching up requires moving fast enough relative to the target.",
        [
            C(r"Whether the pursuer's speed exceeds the target's speed", r"Yes. The ratio of speeds decides whether capture occurs."),
            W(r"Whether the pursuer starts higher", r"Starting height does not decide capture. What speed comparison does?"),
            W(r"Whether the path is straight", r"Pursuit paths are typically curved. What governs capture?"),
            W(r"The number of turns made", r"Turn count is not the criterion. Which speed comparison matters?"),
        ],
    ),
    # --- Fluid dynamics and viscosity (8.3) ---
    item(
        "um_8_12",
        r"Conservation of mass in a fluid is expressed by which kind of equation?",
        r"It balances how much fluid flows in against how much accumulates.",
        [
            C(r"A continuity equation", r"Yes. The continuity equation enforces conservation of mass."),
            W(r"A single constant", r"A conservation law is a relation, not a number. What balancing equation states it?"),
            W(r"A purely statistical average", r"Conservation is deterministic here. What equation expresses it?"),
            W(r"An algebraic identity unrelated to flow", r"It is a physical flow balance. What equation captures mass conservation?"),
        ],
    ),
    item(
        "um_8_13",
        r"A streamline in a steady flow is what?",
        r"It is the curve the velocity field is tangent to everywhere.",
        [
            C(r"A curve tangent to the velocity vector at every point", r"Yes. Streamlines follow the velocity field tangentially."),
            W(r"A curve perpendicular to the velocity", r"Streamlines follow the flow, not cross it. How do they relate to velocity?"),
            W(r"A line of constant pressure", r"That is a different concept. What field is a streamline tangent to?"),
            W(r"The container boundary", r"The boundary is fixed geometry. What field is the streamline tangent to?"),
        ],
    ),
    item(
        "um_8_14",
        r"For a Newtonian fluid, the shear stress is proportional to what?",
        r"It depends on how quickly velocity changes across the layers.",
        [
            C(r"The velocity gradient", r"Yes. Newtonian shear stress is proportional to the velocity gradient."),
            W(r"The total volume", r"Volume is not the driver. What spatial rate sets the stress?"),
            W(r"The square of the pressure", r"That is not the relation. What velocity-related gradient applies?"),
            W(r"The temperature alone", r"Temperature affects viscosity but is not the proportional quantity. What gradient is?"),
        ],
    ),
    item(
        "um_8_15",
        r"In $\tau = \mu \frac{du}{dy}$, the symbol $\mu$ represents what?",
        r"It is the proportionality constant linking stress to the velocity gradient.",
        [
            C(r"The dynamic viscosity", r"Yes. The constant $\mu$ is the dynamic viscosity."),
            W(r"The density", r"Density is a different property. What does $\mu$ denote here?"),
            W(r"The pressure", r"Pressure is not the proportionality constant. What is $\mu$?"),
            W(r"The velocity itself", r"Velocity appears in the gradient, not as $\mu$. What is $\mu$?"),
        ],
    ),
    item(
        "um_8_16",
        r"Why are realistic fluid flow equations often hard to solve exactly?",
        r"The terms describing flow carrying itself make the equations nonlinear.",
        [
            C(r"They are nonlinear, so superposition and simple closed forms generally fail", r"Yes. Nonlinearity blocks superposition and usually prevents exact solutions."),
            W(r"They have no solutions", r"Solutions exist but are hard to find. What property makes them difficult?"),
            W(r"They are always linear", r"The trouble is the opposite of linearity. What feature complicates them?"),
            W(r"They ignore physical laws", r"They encode physical laws. What mathematical feature makes them hard?"),
        ],
    ),
    # --- Supply, demand, price (8.4) ---
    item(
        "um_8_17",
        r"In the market model $\frac{dp}{dt} = k(D - S)$ with $k > 0$, the price rises when what is true?",
        r"A positive right side raises the price.",
        [
            C(r"Demand exceeds supply", r"Yes. With $D > S$ the rate is positive, so the price increases."),
            W(r"Supply exceeds demand", r"That makes the rate negative. What relation raises the price?"),
            W(r"Demand equals supply", r"That makes the rate zero. What relation makes it positive?"),
            W(r"The price is negative", r"Price sign does not drive the rate. What demand-supply relation raises price?"),
        ],
    ),
    item(
        "um_8_18",
        r"The equilibrium price in this model satisfies which condition?",
        r"At equilibrium the price stops changing.",
        [
            C(r"Demand equals supply", r"Yes. When $D = S$ the rate is zero and price holds steady."),
            W(r"Demand is maximized", r"Maximum demand is not the equilibrium. What balance makes the rate zero?"),
            W(r"Supply is zero", r"Zero supply is not equilibrium. What equality stops price change?"),
            W(r"Price is zero", r"Equilibrium price is generally nonzero. What condition makes the rate vanish?"),
        ],
    ),
    item(
        "um_8_19",
        r"With demand $D = 100 - 2p$ and supply $S = 20 + 3p$, the equilibrium price is what?",
        r"Set $D = S$ and solve $100 - 2p = 20 + 3p$.",
        [
            C(r"$p = 16$", r"Correct. $80 = 5p$ gives $p = 16$."),
            W(r"$p = 20$", r"Recheck the algebra. What does $80 = 5p$ give?"),
            W(r"$p = 24$", r"Combine the $p$ terms carefully. What is $80/5$?"),
            W(r"$p = 80$", r"You stopped before dividing by the coefficient of $p$. What is $80/5$?"),
        ],
    ),
    # --- Predator-prey (8.5) ---
    item(
        "um_8_20",
        r"In $\frac{dx}{dt} = ax - bxy$, the prey $x$ without predators ($y = 0$) does what?",
        r"Set $y = 0$ and read the remaining term.",
        [
            C(r"Grows exponentially at rate $a$", r"Yes. With $y = 0$, $\frac{dx}{dt} = ax$, exponential growth."),
            W(r"Decays exponentially", r"The coefficient $a$ is positive. Does the prey grow or shrink?"),
            W(r"Stays constant", r"The term $ax$ is nonzero. What change does it produce?"),
            W(r"Oscillates alone", r"A single linear term gives no oscillation. What behavior results?"),
        ],
    ),
    item(
        "um_8_21",
        r"In $\frac{dy}{dt} = -cy + dxy$, the predators $y$ without prey ($x = 0$) do what?",
        r"Set $x = 0$ and read the remaining term.",
        [
            C(r"Decline exponentially at rate $c$", r"Yes. With $x = 0$, $\frac{dy}{dt} = -cy$, exponential decline."),
            W(r"Grow exponentially", r"The remaining term $-cy$ is negative. Do predators rise or fall?"),
            W(r"Stay constant", r"The term $-cy$ is nonzero. What change does it cause?"),
            W(r"Oscillate alone", r"A single linear term gives no oscillation. What behavior results?"),
        ],
    ),
    item(
        "um_8_22",
        r"The coexistence equilibrium of $\frac{dx}{dt} = ax - bxy$, $\frac{dy}{dt} = -cy + dxy$ is at which point?",
        r"Set both rates to zero and factor out the nonzero populations.",
        [
            C(r"$x = \frac{c}{d}$, $y = \frac{a}{b}$", r"Yes. Factoring gives $x = c/d$ and $y = a/b$."),
            W(r"$x = \frac{a}{b}$, $y = \frac{c}{d}$", r"The values are swapped. Which equation sets $x$, and which sets $y$?"),
            W(r"$x = 0$, $y = 0$", r"That is the extinction equilibrium. What positive values solve the equations?"),
            W(r"$x = a$, $y = c$", r"Ratios of parameters matter, not bare constants. What are $x$ and $y$?"),
        ],
    ),
    item(
        "um_8_23",
        r"The interaction term $bxy$ in the prey equation models what?",
        r"It scales with how often the two species meet.",
        [
            C(r"Loss of prey to predation, proportional to encounters", r"Yes. The product $xy$ counts encounters, scaled by $b$."),
            W(r"Prey reproduction", r"Reproduction is the $ax$ term. What does the $xy$ product with a minus sign model?"),
            W(r"Prey immigration", r"Immigration is not in this term. What does the encounter product capture?"),
            W(r"Random fluctuation", r"The model is deterministic. What biological effect does $bxy$ represent?"),
        ],
    ),
    item(
        "um_8_24",
        r"Lotka-Volterra trajectories in the phase plane typically form what?",
        r"The populations rise and fall in a repeating chase.",
        [
            C(r"Closed cycles, giving periodic oscillations", r"Yes. The closed orbits mean both populations oscillate periodically."),
            W(r"Spirals into the equilibrium", r"The classic model does not damp inward. What closed shape forms?"),
            W(r"Straight lines to extinction", r"The populations cycle rather than die out. What closed curves appear?"),
            W(r"A single fixed point", r"Generic trajectories move around. What repeating shape do they trace?"),
        ],
    ),
    # --- Competition (8.6) ---
    item(
        "um_8_25",
        r"In a two-species competition model, the cross interaction terms have which sign for each species?",
        r"Competitors suppress one another's growth.",
        [
            C(r"Negative for both, since each suppresses the other", r"Yes. Competition lowers both species' growth, so both effects are negative."),
            W(r"Positive for one, negative for the other", r"That asymmetry is predation. How does competition affect both?"),
            W(r"Positive for both", r"Mutual benefit is cooperation. What sign do competitive effects carry?"),
            W(r"Zero for both", r"Competition does affect growth. What sign does its effect take?"),
        ],
    ),
    item(
        "um_8_26",
        r"The principle of competitive exclusion states what?",
        r"Two species in the identical niche cannot both persist forever.",
        [
            C(r"Two species competing for the same limiting resource cannot coexist indefinitely", r"Yes. One competitor is eventually excluded."),
            W(r"Competing species always coexist", r"Identical competitors usually cannot both persist. What does exclusion predict?"),
            W(r"Both species always go extinct", r"Exclusion removes one, not necessarily both. What is the usual result?"),
            W(r"Competition has no long-term effect", r"It strongly shapes outcomes. What does the principle assert?"),
        ],
    ),
    item(
        "um_8_27",
        r"Whether two competitors can coexist generally depends on what balance?",
        r"Coexistence needs each species to limit itself more than its rival.",
        [
            C(r"Intraspecific competition being strong relative to interspecific competition", r"Yes. Self-limitation outweighing cross-competition favors coexistence."),
            W(r"Only the initial population sizes", r"Starting sizes do not by themselves decide the long-term outcome. What balance does?"),
            W(r"The habitat color", r"Color is irrelevant. Which competition comparison matters?"),
            W(r"The time of year", r"Timing is not the factor. What balance of competition strengths governs it?"),
        ],
    ),
    item(
        "um_8_28",
        r"In a phase-plane analysis, equilibria of a competition model are located where?",
        r"Equilibria sit where each species' rate of change is zero.",
        [
            C(r"At intersections of the nullclines, where both growth rates vanish", r"Yes. The nullcline intersections give the equilibria."),
            W(r"At the streamline crossings", r"Streamlines belong to fluid flow. What zero-growth curves are used?"),
            W(r"At the contour lines of temperature", r"Temperature is not in the model. What curves locate equilibria?"),
            W(r"At the level curves of viscosity", r"Viscosity is unrelated. What curves mark zero growth?"),
        ],
    ),
    # --- Method selection (8.7) ---
    item(
        "um_8_29",
        r"For $M\,dx + N\,dy = 0$ with $M_y = N_x$, which solution method applies?",
        r"Matching cross partials signal a total differential.",
        [
            C(r"The exact-equation method, finding a potential $F$ with $F = C$", r"Yes. Exactness lets you reconstruct the potential."),
            W(r"Separation of variables", r"The equation may not separate. What does $M_y = N_x$ specifically indicate?"),
            W(r"The Bernoulli substitution", r"Bernoulli targets a different form. What method fits equal cross partials?"),
            W(r"An eigenvalue computation", r"Eigenvalues are for linear systems. What first-order method does exactness call for?"),
        ],
    ),
    item(
        "um_8_30",
        r"A Bernoulli equation $y' + P(x)y = Q(x)y^n$ is linearized by which substitution?",
        r"Introduce a new variable that turns the nonlinear equation linear.",
        [
            C(r"$v = y^{1-n}$", r"Yes. The substitution $v = y^{1-n}$ produces a linear equation in $v$."),
            W(r"$v = y^n$", r"That exponent does not linearize it. What power of $y$ does?"),
            W(r"$v = e^y$", r"An exponential substitution does not apply. What power of $y$ works?"),
            W(r"$v = \ln y$", r"A logarithm is not the Bernoulli substitution. What power of $y$ linearizes it?"),
        ],
    ),
])


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
    unit_new = (emit_unit_block(UNIT7_TITLE, MASTERY_7) + ",\n\n"
                + emit_unit_block(UNIT8_TITLE, MASTERY_8))
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
    data["unit_mastery"][UNIT7_TITLE] = [strip_item(it) for it in MASTERY_7]
    data["unit_mastery"][UNIT8_TITLE] = [strip_item(it) for it in MASTERY_8]

    with open(JSON_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print("[+] quizzes.json mirror updated")


def validate():
    bad = []

    def check(s, where):
        if "—" in s or "&" in s:
            bad.append((where, s))

    for (v, c, its) in MICRO:
        for it in its:
            check(it["prompt"], it["id"] + ".prompt")
            check(it["hint"], it["id"] + ".hint")
            for o in it["answerOptions"]:
                check(o["text"], it["id"] + ".text")
                check(o["rationale"], it["id"] + ".rationale")
    for it in MASTERY_7 + MASTERY_8:
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
    assert len(MICRO) == 27, "expected 27 micro videos, got %d" % len(MICRO)
    assert len(MASTERY_7) == 30, "Unit 7 mastery not 30 items"
    assert len(MASTERY_8) == 30, "Unit 8 mastery not 30 items"
    one_correct(MASTERY_7, "mastery7")
    one_correct(MASTERY_8, "mastery8")
    for it in MASTERY_7 + MASTERY_8:
        assert it["id"] not in seen_ids, "duplicate id %s" % it["id"]
        seen_ids.add(it["id"])

    if bad:
        for where, s in bad:
            print("[!] FORBIDDEN CHAR in", where, "->", s)
        raise SystemExit("Validation failed: forbidden characters present")
    print("[+] validation passed: %d micro videos, %d + %d mastery items, copy rules OK"
          % (len(MICRO), len(MASTERY_7), len(MASTERY_8)))


if __name__ == "__main__":
    validate()
    update_js()
    update_json()
    print("[+] Unit 7 and Unit 8 quiz generation complete")
