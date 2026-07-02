#!/usr/bin/env python3
"""
Generate Unit 3 (Existence, Uniqueness, and Geometry) interactive quizzes.

Authors the 12 video micro-practice quizzes (five items each) and the 30 item
Unit 3 mastery quiz as a single Python source of truth, then:
  1. Emits JS object literal text and splices it into ode/js/quiz-data.js, into
     the existing micro_practice and unit_mastery objects (append only).
  2. Updates the documentation mirror ode/data/quizzes.json so both stay in sync.

Canonical math strings here use SINGLE backslashes (raw strings). json.dumps
performs the escaping, which is identical for JS source literals and JSON, so
the emitted \\frac in both files evaluates to a single backslash at runtime.

Copy rule: no em dashes and no ampersands in any user facing string.
"""

import io
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS_PATH = os.path.join(ROOT, "app", "js", "quiz-data.js")
JSON_PATH = os.path.join(ROOT, "app", "data", "quizzes.json")

UNIT_TITLE = "Unit 3: Existence, Uniqueness, and Geometry"


def C(text, rationale):
    return {"text": text, "correct": True, "rationale": rationale}


def W(text, rationale):
    return {"text": text, "rationale": rationale}


def item(qid, prompt, hint, options):
    return {"id": qid, "prompt": prompt, "hint": hint, "answerOptions": options}


# ----------------------------------------------------------------------------
# MICRO PRACTICE CONTENT, keyed by (video_id, comment)
# ----------------------------------------------------------------------------

MICRO = []  # list of (video_id, comment_line, [items])


def add_micro(video_id, comment, items):
    MICRO.append((video_id, comment, items))


# === 3.1 video 1 ============================================================
add_micro(
    "ccDMpj2UK_M",
    'Unit 3, Module 3.1, video 1\n           "The Geometric Meaning of Differential Equations, Slope Fields, Integral Curves and Isoclines"',
    [
        item(
            "mp_ccDMpj2UK_M_1",
            r"For a first order equation $\frac{dy}{dx} = f(x,y)$, what does a slope field draw at each point of the plane?",
            r"The equation hands you a number at every point. Ask what geometric feature a derivative value represents on a graph.",
            [
                C(r"A short line segment whose slope equals $f(x,y)$ at that point", r"Yes. The derivative is a slope, so the field plants a tiny tangent segment of slope $f(x,y)$ at each point."),
                W(r"A dot at the height $y = f(x,y)$", r"A derivative value is not a height. What feature of a curve does $\frac{dy}{dx}$ measure at a point?"),
                W(r"The area under the solution curve", r"Area comes from integrating, not from the slope rule. What does $f(x,y)$ tell you directly at a single point?"),
                W(r"The second derivative of the solution", r"The equation only gives the first derivative. What single geometric quantity does that first derivative represent?"),
            ],
        ),
        item(
            "mp_ccDMpj2UK_M_2",
            r"For $\frac{dy}{dx} = x + y$, what is the slope of the field at the point $(1, 2)$?",
            r"Substitute the coordinates directly into $f(x,y)$.",
            [
                C(r"$3$", r"Correct. $f(1,2) = 1 + 2 = 3$."),
                W(r"$2$", r"Did you use both coordinates? Add the $x$ value to the $y$ value."),
                W(r"$-1$", r"That looks like $x - y$. Re read the rule. Are the terms added or subtracted?"),
                W(r"$1$", r"That uses only $x$. The rule depends on $y$ as well. What is $x + y$ here?"),
            ],
        ),
        item(
            "mp_ccDMpj2UK_M_3",
            r"For $\frac{dy}{dx} = x + y$, the isocline along which every segment has slope $0$ is which line?",
            r"An isocline of slope $c$ is the set of points where $f(x,y) = c$. Set $f$ equal to zero and solve.",
            [
                C(r"$y = -x$", r"Correct. Setting $x + y = 0$ gives $y = -x$, where all segments are flat."),
                W(r"$y = x$", r"Check the sign when you solve $x + y = 0$ for $y$. Does $y$ equal $x$ or its negative?"),
                W(r"$y = 0$", r"That fixes only $y$. The condition is $x + y = 0$, which links both variables. What line does that give?"),
                W(r"$x = 0$", r"Setting $x = 0$ ignores $y$. Solve the full equation $x + y = 0$ for the relationship between them."),
            ],
        ),
        item(
            "mp_ccDMpj2UK_M_4",
            r"What is an integral curve of a slope field?",
            r"Think about how a solution curve relates to the little segments it passes through.",
            [
                C(r"A solution curve that stays tangent to the field segments at every point it passes through", r"Yes. An integral curve threads through the field so its tangent matches the prescribed slope everywhere."),
                W(r"A curve along which the slope is always zero", r"That describes only one special isocline. Does a general solution have zero slope everywhere?"),
                W(r"The vertical line where the field is undefined", r"A solution curve is generally not vertical. What relationship must it keep with the segments it crosses?"),
                W(r"The boundary of the region where $f$ is defined", r"A boundary is about the domain, not a solution. What geometric condition does a solution curve satisfy against the segments?"),
            ],
        ),
        item(
            "mp_ccDMpj2UK_M_5",
            r"For $\frac{dy}{dx} = y^{2} - x$, along which curve do all segments have slope $2$?",
            r"Set $f(x,y)$ equal to the target slope and solve for the relationship between $x$ and $y$.",
            [
                C(r"$x = y^{2} - 2$", r"Correct. Setting $y^{2} - x = 2$ and solving for $x$ gives $x = y^{2} - 2$."),
                W(r"$x = y^{2} + 2$", r"Move the $2$ carefully when solving $y^{2} - x = 2$. Does it add to or subtract from $y^{2}$?"),
                W(r"$y^{2} - x = 0$", r"That is the isocline of slope zero, not slope two. What constant should the left side equal here?"),
                W(r"$y = x^{2} - 2$", r"Check which variable is squared in the rule. Is it $x$ or $y$ that appears as a square?"),
            ],
        ),
    ],
)

# === 3.1 video 2 ============================================================
add_micro(
    "m9Y8U9f9_Bw",
    'Unit 3, Module 3.1, video 2\n           "Introduction to Slope Fields (Differential Equations 9)"',
    [
        item(
            "mp_m9Y8U9f9_Bw_1",
            r"Why is a slope field useful even when an equation cannot be solved with a formula?",
            r"You can build the picture straight from $f(x,y)$ without ever finding $y(x)$.",
            [
                C(r"It lets you sketch the qualitative shape and behavior of solutions directly from the equation", r"Yes. Even with no formula, the field reveals where solutions rise, fall, and level off."),
                W(r"It produces the exact closed form formula for $y$", r"If a formula were obtainable this way, solving would be trivial. What does the field give you instead of an exact formula?"),
                W(r"It removes the need for any initial condition", r"You still need a starting point to pick one curve. What does the field show about the whole family before that choice?"),
                W(r"It forces every solution to be a straight line", r"Solutions can curve freely through the field. What kind of information does the field actually convey?"),
            ],
        ),
        item(
            "mp_m9Y8U9f9_Bw_2",
            r"For $\frac{dy}{dx} = 2x$, the slope depends only on $x$. What is the slope everywhere along the vertical line $x = 3$?",
            r"Substitute the fixed $x$ value into $f$. Notice $y$ does not appear.",
            [
                C(r"$6$ at every point on that line", r"Correct. With $f = 2x$ and $x = 3$, the slope is $6$ regardless of $y$."),
                W(r"It depends on the value of $y$", r"Look at the rule $2x$. Does the variable $y$ appear in it at all?"),
                W(r"$3$", r"Did you multiply by the coefficient? Evaluate $2x$ at $x = 3$."),
                W(r"$0$", r"A nonzero $x$ gives a nonzero slope here. What is $2 \cdot 3$?"),
            ],
        ),
        item(
            "mp_m9Y8U9f9_Bw_3",
            r"If $\frac{dy}{dx}$ depends only on $y$ (an autonomous equation), how does the slope field look?",
            r"Ask which coordinate the slope ignores, then think about which direction you can move without changing the slope.",
            [
                C(r"The slopes are constant along horizontal lines, the same for all $x$ at a given $y$", r"Yes. Since the rule ignores $x$, every point at the same height carries the same slope."),
                W(r"The slopes are constant along vertical lines", r"Vertical lines fix $x$, but the rule depends on $y$. Which lines hold $y$ fixed?"),
                W(r"The slopes are zero everywhere", r"An autonomous rule is not always zero. It simply does not use $x$. What stays constant as $x$ changes?"),
                W(r"The slopes are always positive", r"Sign depends on the specific rule. What is special is which variable the slope ignores. Which one?"),
            ],
        ),
        item(
            "mp_m9Y8U9f9_Bw_4",
            r"For $\frac{dy}{dx} = -\frac{x}{y}$, what is the slope of the segment at the point $(3, 4)$?",
            r"Substitute both coordinates and keep the negative sign out front.",
            [
                C(r"$-\frac{3}{4}$", r"Correct. $f(3,4) = -\frac{3}{4}$."),
                W(r"$\frac{3}{4}$", r"Do not drop the leading minus sign. What does the negative in front of the fraction do to the value?"),
                W(r"$-\frac{4}{3}$", r"Check which coordinate is on top. Is $x$ in the numerator or the denominator?"),
                W(r"$\frac{4}{3}$", r"Both the sign and the order of $x$ and $y$ need care here. Which variable sits on top of the fraction?"),
            ],
        ),
        item(
            "mp_m9Y8U9f9_Bw_5",
            r"Given a slope field, how do you trace the solution that passes through a chosen initial point?",
            r"Start at the point and let the segments guide you, keeping the curve in step with them.",
            [
                C(r"Start at the point and follow the segments, keeping the curve tangent to the field as you move", r"Yes. The field acts like a current you flow along, matching its slope at each step."),
                W(r"Connect every point where the slope is zero", r"Those points form one isocline, not a single solution. What should the curve do relative to the segments it passes?"),
                W(r"Draw a horizontal line through the point", r"A horizontal line ignores the prescribed slopes. How should the curve respond to each segment it meets?"),
                W(r"Select only the steepest segments and join them", r"Picking by steepness abandons the starting point. What property must the traced curve keep with the local segments?"),
            ],
        ),
    ],
)

# === 3.2 video 1 ============================================================
add_micro(
    "lsbUlubAiGw",
    'Unit 3, Module 3.2, video 1\n           "Differential Equations, Introduction to the Phase Plane"',
    [
        item(
            "mp_lsbUlubAiGw_1",
            r"In the phase plane of a system, what does a single point represent?",
            r"The axes are the dependent variables, not time. Ask what one choice of those variables describes.",
            [
                C(r"A complete state of the system, the values of all dependent variables at one instant", r"Yes. Each point fixes the values of every dependent variable at a moment in time."),
                W(r"The value of the time variable $t$", r"Time is not an axis of the phase plane. What do the axes actually measure?"),
                W(r"The slope of a single solution", r"A point is a location, not a slope. What information do its coordinates carry?"),
                W(r"Only an equilibrium of the system", r"Most points are not equilibria. What does a generic point describe about the system?"),
            ],
        ),
        item(
            "mp_lsbUlubAiGw_2",
            r"What is a trajectory, or orbit, in the phase plane?",
            r"As $t$ runs, the state point moves. Ask what its motion sweeps out.",
            [
                C(r"The path traced by a solution as the parameter $t$ varies", r"Yes. A trajectory is the curve swept by the state point as time advances."),
                W(r"The set of all equilibrium points", r"Equilibria are isolated rest points, not a moving path. What does the state point trace as $t$ changes?"),
                W(r"A line of constant slope in a slope field", r"That belongs to a single first order slope field, not the phase plane of a system. What carves out a trajectory?"),
                W(r"The graph of one variable against time $t$", r"That is a time plot, with $t$ on an axis. The phase plane has no time axis. What curve lives there?"),
            ],
        ),
        item(
            "mp_lsbUlubAiGw_3",
            r"For the system $x' = y$ and $y' = -x$, where is the equilibrium point?",
            r"An equilibrium sets every derivative to zero at once. Solve both equations simultaneously.",
            [
                C(r"$(0, 0)$", r"Correct. $x' = y = 0$ and $y' = -x = 0$ force both coordinates to zero."),
                W(r"$(1, 1)$", r"Test it. Does $x' = y$ vanish there? An equilibrium needs both derivatives equal to zero."),
                W(r"$(1, 0)$", r"Check the second equation $y' = -x$ at this point. Is it zero?"),
                W(r"There is no equilibrium", r"Try setting both right sides to zero. Is there a point where $y = 0$ and $x = 0$ together?"),
            ],
        ),
        item(
            "mp_lsbUlubAiGw_4",
            r"For $x' = x - y$ and $y' = x + y$, where is the $x$ nullcline, the set where $x' = 0$?",
            r"Set the right side of the $x'$ equation to zero and solve for the line.",
            [
                C(r"The line $y = x$", r"Correct. $x - y = 0$ gives $y = x$, where the horizontal motion vanishes."),
                W(r"The line $y = -x$", r"Watch the sign when solving $x - y = 0$. Does $y$ equal $x$ or its negative?"),
                W(r"The line $x = 0$", r"That uses only one variable. The condition $x - y = 0$ relates both. What line results?"),
                W(r"The line $y = 0$", r"Setting $y = 0$ does not satisfy $x - y = 0$ in general. Solve the equation for the full relationship."),
            ],
        ),
        item(
            "mp_lsbUlubAiGw_5",
            r"Where a trajectory crosses the $x$ nullcline (where $x' = 0$ but $y' \neq 0$), in which direction does it move?",
            r"If the horizontal part of the velocity is zero, only the vertical part is left.",
            [
                C(r"Vertically, since the horizontal component of the velocity is zero there", r"Yes. With $x' = 0$ the motion has no horizontal part, so the crossing is straight up or down."),
                W(r"Horizontally", r"Horizontal motion needs $x' \neq 0$. What is $x'$ on this nullcline?"),
                W(r"At a forty five degree angle", r"A diagonal needs both components nonzero. Which component is zero on the $x$ nullcline?"),
                W(r"It always stops there", r"It only stops if $y'$ is also zero. Here $y' \neq 0$, so what remains of the motion?"),
            ],
        ),
    ],
)

# === 3.2 video 2 ============================================================
add_micro(
    "zmzyW1rP-hk",
    'Unit 3, Module 3.2, video 2\n           "Phase Portraits, MIT 18.03SC Differential Equations"',
    [
        item(
            "mp_zmzyW1rP-hk_1",
            r"A phase portrait is best described as what?",
            r"It is a picture meant to show the whole landscape of motion, not just one path.",
            [
                C(r"A representative collection of trajectories sketched together in the phase plane", r"Yes. Several typical orbits drawn together reveal the global behavior of the system."),
                W(r"A single solution curve through one initial point", r"One curve shows one history. What does a portrait gather to show the full picture?"),
                W(r"A plot of one variable against time", r"That is a time plot. The phase plane has no time axis. What does the portrait collect?"),
                W(r"The slope field of a scalar equation $y' = f(x,y)$", r"A scalar slope field is a different object. What does a phase portrait of a system assemble?"),
            ],
        ),
        item(
            "mp_zmzyW1rP-hk_2",
            r"For the linear system $x' = 2x$, $y' = 3y$, what are the eigenvalues of its coefficient matrix?",
            r"A decoupled system like this has a diagonal coefficient matrix, and the eigenvalues sit right on the diagonal.",
            [
                C(r"$2$ and $3$", r"Correct. A diagonal matrix has its diagonal entries as eigenvalues."),
                W(r"$0$ and $0$", r"The zeros are off the diagonal. Which entries determine the eigenvalues of a diagonal matrix?"),
                W(r"$2$ and $0$", r"Both diagonal entries count. What is the second nonzero entry on the diagonal?"),
                W(r"$5$ and $6$", r"You may be combining entries. For a diagonal matrix, read the eigenvalues straight off the diagonal."),
            ],
        ),
        item(
            "mp_zmzyW1rP-hk_3",
            r"If both eigenvalues of a linear system are real and positive, the origin is what type of equilibrium?",
            r"Positive eigenvalues push solutions outward along their eigendirections.",
            [
                C(r"An unstable node, a source, with trajectories moving away from the origin", r"Yes. Positive real eigenvalues make every nearby trajectory grow away from the origin."),
                W(r"A stable node", r"Stability would pull trajectories inward. What does a positive growth rate do to a solution?"),
                W(r"A saddle point", r"A saddle needs eigenvalues of opposite sign. What is true when both are positive?"),
                W(r"A center", r"A center comes from purely imaginary eigenvalues. What shape arises from two real positive ones?"),
            ],
        ),
        item(
            "mp_zmzyW1rP-hk_4",
            r"A saddle point at the origin arises when the eigenvalues are which kind?",
            r"A saddle has one direction pulling in and another pushing out.",
            [
                C(r"Real with opposite signs", r"Yes. One negative eigenvalue draws in along its direction while one positive pushes out along the other."),
                W(r"Both negative", r"Two negative eigenvalues pull everything inward. Does that create the in and out structure of a saddle?"),
                W(r"Both positive", r"Two positive eigenvalues push everything outward. Where would the inward direction of a saddle come from?"),
                W(r"Complex with zero real part", r"Those give closed orbits, not a saddle. What sign pattern produces one inflow and one outflow direction?"),
            ],
        ),
        item(
            "mp_zmzyW1rP-hk_5",
            r"For the linear system $x' = y$, $y' = -x$ the eigenvalues are $\pm i$. The origin is what?",
            r"Purely imaginary eigenvalues mean no growth or decay, only rotation.",
            [
                C(r"A center, with trajectories forming closed orbits around the origin", r"Yes. Pure imaginary eigenvalues give rotation with constant amplitude, so orbits close."),
                W(r"A stable spiral", r"A spiral needs a nonzero real part to shrink the radius. What is the real part of $\pm i$?"),
                W(r"An unstable node", r"A node comes from real eigenvalues. These are purely imaginary. What motion does that give?"),
                W(r"A saddle", r"A saddle needs real eigenvalues of opposite sign. What do purely imaginary eigenvalues produce instead?"),
            ],
        ),
    ],
)

# === 3.3 video 1 ============================================================
add_micro(
    "_WpncZ3RkTg",
    'Unit 3, Module 3.3, video 1\n           "The Big Theorem of Differential Equations, Existence and Uniqueness"',
    [
        item(
            "mp__WpncZ3RkTg_1",
            r"The existence and uniqueness theorem for $\frac{dy}{dx} = f(x,y)$ with $y(x_{0}) = y_{0}$ guarantees a unique solution near $x_{0}$ when which condition holds?",
            r"Two continuity conditions appear, one on $f$ and one on a particular partial derivative.",
            [
                C(r"Both $f$ and $\frac{\partial f}{\partial y}$ are continuous on a rectangle containing $(x_{0}, y_{0})$", r"Yes. Continuity of $f$ gives existence, and continuity of $\frac{\partial f}{\partial y}$ secures uniqueness."),
                W(r"$f$ is merely defined at the single point $(x_{0}, y_{0})$", r"Being defined at one point says nothing about nearby behavior. What must hold on a whole rectangle around it?"),
                W(r"The initial value $y_{0}$ equals zero", r"The starting height is not a hypothesis of the theorem. What two continuity conditions does it actually require?"),
                W(r"The function $f$ is linear in $y$", r"Linearity is sufficient but far from necessary. What general continuity conditions does the theorem ask for?"),
            ],
        ),
        item(
            "mp__WpncZ3RkTg_2",
            r"If $f$ is continuous near $(x_{0}, y_{0})$ but $\frac{\partial f}{\partial y}$ is not, what is guaranteed?",
            r"Separate the two roles. One condition delivers a solution, the other delivers exactly one.",
            [
                C(r"At least one solution exists, but uniqueness is not guaranteed", r"Yes. Continuity of $f$ alone secures existence; uniqueness may fail without the derivative condition."),
                W(r"Uniqueness holds but existence may fail", r"Continuity of $f$ is precisely the existence condition. Which property is the derivative condition responsible for?"),
                W(r"Both existence and uniqueness are guaranteed", r"One hypothesis is missing. Which of the two conclusions depends on $\frac{\partial f}{\partial y}$?"),
                W(r"Neither existence nor uniqueness holds", r"Continuity of $f$ still buys something. Which conclusion survives without the derivative condition?"),
            ],
        ),
        item(
            "mp__WpncZ3RkTg_3",
            r"For $\frac{dy}{dx} = y^{1/3}$ with $y(0) = 0$, why does uniqueness fail at the origin?",
            r"Examine $\frac{\partial f}{\partial y}$ near $y = 0$. Does it stay finite and continuous?",
            [
                C(r"$\frac{\partial f}{\partial y} = \frac{1}{3} y^{-2/3}$ is not continuous at $y = 0$, it blows up", r"Yes. The derivative condition breaks down at $y = 0$, so the uniqueness guarantee is lost."),
                W(r"The function $f = y^{1/3}$ is discontinuous at $0$", r"Check $f$ itself at $y = 0$. Is $0^{1/3}$ undefined, or is it the derivative that misbehaves?"),
                W(r"The initial value is negative", r"The starting value is zero, not negative. Which quantity actually fails to be continuous here?"),
                W(r"Nonlinear equations never have solutions", r"Many nonlinear equations have solutions. What specific hypothesis fails at the origin?"),
            ],
        ),
        item(
            "mp__WpncZ3RkTg_4",
            r"For $\frac{dy}{dx} = x^{2} + y^{2}$, in which region is a unique solution guaranteed through any starting point?",
            r"Check where $f$ and $\frac{\partial f}{\partial y}$ are continuous.",
            [
                C(r"The entire plane, since $f$ and $\frac{\partial f}{\partial y} = 2y$ are continuous everywhere", r"Yes. Both are polynomials, continuous on all of the plane, so uniqueness holds throughout."),
                W(r"Only where $y > 0$", r"Polynomials do not care about sign. Where are $f$ and $2y$ continuous?"),
                W(r"Only along the line $x = 0$", r"The conditions are not restricted to one line. Where are these polynomial expressions continuous?"),
                W(r"Nowhere, because the equation is nonlinear", r"Nonlinearity does not by itself break the theorem. Are $f$ and $\frac{\partial f}{\partial y}$ continuous here?"),
            ],
        ),
        item(
            "mp__WpncZ3RkTg_5",
            r"The theorem guarantees a unique solution on what kind of interval around $x_{0}$?",
            r"The guarantee is local. Ask how wide the promised interval is.",
            [
                C(r"Some open interval around $x_{0}$, possibly small, not necessarily all $x$", r"Yes. The conclusion is local, an interval that may be short and is not guaranteed to extend forever."),
                W(r"The entire real line, always", r"A local theorem cannot promise a global interval. How far does it actually guarantee the solution extends?"),
                W(r"Only at the single point $x_{0}$", r"A solution at one point is not a function on an interval. What size of neighborhood does the theorem provide?"),
                W(r"An interval of length exactly one", r"No fixed length is promised. What does the theorem say about the size of the guaranteed interval?"),
            ],
        ),
    ],
)

# === 3.3 video 2 ============================================================
add_micro(
    "BVKyaEu1FWk",
    'Unit 3, Module 3.3, video 2\n           "Existence and Uniqueness of Solutions (Differential Equations 11)"',
    [
        item(
            "mp_BVKyaEu1FWk_1",
            r"For $\frac{dy}{dx} = \frac{x}{y - 2}$, where does the theorem fail to guarantee a unique solution?",
            r"Find where $f$ and its $y$ derivative lose continuity. Watch the denominator.",
            [
                C(r"Along the line $y = 2$", r"Yes. The denominator vanishes there, so $f$ and $\frac{\partial f}{\partial y}$ are not continuous on $y = 2$."),
                W(r"Along the line $x = 0$", r"At $x = 0$ the function is simply zero and well behaved. Where does the denominator cause trouble?"),
                W(r"At the origin only", r"The problem is a whole line, not one point. Which values of $y$ make the denominator zero?"),
                W(r"Nowhere, it is continuous everywhere", r"Look at the denominator $y - 2$. Is there a value of $y$ that makes the expression blow up?"),
            ],
        ),
        item(
            "mp_BVKyaEu1FWk_2",
            r"In a region where the hypotheses of the theorem hold, what does uniqueness say about two distinct solution curves?",
            r"If two curves met at a point, both would be the unique solution through it. What contradiction follows?",
            [
                C(r"They cannot intersect, distinct solution curves do not cross in that region", r"Yes. A crossing would mean two solutions through one point, contradicting uniqueness."),
                W(r"They may cross as long as they meet at right angles", r"The angle does not matter. What would a shared point imply about the number of solutions there?"),
                W(r"They must be parallel everywhere", r"Solutions need not be parallel. What is forbidden is meeting at a point. Why?"),
                W(r"Crossing is allowed if their slopes differ at the meeting point", r"At a shared point the slope is fixed by $f$, so slopes would match. What does uniqueness rule out entirely?"),
            ],
        ),
        item(
            "mp_BVKyaEu1FWk_3",
            r"For $\frac{dy}{dx} = \sqrt{y}$ with $y(0) = 0$, how many solutions pass through the origin?",
            r"Test both $y = 0$ and $y = \frac{x^{2}}{4}$. Then ask what the derivative condition does at $y = 0$.",
            [
                C(r"More than one, for example $y = 0$ and $y = \frac{x^{2}}{4}$, so uniqueness fails", r"Yes. Several curves satisfy the equation through the origin because $\frac{\partial f}{\partial y}$ is not continuous at $y = 0$."),
                W(r"Exactly one, because $f$ is continuous there", r"Continuity of $f$ gives existence, not uniqueness. Check $\frac{\partial f}{\partial y}$ at $y = 0$. Is it continuous?"),
                W(r"None", r"At least $y = 0$ works. Can you find another curve through the origin as well?"),
                W(r"Exactly two and no more", r"Delayed start solutions give even more. Is the count limited to two, or is uniqueness simply broken?"),
            ],
        ),
        item(
            "mp_BVKyaEu1FWk_4",
            r"For the linear initial value problem $y' + p(x) y = q(x)$ with $p$ and $q$ continuous on an interval $I$ containing $x_{0}$, the solution exists and is unique on which set?",
            r"The linear theorem is stronger than the general one. It gives a global guarantee on the whole interval of continuity.",
            [
                C(r"The entire interval $I$ on which $p$ and $q$ are continuous", r"Yes. For linear equations the unique solution extends across the full interval where the coefficients are continuous."),
                W(r"Only a tiny neighborhood of $x_{0}$", r"That is the weaker general result. What does linearity let you say about the whole interval $I$?"),
                W(r"Only where $q(x) = 0$", r"The forcing term need not vanish. Where do the coefficients being continuous let the solution live?"),
                W(r"Nowhere is it guaranteed", r"Continuity of $p$ and $q$ guarantees a great deal here. Over what set does the linear theorem promise a unique solution?"),
            ],
        ),
        item(
            "mp_BVKyaEu1FWk_5",
            r"Which choice of $f(x,y)$ fails to have a continuous $\frac{\partial f}{\partial y}$ at $y = 0$?",
            r"Differentiate each with respect to $y$ and ask which derivative blows up at $y = 0$.",
            [
                C(r"$f = y^{2/3}$", r"Yes. Its derivative $\frac{2}{3} y^{-1/3}$ is unbounded at $y = 0$, so it is not continuous there."),
                W(r"$f = y^{2}$", r"Differentiate, getting $2y$. Is that continuous at $y = 0$?"),
                W(r"$f = \sin y$", r"Its derivative is $\cos y$. Does that have any trouble at $y = 0$?"),
                W(r"$f = e^{y}$", r"Its derivative is $e^{y}$. Is that finite and continuous at $y = 0$?"),
            ],
        ),
    ],
)

# === 3.4 video 1 ============================================================
add_micro(
    "csInNn6pfT4",
    'Unit 3, Module 3.4, video 1\n           "Fixed Points"',
    [
        item(
            "mp_csInNn6pfT4_1",
            r"A fixed point of a function $g$ is a value $x^{*}$ satisfying which equation?",
            r"A fixed point is unmoved by the function. What does applying $g$ leave unchanged?",
            [
                C(r"$g(x^{*}) = x^{*}$", r"Yes. A fixed point returns itself when fed through $g$."),
                W(r"$g'(x^{*}) = 0$", r"That is a critical point, about the slope of $g$. What does a fixed point require of the value itself?"),
                W(r"$g(x^{*}) = 0$", r"That is a root of $g$, where the output is zero. A fixed point asks the output to match what instead?"),
                W(r"$x^{*} = 0$", r"Fixed points need not be at the origin. What relationship between input and output defines them?"),
            ],
        ),
        item(
            "mp_csInNn6pfT4_2",
            r"Find the fixed point of $g(x) = \frac{x}{2} + 3$.",
            r"Set $g(x) = x$ and solve for $x$.",
            [
                C(r"$x = 6$", r"Correct. $x = \frac{x}{2} + 3$ gives $\frac{x}{2} = 3$, so $x = 6$."),
                W(r"$x = 3$", r"The constant $3$ is not the answer by itself. Solve $\frac{x}{2} = 3$ for $x$."),
                W(r"$x = 0$", r"Substitute $x = 0$ into $g$. Does it return $0$? Set $g(x) = x$ and solve properly."),
                W(r"$x = 2$", r"Check by plugging in. Does $g(2)$ equal $2$? Solve the equation $g(x) = x$ exactly."),
            ],
        ),
        item(
            "mp_csInNn6pfT4_3",
            r"Iterating $x_{n+1} = \cos(x_{n})$ from almost any start converges to a fixed point near which value (in radians)?",
            r"This is the famous number you reach by pressing cosine repeatedly on a calculator set to radians.",
            [
                C(r"About $0.739$", r"Yes. That is the Dottie number, the unique fixed point of cosine."),
                W(r"$0$", r"Pressing cosine on $0$ gives $1$, not $0$, so $0$ is not fixed. Where does the sequence settle?"),
                W(r"$1$", r"Test it. Is $\cos(1)$ equal to $1$? Keep iterating to see where it lands."),
                W(r"$\frac{\pi}{2}$", r"Cosine of $\frac{\pi}{2}$ is $0$, so it is not fixed. What value does $g(x) = x$ give for cosine?"),
            ],
        ),
        item(
            "mp_csInNn6pfT4_4",
            r"A fixed point $x^{*}$ of the iteration $x_{n+1} = g(x_{n})$ is attracting (stable) when which condition holds?",
            r"Nearby points should move closer with each step. That depends on how steep $g$ is at $x^{*}$.",
            [
                C(r"$|g'(x^{*})| < 1$", r"Yes. A slope of magnitude less than one shrinks distances, pulling nearby points inward."),
                W(r"$|g'(x^{*})| > 1$", r"A slope larger than one in magnitude stretches distances. Does that pull points in or push them out?"),
                W(r"$g'(x^{*}) = 0$ exactly", r"Zero slope gives fast attraction, but it is not the general condition. What range of $|g'|$ guarantees attraction?"),
                W(r"$g(x^{*}) > x^{*}$", r"That compares values, not slopes. Stability depends on the derivative. What must $|g'(x^{*})|$ satisfy?"),
            ],
        ),
        item(
            "mp_csInNn6pfT4_5",
            r"For $g(x) = x^{2}$, which statement about its fixed points and their stability is correct?",
            r"Solve $x = x^{2}$, then evaluate $|g'(x)| = |2x|$ at each fixed point.",
            [
                C(r"$x = 0$ is attracting and $x = 1$ is repelling", r"Yes. $|g'(0)| = 0 < 1$ attracts, while $|g'(1)| = 2 > 1$ repels."),
                W(r"Both $x = 0$ and $x = 1$ are attracting", r"Evaluate $|2x|$ at each. Is the magnitude below one at both points?"),
                W(r"Both are repelling", r"Check $|g'(0)|$. Is the slope magnitude at the origin really larger than one?"),
                W(r"$x = 1$ is attracting and $x = 0$ is repelling", r"You may have swapped them. Compare $|2 \cdot 0|$ and $|2 \cdot 1|$ to the value one."),
            ],
        ),
    ],
)

# === 3.4 video 2 ============================================================
add_micro(
    "bEZ6JLLjM3Y",
    'Unit 3, Module 3.4, video 2\n           "The beauty of Fixed Points"',
    [
        item(
            "mp_bEZ6JLLjM3Y_1",
            r"Graphically, the fixed points of $g$ are found where which two graphs meet?",
            r"A fixed point has output equal to input. What line captures the relation output equals input?",
            [
                C(r"Where the graph of $y = g(x)$ meets the line $y = x$", r"Yes. On the line $y = x$ the output equals the input, which is exactly the fixed point condition."),
                W(r"Where $g$ crosses the $x$ axis", r"Crossing the $x$ axis means $g(x) = 0$, a root. Which line encodes output equals input instead?"),
                W(r"Where the slope of $g$ is zero", r"Zero slope marks a critical point. What graphical condition matches input to output?"),
                W(r"At the $y$ intercept of $g$", r"The intercept is just one value of $g$. Which line do you intersect to find fixed points?"),
            ],
        ),
        item(
            "mp_bEZ6JLLjM3Y_2",
            r"What does a cobweb diagram illustrate?",
            r"It is a step by step picture of bouncing between the curve and a particular line.",
            [
                C(r"The step by step behavior of the iteration $x_{n+1} = g(x_{n})$ toward or away from a fixed point", r"Yes. The cobweb traces each iterate, showing whether the sequence converges or diverges."),
                W(r"The area under the curve of $g$", r"Cobwebs are not about area. What process do the bouncing steps represent?"),
                W(r"The roots of $g$", r"Roots are where $g = 0$. What does the cobweb actually track as it bounces?"),
                W(r"The tangent line of $g$ at the origin", r"A single tangent line is not the picture. What iterative process does the cobweb display?"),
            ],
        ),
        item(
            "mp_bEZ6JLLjM3Y_3",
            r"For $g(x) = 0.5x + 1$, find the fixed point and state whether it is attracting.",
            r"Solve $g(x) = x$, then compare $|g'(x)|$ with one.",
            [
                C(r"$x = 2$, and it is attracting since $|g'| = 0.5 < 1$", r"Yes. Solving gives $x = 2$, and the slope magnitude below one makes it attracting."),
                W(r"$x = 2$, but it is repelling", r"You found the right point. Now check $|g'| = 0.5$. Is that above or below one?"),
                W(r"$x = 1$, and it is attracting", r"Recheck the algebra. Solve $0.5x + 1 = x$ carefully for $x$."),
                W(r"$x = 0$, and it is attracting", r"Test $x = 0$ in $g$. Does it return $0$? Solve $g(x) = x$ properly."),
            ],
        ),
        item(
            "mp_bEZ6JLLjM3Y_4",
            r"Why does repeatedly pressing cosine on a calculator settle to the same number no matter where you start?",
            r"Think about how cosine compresses distances between inputs, and how many fixed points it has.",
            [
                C(r"Cosine contracts distances on the relevant interval, so its single attracting fixed point pulls in every start", r"Yes. Because cosine shrinks gaps between points, all starts funnel to its one fixed point."),
                W(r"Because cosine is periodic", r"Periodicity does not force convergence. What property makes nearby outputs closer together each step?"),
                W(r"Because the calculator rounds the digits", r"Rounding is not the cause. What feature of cosine pulls every sequence to one value?"),
                W(r"Because cosine has many fixed points to choose from", r"Cosine has just one fixed point here. What lets every start reach that single point?"),
            ],
        ),
        item(
            "mp_bEZ6JLLjM3Y_5",
            r"Solving the fixed point equation for $g(x) = \sqrt{x}$ gives which solutions?",
            r"Set $\sqrt{x} = x$, then square both sides and solve.",
            [
                C(r"$x = 0$ and $x = 1$", r"Yes. Squaring $\sqrt{x} = x$ gives $x = x^{2}$, whose solutions are $0$ and $1$."),
                W(r"Only $x = 1$", r"Do not forget the trivial solution. Does $x = 0$ satisfy $\sqrt{x} = x$ as well?"),
                W(r"Only $x = 0$", r"Check $x = 1$ too. Is $\sqrt{1}$ equal to $1$?"),
                W(r"There are no solutions", r"Try small values. Does $\sqrt{x} = x$ hold at $x = 0$ and $x = 1$?"),
            ],
        ),
    ],
)

# === 3.5 video 1 ============================================================
add_micro(
    "qHnXE_h5c2M",
    'Unit 3, Module 3.5, video 1\n           "What is cos(cos(cos(...?, Banach Fixed Point Theorem"',
    [
        item(
            "mp_qHnXE_h5c2M_1",
            r"A function $g$ is a contraction on a set if there exists a constant $0 \le k < 1$ such that which inequality holds for all $x$ and $y$?",
            r"A contraction shrinks the gap between any two points by at least a fixed factor.",
            [
                C(r"$|g(x) - g(y)| \le k\,|x - y|$", r"Yes. The outputs are closer than the inputs by the factor $k$, which is less than one."),
                W(r"$|g(x) - g(y)| \ge k\,|x - y|$", r"That would expand or preserve distances. A contraction does the opposite. Which direction is the inequality?"),
                W(r"$g'(x) = k$ for a constant $k$", r"A constant derivative makes $g$ affine, which is special. What inequality must hold for all pairs $x$ and $y$?"),
                W(r"$|g(x)| \le k$ for all $x$", r"That bounds the values, not the distances between them. What does a contraction control about pairs of points?"),
            ],
        ),
        item(
            "mp_qHnXE_h5c2M_2",
            r"The Banach fixed point theorem guarantees what for a contraction on a complete space?",
            r"It is a strong statement, about how many fixed points there are and where the iteration goes.",
            [
                C(r"Exactly one fixed point, and the iteration converges to it from any start", r"Yes. A contraction on a complete space has a unique fixed point reached from every starting value."),
                W(r"At least two fixed points", r"A contraction cannot have two. If it did, the distance between them could not shrink. How many does it have?"),
                W(r"Existence of a fixed point, but possibly many", r"Uniqueness is part of the conclusion. Why can a contraction have no second fixed point?"),
                W(r"Convergence only from starts very close to the fixed point", r"Convergence is global for a contraction on a complete space. From which starts does the iteration converge?"),
            ],
        ),
        item(
            "mp_qHnXE_h5c2M_3",
            r"On an interval where $|g'(x)| \le k < 1$, the map $g$ is a contraction with constant $k$. For $g(x) = \cos x$ on $[0, 1]$, since $|g'(x)| = |\sin x|$, what bound applies?",
            r"On $[0,1]$ the sine function increases, so its largest value there is at $x = 1$.",
            [
                C(r"$|\sin x| \le \sin 1 \approx 0.841 < 1$, so $g$ is a contraction there", r"Yes. The derivative magnitude stays below one, confirming the contraction."),
                W(r"$|\sin x|$ can equal $1$ on this interval", r"Sine reaches one only at $\frac{\pi}{2} \approx 1.57$, outside $[0,1]$. What is its largest value on $[0,1]$?"),
                W(r"$|\sin x|$ exceeds $1$ somewhere on $[0, 1]$", r"Sine never exceeds one anywhere. What is its maximum on this particular interval?"),
                W(r"$|\sin x| = 0$ throughout the interval", r"Sine is zero only at $x = 0$ here. What value does it climb to by $x = 1$?"),
            ],
        ),
        item(
            "mp_qHnXE_h5c2M_4",
            r"Why does the Banach theorem require the space to be complete?",
            r"The iterates form a Cauchy sequence. Completeness is about whether such sequences have limits inside the space.",
            [
                C(r"It ensures the limit of the Cauchy sequence of iterates actually lies in the space", r"Yes. Completeness guarantees the limit point belongs to the space, so the fixed point exists there."),
                W(r"It makes the map $g$ linear", r"Completeness is a property of the space, not of $g$. What does it ensure about limits of sequences?"),
                W(r"It guarantees the contraction constant is zero", r"The constant is set by $g$, not the space. What role does completeness play for the iterates?"),
                W(r"It removes the need for a starting point", r"You still iterate from a start. What does completeness guarantee about where the sequence converges?"),
            ],
        ),
        item(
            "mp_qHnXE_h5c2M_5",
            r"If $k = 0.5$ and the first step moves a distance $|x_{1} - x_{0}| = 2$, the contraction property bounds $|x_{2} - x_{1}|$ by at most what?",
            r"Each step shrinks the previous gap by the factor $k$.",
            [
                C(r"$1$", r"Correct. $|x_{2} - x_{1}| \le k\,|x_{1} - x_{0}| = 0.5 \cdot 2 = 1$."),
                W(r"$2$", r"The contraction shrinks the gap. Multiply the previous distance by $k = 0.5$. What do you get?"),
                W(r"$0.5$", r"Multiply $k$ by the actual previous distance of $2$, not by one. What is $0.5 \cdot 2$?"),
                W(r"$4$", r"A contraction shrinks rather than grows distances. Should the next gap be larger or smaller than $2$?"),
            ],
        ),
    ],
)

# === 3.5 video 2 ============================================================
add_micro(
    "ewGo7rtTHE0",
    'Unit 3, Module 3.5, video 2\n           "Ordinary Differential Equations 11, Banach Fixed Point Theorem"',
    [
        item(
            "mp_ewGo7rtTHE0_1",
            r"How does the Banach theorem connect to solving differential equations?",
            r"The proof of existence and uniqueness recasts the equation as a fixed point problem for an operator.",
            [
                C(r"The Picard integral operator is shown to be a contraction, so its unique fixed point is the unique solution", r"Yes. Solving the equation becomes finding the fixed point of a contraction, which Banach guarantees."),
                W(r"It factors the equation into separate linear pieces", r"The link is not factoring. What operator is shown to be a contraction so its fixed point solves the equation?"),
                W(r"It computes the eigenvalues of the equation", r"Eigenvalues belong to a different method. What fixed point of which operator gives the solution?"),
                W(r"It replaces integration with differentiation", r"The integral form is the one used. What property of the integral operator does Banach exploit?"),
            ],
        ),
        item(
            "mp_ewGo7rtTHE0_2",
            r"A contraction with constant $k$ obeys the bound $|x_{n} - x^{*}| \le \frac{k^{n}}{1 - k}\,|x_{1} - x_{0}|$. With $k = 0.5$ and $|x_{1} - x_{0}| = 1$, what is the bound at $n = 1$?",
            r"Substitute $k = 0.5$ and $n = 1$ into $\frac{k^{n}}{1 - k}$, then multiply by the step size.",
            [
                C(r"$1$", r"Correct. $\frac{0.5}{1 - 0.5} \cdot 1 = \frac{0.5}{0.5} = 1$."),
                W(r"$0.5$", r"Do not forget the denominator $1 - k$. What is $\frac{0.5}{0.5}$?"),
                W(r"$2$", r"Check the arithmetic of $\frac{0.5}{0.5}$. Does dividing equal numbers give two?"),
                W(r"$0.25$", r"That looks like $k^{2}$. Use $n = 1$, so the numerator is $k$, not $k^{2}$. What results?"),
            ],
        ),
        item(
            "mp_ewGo7rtTHE0_3",
            r"Why must the contraction constant $k$ be strictly less than $1$, not equal to $1$?",
            r"With $k = 1$ the inequality only says distances do not grow. Is that enough to force convergence?",
            [
                C(r"With $k = 1$ distances need not shrink, so the iterates may fail to converge to a single point", r"Yes. Only $k < 1$ forces gaps to zero, securing convergence and uniqueness."),
                W(r"With $k = 1$ the map $g$ becomes undefined", r"The map is still defined at $k = 1$. What fails is the shrinking of distances. Why does that matter?"),
                W(r"With $k = 1$ there are always infinitely many fixed points", r"That is not guaranteed. The real issue is convergence. What does $k = 1$ allow distances to do?"),
                W(r"The constant $k$ must be negative", r"Distances are nonnegative, so $k \ge 0$. The key requirement is the upper bound. What must $k$ be less than?"),
            ],
        ),
        item(
            "mp_ewGo7rtTHE0_4",
            r"Is $g(x) = x + 1$ a contraction on the real line?",
            r"Compute $|g(x) - g(y)|$, and also ask whether $g$ has any fixed point.",
            [
                C(r"No, since $|g(x) - g(y)| = |x - y|$ gives $k = 1$, and it has no fixed point", r"Yes. The map preserves distances exactly and $x = x + 1$ has no solution, so Banach does not apply."),
                W(r"Yes, with constant $k = 1$", r"A contraction needs $k < 1$ strictly. Does $k = 1$ qualify, and does this map even have a fixed point?"),
                W(r"Yes, with constant $k = 0$", r"That would mean $g$ is constant, but $g(x) = x + 1$ moves with $x$. What is $|g(x) - g(y)|$ exactly?"),
                W(r"Yes, with a fixed point at $0$", r"Test it. Does $g(0) = 0 + 1$ equal $0$? Can $x = x + 1$ ever hold?"),
            ],
        ),
        item(
            "mp_ewGo7rtTHE0_5",
            r"The theorem requires the map to send the space into itself. Why is that needed?",
            r"If an iterate left the domain, the contraction estimate might no longer apply to it.",
            [
                C(r"So every iterate stays in the domain where the contraction property holds", r"Yes. Mapping the space into itself keeps the whole sequence inside the region where the estimates work."),
                W(r"So the map $g$ becomes linear", r"Self mapping says nothing about linearity. What does it guarantee about where the iterates land?"),
                W(r"So the fixed point must equal zero", r"The fixed point can be anywhere. What does staying inside the space ensure about the iterates?"),
                W(r"So the constant $k$ can exceed one", r"A contraction always needs $k < 1$. What does the self mapping condition protect about the iteration?"),
            ],
        ),
    ],
)

# === 3.6 video 1 ============================================================
add_micro(
    "9gos-d1v-2s",
    'Unit 3, Module 3.6, video 1\n           "Ordinary Differential Equations 13, Picard Iteration"',
    [
        item(
            "mp_9gos-d1v-2s_1",
            r"Picard iteration first rewrites the problem $y' = f(x,y)$, $y(x_{0}) = y_{0}$ as which equivalent form?",
            r"Integrate both sides from $x_{0}$ to $x$ and use the initial condition to fix the constant.",
            [
                C(r"The integral equation $y(x) = y_{0} + \int_{x_{0}}^{x} f(t, y(t))\,dt$", r"Yes. Integrating the derivative and applying the initial value gives this equivalent integral equation."),
                W(r"The algebraic relation $y(x) = y_{0} + f(x, y)$", r"That has no integral and is not equivalent. What operation undoes the derivative across the interval?"),
                W(r"The equation $f(x, y) = 0$", r"Setting $f$ to zero looks for equilibria, not the solution path. What form comes from integrating $y'$?"),
                W(r"The relation $y' = y_{0}$", r"That replaces the rule with a constant, losing the equation. What equivalent integral form preserves it?"),
            ],
        ),
        item(
            "mp_9gos-d1v-2s_2",
            r"For $y' = y$ with $y(0) = 1$, take the zeroth iterate $\varphi_{0} = 1$. What is the first Picard iterate $\varphi_{1}(x)$?",
            r"Use $\varphi_{1}(x) = 1 + \int_{0}^{x} \varphi_{0}(t)\,dt$ with $\varphi_{0} = 1$.",
            [
                C(r"$1 + x$", r"Correct. $\varphi_{1} = 1 + \int_{0}^{x} 1\,dt = 1 + x$."),
                W(r"$1$", r"You must add the integral term. What is $\int_{0}^{x} 1\,dt$?"),
                W(r"$e^{x}$", r"That is the final limit, not the first iterate. What does one integration of the constant $1$ give?"),
                W(r"$x$", r"Do not drop the initial value $y_{0} = 1$. The formula starts with $1$ plus the integral. What is the sum?"),
            ],
        ),
        item(
            "mp_9gos-d1v-2s_3",
            r"Continuing for $y' = y$, $y(0) = 1$ with $\varphi_{1} = 1 + x$, what is the second iterate $\varphi_{2}(x)$?",
            r"Compute $\varphi_{2}(x) = 1 + \int_{0}^{x} (1 + t)\,dt$.",
            [
                C(r"$1 + x + \frac{x^{2}}{2}$", r"Correct. $\int_{0}^{x}(1 + t)\,dt = x + \frac{x^{2}}{2}$, then add the leading $1$."),
                W(r"$1 + x$", r"You integrated nothing new. Integrate $1 + t$ from $0$ to $x$ and add the leading $1$. What term appears?"),
                W(r"$1 + \frac{x^{2}}{2}$", r"Do not lose the linear term from integrating the constant $1$. What is $\int_{0}^{x} 1\,dt$?"),
                W(r"$1 + 2x$", r"Integrating $t$ does not give $x$. What is $\int_{0}^{x} t\,dt$?"),
            ],
        ),
        item(
            "mp_9gos-d1v-2s_4",
            r"As $n \to \infty$ for $y' = y$, $y(0) = 1$, the Picard iterates converge to which function?",
            r"The iterates are the partial sums $1 + x + \frac{x^{2}}{2} + \cdots$. What familiar series is that?",
            [
                C(r"$e^{x}$", r"Yes. The iterates build the Taylor series of $e^{x}$, the true solution."),
                W(r"$1 + x$", r"That is only the first iterate. What function do the growing partial sums approach?"),
                W(r"A polynomial of fixed degree", r"Each iterate adds another term forever. Does the limit stay polynomial, or become a known function?"),
                W(r"$x$", r"The series starts at $1$ and never reduces to $x$ alone. What function has Taylor series $1 + x + \frac{x^{2}}{2} + \cdots$?"),
            ],
        ),
        item(
            "mp_9gos-d1v-2s_5",
            r"For $y' = x + y$ with $y(0) = 0$ and $\varphi_{0} = 0$, compute the first Picard iterate $\varphi_{1}(x)$.",
            r"Use $\varphi_{1}(x) = 0 + \int_{0}^{x} (t + \varphi_{0}(t))\,dt$ with $\varphi_{0} = 0$.",
            [
                C(r"$\frac{x^{2}}{2}$", r"Correct. With $\varphi_{0} = 0$, $\varphi_{1} = \int_{0}^{x} t\,dt = \frac{x^{2}}{2}$."),
                W(r"$x^{2}$", r"Check the integral of $t$. Is $\int_{0}^{x} t\,dt$ equal to $x^{2}$ or half of that?"),
                W(r"$x$", r"You integrated $t$, not a constant. What is $\int_{0}^{x} t\,dt$?"),
                W(r"$1 + \frac{x^{2}}{2}$", r"The initial value is $0$, not $1$, so no constant is added. What does the integral alone give?"),
            ],
        ),
    ],
)

# === 3.6 video 2 ============================================================
add_micro(
    "fsbVJxOhRcU",
    'Unit 3, Module 3.6, video 2\n           "Lecture 23, Existence and Uniqueness for ODEs, Picard Lindelof Theorem"',
    [
        item(
            "mp_fsbVJxOhRcU_1",
            r"The Picard Lindelof theorem proves existence and uniqueness using which main tool?",
            r"It turns the equation into a fixed point problem and applies a powerful theorem about contractions.",
            [
                C(r"The Banach contraction principle applied to the Picard integral operator", r"Yes. The integral operator is a contraction, so Banach delivers a unique fixed point, the solution."),
                W(r"Eigenvalue decomposition of a matrix", r"That belongs to linear systems. What principle about contractions powers this proof?"),
                W(r"The chain rule for derivatives", r"The chain rule is a differentiation tool, not the engine of this proof. What fixed point principle is used?"),
                W(r"Partial fraction decomposition", r"That is an integration technique for rational functions. What contraction based theorem proves the result?"),
            ],
        ),
        item(
            "mp_fsbVJxOhRcU_2",
            r"What role does the Lipschitz condition on $f$ in the $y$ variable play?",
            r"The condition controls how much $f$ can change in $y$, which is what makes the operator shrink distances.",
            [
                C(r"It makes the Picard operator a contraction, which secures uniqueness", r"Yes. A Lipschitz bound limits how fast $f$ varies in $y$, turning the operator into a contraction."),
                W(r"It guarantees the solution exists for all time", r"Lipschitz control does not promise a global interval. What property of the operator does it provide?"),
                W(r"It forces $f$ to be linear in $y$", r"Lipschitz is far weaker than linear. What does it ensure about the Picard operator?"),
                W(r"It removes the need for $f$ to be continuous", r"Continuity is still needed for existence. What does the Lipschitz bound add about uniqueness?"),
            ],
        ),
        item(
            "mp_fsbVJxOhRcU_3",
            r"The interval of guaranteed existence in the Picard Lindelof theorem is typically what?",
            r"The proof bounds $f$ over a rectangle, and those bounds set how far the solution is guaranteed to extend.",
            [
                C(r"A possibly small interval determined by bounds on $f$ over a rectangle", r"Yes. The size depends on bounds for $f$ on a chosen rectangle, and may be short."),
                W(r"Always the entire real line", r"The result is local. What sets the limit on how far it reaches?"),
                W(r"Exactly one unit wide every time", r"No fixed width is promised. What quantity determines the interval length?"),
                W(r"Only the single point $x_{0}$", r"A solution lives on an interval, not a point. What governs the width of that interval?"),
            ],
        ),
        item(
            "mp_fsbVJxOhRcU_4",
            r"The function $f(x, y) = 3y$ is Lipschitz in $y$ with which constant $L$?",
            r"Find the smallest $L$ with $|f(x, y_{1}) - f(x, y_{2})| \le L\,|y_{1} - y_{2}|$.",
            [
                C(r"$L = 3$", r"Correct. $|3y_{1} - 3y_{2}| = 3|y_{1} - y_{2}|$, so $L = 3$ works."),
                W(r"$L = 1$", r"Factor the constant out of $|3y_{1} - 3y_{2}|$. What multiple of $|y_{1} - y_{2}|$ appears?"),
                W(r"$L = 0$", r"A zero constant would mean $f$ does not change with $y$, but $3y$ clearly does. What is the coefficient?"),
                W(r"There is no Lipschitz constant", r"This $f$ is perfectly linear in $y$. What constant bounds $|3y_{1} - 3y_{2}|$ over $|y_{1} - y_{2}|$?"),
            ],
        ),
        item(
            "mp_fsbVJxOhRcU_5",
            r"Why is the integral formulation preferred over the differential one in the proof?",
            r"Integration is a smoothing, bounded operation, and it already carries the initial value inside it.",
            [
                C(r"Integration is a smoothing, bounded operation suited to the contraction argument, and it builds in the initial condition", r"Yes. The integral operator is well behaved for the contraction estimates and encodes the starting value automatically."),
                W(r"Differentiation always diverges", r"Differentiation does not diverge in general. What makes the integral form better behaved for the estimates?"),
                W(r"The derivative of the solution does not exist", r"The solution is differentiable. Why is the integral form still more convenient for the proof?"),
                W(r"Integrals are always equal to zero", r"Integrals are generally nonzero. What useful properties of the integral operator does the proof rely on?"),
            ],
        ),
    ],
)


# ----------------------------------------------------------------------------
# UNIT MASTERY CONTENT, 30 items
# ----------------------------------------------------------------------------

MASTERY = [
    item(
        "um_3_1",
        r"For $\frac{dy}{dx} = f(x,y)$, a slope field places at each point of the plane which object?",
        r"A derivative value is a slope. What geometric mark carries a slope at a point?",
        [
            C(r"A short segment whose slope equals $f(x,y)$ there", r"Yes. The rule assigns a slope, drawn as a tiny tangent segment at each point."),
            W(r"A point at height $f(x,y)$", r"A slope is not a height. What does a derivative value represent geometrically?"),
            W(r"The area under the curve up to that point", r"Area comes from integration. What does $f(x,y)$ describe directly at the point?"),
            W(r"A circle of radius $f(x,y)$", r"The field encodes direction, not size. What single feature does a derivative set at a point?"),
        ],
    ),
    item(
        "um_3_2",
        r"For $\frac{dy}{dx} = x - y$, what is the slope of the field at $(2, 1)$?",
        r"Substitute the coordinates into $x - y$.",
        [
            C(r"$1$", r"Correct. $f(2,1) = 2 - 1 = 1$."),
            W(r"$3$", r"That is $x + y$. Re read the sign between the terms. Are they added or subtracted?"),
            W(r"$-1$", r"Check the order. Is it $x - y$ or $y - x$?"),
            W(r"$2$", r"That uses only $x$. The rule subtracts $y$ as well. What is $2 - 1$?"),
        ],
    ),
    item(
        "um_3_3",
        r"For $\frac{dy}{dx} = x - y$, the isocline of slope $0$ is which line?",
        r"Set $x - y = 0$ and solve for $y$.",
        [
            C(r"$y = x$", r"Correct. $x - y = 0$ gives $y = x$, where every segment is flat."),
            W(r"$y = -x$", r"Watch the sign solving $x - y = 0$. Does $y$ equal $x$ or its negative?"),
            W(r"$x = 0$", r"That fixes only $x$. The condition links both variables. What line is it?"),
            W(r"$y = 0$", r"Setting $y = 0$ does not satisfy $x - y = 0$ generally. Solve the full equation."),
        ],
    ),
    item(
        "um_3_4",
        r"An integral curve of a slope field is best described as what?",
        r"Think about how a solution relates to the segments along its path.",
        [
            C(r"A solution curve tangent to the field segments at every point it crosses", r"Yes. The curve matches the prescribed slope everywhere it goes."),
            W(r"A curve where the slope is always zero", r"That is one special isocline. Does a general solution stay flat everywhere?"),
            W(r"The vertical line where $f$ is undefined", r"Solutions are generally not vertical lines. What must the curve do with the segments?"),
            W(r"The set of points where $f(x,y) = 1$", r"That is a single isocline. What relationship does a solution keep with the segments throughout?"),
        ],
    ),
    item(
        "um_3_5",
        r"If $\frac{dy}{dx}$ depends only on $y$, how do the slopes of the field behave?",
        r"Ask which variable the rule ignores, and along which lines that variable stays fixed.",
        [
            C(r"They are constant along horizontal lines, the same for all $x$ at a fixed $y$", r"Yes. Ignoring $x$ means equal slopes at equal heights."),
            W(r"They are constant along vertical lines", r"Vertical lines fix $x$, but the rule uses $y$. Which lines hold $y$ constant?"),
            W(r"They are zero everywhere", r"An autonomous rule is not always zero. It only ignores $x$. What stays constant as $x$ varies?"),
            W(r"They increase as $x$ increases", r"The rule does not see $x$ at all. Along which direction is the slope unchanged?"),
        ],
    ),
    item(
        "um_3_6",
        r"For $\frac{dy}{dx} = y - x^{2}$, the isocline of slope $1$ is which curve?",
        r"Set $y - x^{2} = 1$ and solve for $y$.",
        [
            C(r"$y = x^{2} + 1$", r"Correct. $y - x^{2} = 1$ rearranges to $y = x^{2} + 1$."),
            W(r"$y = x^{2} - 1$", r"Move the constant carefully. Add or subtract $1$ when solving $y - x^{2} = 1$?"),
            W(r"$y = x^{2}$", r"That is the isocline of slope zero. What constant should the expression equal for slope one?"),
            W(r"$y = 1 - x^{2}$", r"Check the sign on $x^{2}$ after isolating $y$. Is it added or subtracted?"),
        ],
    ),
    item(
        "um_3_7",
        r"In the phase plane of a system, a single point represents what?",
        r"The axes are dependent variables, not time. What does one choice of those values describe?",
        [
            C(r"A complete state of the system at one instant", r"Yes. The coordinates fix every dependent variable at a moment."),
            W(r"The value of time $t$", r"Time is not plotted in the phase plane. What do the axes measure?"),
            W(r"A slope of the solution", r"A point is a location, not a slope. What do its coordinates record?"),
            W(r"The energy of the system", r"Energy is a derived quantity. What do the raw coordinates directly give?"),
        ],
    ),
    item(
        "um_3_8",
        r"For the system $x' = y$, $y' = -x$, the equilibrium point is where?",
        r"Set both right sides to zero and solve together.",
        [
            C(r"$(0, 0)$", r"Correct. $y = 0$ and $-x = 0$ force the origin."),
            W(r"$(1, 1)$", r"Test it in $x' = y$. Is the derivative zero there?"),
            W(r"$(0, 1)$", r"Check $x' = y$ at this point. Is it zero when $y = 1$?"),
            W(r"There is none", r"Can both $y = 0$ and $x = 0$ hold at once? What point is that?"),
        ],
    ),
    item(
        "um_3_9",
        r"For $x' = x - y$, $y' = x + y$, the $x$ nullcline (where $x' = 0$) is which line?",
        r"Set the $x'$ expression to zero and solve.",
        [
            C(r"$y = x$", r"Correct. $x - y = 0$ gives $y = x$."),
            W(r"$y = -x$", r"Mind the sign in $x - y = 0$. Does $y$ equal $x$ or its negative?"),
            W(r"$x = 0$", r"That uses one variable only. The condition relates both. What line results?"),
            W(r"$y = 0$", r"Setting $y = 0$ does not satisfy $x - y = 0$ in general. Solve it fully."),
        ],
    ),
    item(
        "um_3_10",
        r"A phase portrait is best described as what?",
        r"It is a picture showing the overall landscape, not just one path.",
        [
            C(r"A representative collection of trajectories drawn in the phase plane", r"Yes. Several orbits together reveal the global behavior."),
            W(r"A single trajectory through one point", r"One curve is one history. What does a portrait gather?"),
            W(r"A graph of one variable against time", r"That is a time plot. What does the portrait collect in the phase plane?"),
            W(r"A list of equilibrium points only", r"Equilibria are part of it, but the portrait shows motion too. What does it assemble?"),
        ],
    ),
    item(
        "um_3_11",
        r"If both eigenvalues of a linear system are real and positive, the origin is what type?",
        r"Positive growth rates push solutions away.",
        [
            C(r"An unstable node, a source", r"Yes. Trajectories grow away along both eigendirections."),
            W(r"A stable node", r"Stability needs decay. What do positive growth rates do?"),
            W(r"A saddle", r"A saddle needs opposite signs. What happens when both are positive?"),
            W(r"A center", r"A center comes from imaginary eigenvalues. What do two positive reals give?"),
        ],
    ),
    item(
        "um_3_12",
        r"A saddle point at the origin occurs when the eigenvalues are which kind?",
        r"A saddle pulls in along one direction and pushes out along another.",
        [
            C(r"Real with opposite signs", r"Yes. One negative direction draws in, one positive pushes out."),
            W(r"Both negative", r"Two negatives pull everything in. Where is the outward direction?"),
            W(r"Both positive", r"Two positives push everything out. Where is the inward direction?"),
            W(r"Purely imaginary", r"Those give closed orbits. What sign pattern makes one inflow and one outflow?"),
        ],
    ),
    item(
        "um_3_13",
        r"For the linear system $x' = y$, $y' = -x$ with eigenvalues $\pm i$, the origin is what?",
        r"Purely imaginary eigenvalues mean rotation with no growth or decay.",
        [
            C(r"A center, with closed orbits around the origin", r"Yes. No real part means constant amplitude, so orbits close."),
            W(r"A stable spiral", r"A spiral needs a negative real part. What is the real part of $\pm i$?"),
            W(r"A saddle", r"A saddle needs real eigenvalues of opposite sign. What do imaginary ones give?"),
            W(r"An unstable node", r"A node comes from real eigenvalues. What motion do imaginary ones produce?"),
        ],
    ),
    item(
        "um_3_14",
        r"For the decoupled system $x' = -2x$, $y' = -5y$, what are the eigenvalues, and what is the origin?",
        r"The coefficient matrix is diagonal, so read the eigenvalues off the coefficients, then note both signs.",
        [
            C(r"$-2$ and $-5$, a stable node", r"Yes. Both eigenvalues are negative, so trajectories decay into the origin."),
            W(r"$-2$ and $-5$, an unstable node", r"Negative eigenvalues mean decay. Does that push out or pull in?"),
            W(r"$2$ and $5$, a stable node", r"Check the signs on the diagonal. Are the entries positive or negative?"),
            W(r"$-2$ and $-5$, a saddle", r"A saddle needs opposite signs. Are both of these the same sign?"),
        ],
    ),
    item(
        "um_3_15",
        r"The existence and uniqueness theorem guarantees a unique solution near $(x_{0}, y_{0})$ when which conditions hold?",
        r"Two continuity conditions, one on $f$ and one on a partial derivative.",
        [
            C(r"Both $f$ and $\frac{\partial f}{\partial y}$ are continuous on a rectangle containing the point", r"Yes. Continuity of $f$ gives existence and continuity of the derivative gives uniqueness."),
            W(r"Only $f$ is defined at the point", r"One point tells you nothing about nearby behavior. What must hold on a rectangle?"),
            W(r"The equation is separable", r"Separability is not required. What two continuity conditions does the theorem use?"),
            W(r"The initial value is positive", r"The sign of $y_{0}$ is irrelevant. What continuity conditions matter?"),
        ],
    ),
    item(
        "um_3_16",
        r"If $f$ is continuous near a point but $\frac{\partial f}{\partial y}$ is not, what does the theorem still guarantee?",
        r"Separate the two conclusions. One follows from continuity of $f$ alone.",
        [
            C(r"At least one solution exists, though uniqueness may fail", r"Yes. Continuity of $f$ secures existence by itself."),
            W(r"Uniqueness but not existence", r"Continuity of $f$ is the existence condition. Which conclusion needs the derivative condition?"),
            W(r"Both existence and uniqueness", r"A hypothesis is missing. Which conclusion depends on $\frac{\partial f}{\partial y}$?"),
            W(r"Neither", r"Continuity of $f$ still buys something. Which conclusion survives?"),
        ],
    ),
    item(
        "um_3_17",
        r"For $y' = y^{1/3}$ with $y(0) = 0$, uniqueness fails at the origin because of which fact?",
        r"Examine $\frac{\partial f}{\partial y}$ near $y = 0$.",
        [
            C(r"$\frac{\partial f}{\partial y} = \frac{1}{3} y^{-2/3}$ is not continuous at $y = 0$", r"Yes. The derivative condition breaks at the origin, so uniqueness is lost."),
            W(r"$f$ itself is discontinuous at $0$", r"Check $f = y^{1/3}$ at $0$. Is it the function or its derivative that misbehaves?"),
            W(r"The starting value is negative", r"It is zero, not negative. Which quantity fails to be continuous?"),
            W(r"The equation has no solution at all", r"At least $y = 0$ solves it. What fails is uniqueness. Why?"),
        ],
    ),
    item(
        "um_3_18",
        r"For $y' = \frac{x}{y - 1}$, where does the theorem fail to guarantee a unique solution?",
        r"Find where the denominator vanishes.",
        [
            C(r"Along the line $y = 1$", r"Yes. The denominator is zero there, so $f$ and its derivative are not continuous."),
            W(r"Along $x = 0$", r"At $x = 0$ the function is well behaved. Where does the denominator cause trouble?"),
            W(r"At the origin only", r"It is a whole line, not one point. Which $y$ makes the denominator zero?"),
            W(r"Nowhere", r"Look at $y - 1$. What value of $y$ makes the expression blow up?"),
        ],
    ),
    item(
        "um_3_19",
        r"In a region where the hypotheses hold, what does uniqueness imply about two distinct solution curves?",
        r"A shared point would mean two solutions through it. What does that contradict?",
        [
            C(r"They cannot cross there", r"Yes. A crossing would violate the one solution per point guarantee."),
            W(r"They may cross at right angles", r"The angle is irrelevant. What does a shared point imply?"),
            W(r"They must be parallel", r"Solutions need not be parallel. What is forbidden is intersection. Why?"),
            W(r"They can touch but not cross", r"Even touching is a shared point. What does uniqueness forbid entirely?"),
        ],
    ),
    item(
        "um_3_20",
        r"For the linear problem $y' + p(x) y = q(x)$ with $p$ and $q$ continuous on an interval $I$ containing $x_{0}$, the solution exists and is unique on which set?",
        r"The linear theorem gives a global guarantee across the interval of continuity.",
        [
            C(r"The entire interval $I$", r"Yes. The unique solution extends across the whole interval where the coefficients are continuous."),
            W(r"Only a small neighborhood of $x_{0}$", r"That is the weaker general result. What does linearity give over $I$?"),
            W(r"Only where $q(x) = 0$", r"The forcing term may be nonzero. Where does continuity of the coefficients let the solution live?"),
            W(r"Nowhere guaranteed", r"Continuity of $p$ and $q$ guarantees a lot here. Over what set?"),
        ],
    ),
    item(
        "um_3_21",
        r"A fixed point of a function $g$ satisfies which equation?",
        r"A fixed point is left unchanged by $g$.",
        [
            C(r"$g(x^{*}) = x^{*}$", r"Yes. Applying $g$ returns the same value."),
            W(r"$g'(x^{*}) = 0$", r"That is a critical point about slope. What does a fixed point require of the value?"),
            W(r"$g(x^{*}) = 0$", r"That is a root. A fixed point asks the output to match what?"),
            W(r"$x^{*} = 1$", r"Fixed points are not tied to a specific number. What relation defines them?"),
        ],
    ),
    item(
        "um_3_22",
        r"Find the fixed point of $g(x) = \frac{x}{3} + 2$.",
        r"Set $g(x) = x$ and solve.",
        [
            C(r"$x = 3$", r"Correct. $x = \frac{x}{3} + 2$ gives $\frac{2x}{3} = 2$, so $x = 3$."),
            W(r"$x = 2$", r"The constant alone is not the answer. Solve $\frac{2x}{3} = 2$ for $x$."),
            W(r"$x = 6$", r"Recheck the algebra. After $\frac{2x}{3} = 2$, what is $x$?"),
            W(r"$x = 0$", r"Test $x = 0$ in $g$. Does it return $0$? Solve $g(x) = x$ instead."),
        ],
    ),
    item(
        "um_3_23",
        r"A fixed point $x^{*}$ of $x_{n+1} = g(x_{n})$ is attracting when which condition holds?",
        r"Nearby points should move closer each step, controlled by the steepness of $g$.",
        [
            C(r"$|g'(x^{*})| < 1$", r"Yes. A slope magnitude below one shrinks distances toward the point."),
            W(r"$|g'(x^{*})| > 1$", r"A larger slope stretches distances. Does that attract or repel?"),
            W(r"$g'(x^{*}) = 1$", r"At exactly one the behavior is borderline, not attracting in general. What range pulls points in?"),
            W(r"$g(x^{*}) = 0$", r"That is about the value, not the slope. What must $|g'(x^{*})|$ satisfy?"),
        ],
    ),
    item(
        "um_3_24",
        r"For $g(x) = x^{2}$, classify the stability of its fixed points.",
        r"Solve $x = x^{2}$, then test $|g'(x)| = |2x|$ at each.",
        [
            C(r"$x = 0$ is attracting and $x = 1$ is repelling", r"Yes. $|g'(0)| = 0 < 1$ attracts and $|g'(1)| = 2 > 1$ repels."),
            W(r"Both are attracting", r"Evaluate $|2x|$ at each fixed point. Is it below one at both?"),
            W(r"Both are repelling", r"Check $|g'(0)|$. Is the slope at the origin above one?"),
            W(r"$x = 1$ attracting and $x = 0$ repelling", r"You may have swapped them. Compare $|2 \cdot 0|$ and $|2 \cdot 1|$ to one."),
        ],
    ),
    item(
        "um_3_25",
        r"Graphically, the fixed points of $g$ lie where which two graphs meet?",
        r"A fixed point has output equal to input. Which line encodes that?",
        [
            C(r"The graph of $y = g(x)$ and the line $y = x$", r"Yes. On $y = x$ the output equals the input."),
            W(r"The graph of $g$ and the $x$ axis", r"That marks roots, where $g = 0$. Which line means output equals input?"),
            W(r"The graph of $g$ and the $y$ axis", r"That gives the intercept only. Which line captures the fixed point condition?"),
            W(r"The graph of $g$ and its tangent line", r"A tangent does not define fixed points. Which line means input equals output?"),
        ],
    ),
    item(
        "um_3_26",
        r"A function $g$ is a contraction if there is a constant $0 \le k < 1$ with which property for all $x$ and $y$?",
        r"A contraction shrinks the distance between any two points by a fixed factor.",
        [
            C(r"$|g(x) - g(y)| \le k\,|x - y|$", r"Yes. Outputs are closer than inputs by the factor $k < 1$."),
            W(r"$|g(x) - g(y)| \ge k\,|x - y|$", r"That preserves or grows distances. A contraction does the opposite. Which way is the inequality?"),
            W(r"$|g(x) - g(y)| = |x - y|$", r"Equality means distances are preserved, the borderline case. What strict shrinking does a contraction need?"),
            W(r"$|g(x)| \le k$ for all $x$", r"That bounds values, not distances between pairs. What does a contraction control?"),
        ],
    ),
    item(
        "um_3_27",
        r"The Banach fixed point theorem guarantees what for a contraction on a complete space?",
        r"It speaks to how many fixed points exist and from where the iteration converges.",
        [
            C(r"Exactly one fixed point, reached by iteration from any start", r"Yes. A unique fixed point exists and every start converges to it."),
            W(r"At least one fixed point, possibly several", r"A contraction cannot have two. Why does uniqueness follow?"),
            W(r"Convergence only from nearby starts", r"Convergence is global on a complete space. From which starts does it converge?"),
            W(r"A fixed point only if $g$ is linear", r"Linearity is not required. What does the contraction property alone provide?"),
        ],
    ),
    item(
        "um_3_28",
        r"Picard iteration rewrites $y' = f(x,y)$, $y(x_{0}) = y_{0}$ as which equivalent equation?",
        r"Integrate from $x_{0}$ to $x$ and apply the initial condition.",
        [
            C(r"$y(x) = y_{0} + \int_{x_{0}}^{x} f(t, y(t))\,dt$", r"Yes. Integrating the derivative and using the initial value gives this integral equation."),
            W(r"$y(x) = y_{0} + f(x, y)$", r"That has no integral and is not equivalent. What operation undoes the derivative?"),
            W(r"$f(x, y) = 0$", r"That seeks equilibria, not the solution. What integral form preserves the equation?"),
            W(r"$y(x) = y_{0} \cdot f(x, y)$", r"There is no product here. What comes from integrating both sides?"),
        ],
    ),
    item(
        "um_3_29",
        r"For $y' = y$, $y(0) = 1$, with $\varphi_{0} = 1$, what is the first Picard iterate $\varphi_{1}(x)$?",
        r"Compute $1 + \int_{0}^{x} 1\,dt$.",
        [
            C(r"$1 + x$", r"Correct. $\varphi_{1} = 1 + \int_{0}^{x} 1\,dt = 1 + x$."),
            W(r"$e^{x}$", r"That is the final limit, not the first iterate. What does one integration of $1$ give?"),
            W(r"$1$", r"You must add the integral term. What is $\int_{0}^{x} 1\,dt$?"),
            W(r"$x$", r"Do not drop the initial value $1$. The formula adds it to the integral. What is the sum?"),
        ],
    ),
    item(
        "um_3_30",
        r"The Picard Lindelof theorem proves existence and uniqueness using which tool, with which condition on $f$ ensuring uniqueness?",
        r"A contraction principle drives the proof, and a bound on how fast $f$ varies in $y$ gives uniqueness.",
        [
            C(r"The Banach contraction principle, with a Lipschitz condition on $f$ in $y$", r"Yes. The Picard operator is a contraction once $f$ is Lipschitz in $y$, giving a unique solution."),
            W(r"Eigenvalue decomposition, with $f$ linear", r"That belongs to linear systems and is not needed. What principle and condition does Picard Lindelof use?"),
            W(r"The chain rule, with $f$ differentiable in $x$", r"The chain rule is not the engine. What contraction based tool and condition apply?"),
            W(r"Separation of variables, with $f$ separable", r"Separability is not required. What general principle and Lipschitz condition power the proof?"),
        ],
    ),
]


# ----------------------------------------------------------------------------
# EMIT
# ----------------------------------------------------------------------------

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

    # --- splice micro_practice ---
    micro_marker = "        ]\n\n    },\n\n    unit_mastery: {"
    assert src.count(micro_marker) == 1, "micro marker not unique"
    micro_new = build_micro_js()
    micro_replacement = "        ],\n\n" + micro_new + "\n\n    },\n\n    unit_mastery: {"
    src = src.replace(micro_marker, micro_replacement)

    # --- splice unit_mastery (end of file) ---
    end_marker = "        ]\n\n    }\n\n};"
    assert src.count(end_marker) == 1, "end marker not unique"
    unit_new = emit_unit_block(UNIT_TITLE, MASTERY)
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
    data["unit_mastery"][UNIT_TITLE] = [strip_item(it) for it in MASTERY]

    with open(JSON_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print("[+] quizzes.json mirror updated")


def validate():
    # No em dashes, no ampersands in user facing strings.
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
    for it in MASTERY:
        check(it["prompt"], it["id"] + ".prompt")
        check(it["hint"], it["id"] + ".hint")
        for o in it["answerOptions"]:
            check(o["text"], it["id"] + ".text")
            check(o["rationale"], it["id"] + ".rationale")
    # Exactly one correct per item.
    def one_correct(its, label):
        for it in its:
            n = sum(1 for o in it["answerOptions"] if o.get("correct"))
            assert n == 1, "%s %s has %d correct" % (label, it["id"], n)
            assert len(it["answerOptions"]) == 4, "%s %s not 4 options" % (label, it["id"])
    for (v, c, its) in MICRO:
        assert len(its) == 5, "%s not 5 items" % v
        one_correct(its, "micro")
    assert len(MASTERY) == 30, "mastery not 30 items"
    one_correct(MASTERY, "mastery")
    if bad:
        for where, s in bad:
            print("[!] FORBIDDEN CHAR in", where, "->", s)
        raise SystemExit("Validation failed: forbidden characters present")
    print("[+] validation passed: %d micro videos, %d mastery items, copy rules OK" % (len(MICRO), len(MASTERY)))


if __name__ == "__main__":
    validate()
    update_js()
    update_json()
    print("[+] Unit 3 quiz generation complete")
