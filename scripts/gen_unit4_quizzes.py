#!/usr/bin/env python3
"""
Generate Unit 4 (Autonomous Equations, Equilibrium Solutions, and Stability)
interactive quizzes.

Authors the 12 video micro-practice quizzes (five items each) and the 30 item
Unit 4 mastery quiz as a single Python source of truth, then:
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

UNIT_TITLE = "Unit 4: Autonomous Equations, Equilibrium Solutions, and Stability"


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


# === 4.1 video 1 ============================================================
add_micro(
    "7q33RFkMMpY",
    'Unit 4, Module 4.1, video 1\n           "Equilibrium Solutions and Stability of Differential Equations (Differential Equations 36)"',
    [
        item(
            "mp_7q33RFkMMpY_1",
            r"For $\frac{dy}{dt} = f(y)$, an equilibrium solution is a constant $y = c$ satisfying which condition?",
            r"A constant solution never changes, so think about what its derivative must equal.",
            [
                C(r"$f(c) = 0$, so the rate of change is zero there", r"Yes. Where $f(c) = 0$ the derivative vanishes, so the solution stays put forever."),
                W(r"$f'(c) = 0$", r"That sets the slope of $f$ to zero, not the rate of change of $y$. What must $\frac{dy}{dt}$ equal for a constant solution?"),
                W(r"$c = 0$ always", r"Equilibria need not sit at the origin. What equation must the constant satisfy in terms of $f$?"),
                W(r"$f(c) = c$", r"That is a fixed point condition for a map, not an equilibrium of this rate equation. What value must $f$ take for $y$ to stay constant?"),
            ],
        ),
        item(
            "mp_7q33RFkMMpY_2",
            r"Find all equilibrium solutions of $\frac{dy}{dt} = y(y - 3)$.",
            r"Set the right side equal to zero and solve the resulting product equation.",
            [
                C(r"$y = 0$ and $y = 3$", r"Correct. The product $y(y - 3)$ is zero exactly when $y = 0$ or $y = 3$."),
                W(r"$y = 3$ only", r"A product is zero when either factor is zero. What value of $y$ makes the first factor vanish?"),
                W(r"$y = -3$ and $y = 0$", r"Check the sign in the factor $y - 3$. Which value of $y$ makes it zero?"),
                W(r"There are no equilibria", r"Set $y(y - 3) = 0$. Can a product of two terms be zero? Which values do that?"),
            ],
        ),
        item(
            "mp_7q33RFkMMpY_3",
            r"For $\frac{dy}{dt} = y - 2$, classify the equilibrium at $y = 2$ using the sign of the rate just off it.",
            r"Check $\frac{dy}{dt}$ slightly above and slightly below $y = 2$. Do solutions head toward or away from it?",
            [
                C(r"Unstable, since $\frac{dy}{dt} > 0$ above and $< 0$ below, pushing solutions away", r"Yes. Above $2$ the rate is positive and below it is negative, so nearby solutions move away."),
                W(r"Stable, since solutions return to $y = 2$", r"Test $y = 3$, where $\frac{dy}{dt} = 1 > 0$. Does that move toward or away from $2$?"),
                W(r"Semi-stable", r"Semi-stable needs the same sign on both sides. Here the sign flips across $y = 2$. What does a sign flip away from the point indicate?"),
                W(r"It cannot be classified without solving the equation", r"The sign of $y - 2$ near $y = 2$ is enough. What is the sign just above and just below?"),
            ],
        ),
        item(
            "mp_7q33RFkMMpY_4",
            r"An equilibrium $y = c$ is asymptotically stable when nearby solutions do what over time?",
            r"Stability is about whether a small nudge fades away or grows.",
            [
                C(r"They move back toward $c$ as $t$ increases", r"Yes. A stable equilibrium attracts nearby solutions, so small perturbations decay."),
                W(r"They move away from $c$ as $t$ increases", r"That describes the opposite behavior. Which direction do solutions go near a stable rest state?"),
                W(r"They stay exactly at their starting value", r"Only the equilibrium itself is constant. What do solutions starting slightly off a stable point do?"),
                W(r"They oscillate forever without settling", r"A scalar autonomous equation has no oscillation about a point. What must nearby solutions do for stability?"),
            ],
        ),
        item(
            "mp_7q33RFkMMpY_5",
            r"For $\frac{dy}{dt} = (y - 1)(y + 2)$, find the equilibria and classify $y = 1$.",
            r"Solve for the equilibria, then test the sign of the rate just above and below $y = 1$.",
            [
                C(r"Equilibria $y = 1$ and $y = -2$, and $y = 1$ is unstable", r"Yes. Just above $y = 1$ both factors are positive so the rate is positive, pushing solutions away."),
                W(r"Equilibria $y = 1$ and $y = -2$, and $y = 1$ is stable", r"Test $y = 1.1$. Both factors are positive there, so what is the sign of the rate, and which way does it push?"),
                W(r"Equilibria $y = -1$ and $y = 2$", r"Read the factors carefully. Which values of $y$ make $y - 1$ and $y + 2$ vanish?"),
                W(r"Only $y = 1$ is an equilibrium", r"A product of two factors gives two roots. What value makes $y + 2$ zero as well?"),
            ],
        ),
    ],
)

# === 4.1 video 2 ============================================================
add_micro(
    "NmntYoB1uJg",
    'Unit 4, Module 4.1, video 2\n           "The Stability and Instability of Steady States"',
    [
        item(
            "mp_NmntYoB1uJg_1",
            r"A steady state of $\frac{dy}{dt} = f(y)$ is called stable when a small perturbation does what?",
            r"Picture nudging the system slightly off the rest value. Stability asks what happens next.",
            [
                C(r"It decays, so the system returns to the steady state", r"Yes. A stable steady state pulls small disturbances back to itself."),
                W(r"It grows without bound", r"Unbounded growth of a disturbance is the hallmark of instability. What happens to the nudge at a stable state?"),
                W(r"It stays the same size forever", r"A constant size disturbance is the borderline case, not stability. What must the perturbation do to call the state stable?"),
                W(r"It instantly jumps to a different steady state", r"Solutions move continuously, not by jumps. What does a small perturbation do near a stable point?"),
            ],
        ),
        item(
            "mp_NmntYoB1uJg_2",
            r"The linearization test classifies a steady state $y^{*}$ of $\frac{dy}{dt} = f(y)$ using which quantity?",
            r"Near $y^{*}$ the equation behaves like its tangent. The slope of $f$ at $y^{*}$ controls the local behavior.",
            [
                C(r"The sign of $f'(y^{*})$, stable if negative and unstable if positive", r"Yes. A negative slope of $f$ at the steady state forces nearby disturbances to shrink."),
                W(r"The sign of $f(y^{*})$ itself", r"At a steady state $f(y^{*}) = 0$ by definition, so its sign gives nothing. What derivative carries the information?"),
                W(r"The value of $y^{*}$, stable if positive", r"The location of the state does not set its stability. Which derivative of $f$ does?"),
                W(r"The second derivative $f''(y^{*})$ only", r"The leading test uses the first derivative. What sign of $f'(y^{*})$ signals stability?"),
            ],
        ),
        item(
            "mp_NmntYoB1uJg_3",
            r"If $f(y^{*}) = 0$ and $f'(y^{*}) < 0$, the steady state $y^{*}$ is which kind?",
            r"A negative slope of $f$ means the rate opposes any displacement.",
            [
                C(r"Stable, since the rate pushes $y$ back toward $y^{*}$", r"Yes. With $f' < 0$, moving above $y^{*}$ gives a negative rate and moving below gives a positive rate, both restoring."),
                W(r"Unstable", r"A negative slope opposes displacement. Does opposing a nudge push the system away or back?"),
                W(r"Semi-stable", r"Semi-stable arises when $f$ touches zero without changing sign. Does a strict negative slope create that?"),
                W(r"Undetermined by this information", r"A nonzero $f'(y^{*})$ settles the question. What does a negative slope imply about returning to $y^{*}$?"),
            ],
        ),
        item(
            "mp_NmntYoB1uJg_4",
            r"For $\frac{dy}{dt} = y - y^{3}$, classify the steady state $y = 1$ using $f'(y)$.",
            r"Compute $f'(y) = 1 - 3y^{2}$ and evaluate its sign at $y = 1$.",
            [
                C(r"Stable, because $f'(1) = 1 - 3 = -2 < 0$", r"Yes. The negative slope at $y = 1$ makes the steady state stable."),
                W(r"Unstable, because $f'(1) > 0$", r"Recompute $f'(1) = 1 - 3(1)^{2}$. Is the result positive or negative?"),
                W(r"Semi-stable, because $f'(1) = 0$", r"Evaluate $1 - 3(1)^{2}$. Does it actually equal zero at $y = 1$?"),
                W(r"Stable, because $f(1) = 0$ and that is enough", r"Vanishing of $f$ only marks the steady state. Which derivative decides its stability, and what is its sign here?"),
            ],
        ),
        item(
            "mp_NmntYoB1uJg_5",
            r"A steady state where $f$ touches zero but does not change sign across it is described as what?",
            r"Think of a double root, where the rate has the same sign on both sides of the point.",
            [
                C(r"Semi-stable, attracting from one side and repelling from the other", r"Yes. With the same sign on both sides, solutions approach from one direction and leave on the other."),
                W(r"Fully stable from both sides", r"Full stability needs the rate to point back from both sides. Does the same sign on both sides do that?"),
                W(r"Fully unstable from both sides", r"Full instability needs the rate to point away on both sides. Does a constant sign produce that here?"),
                W(r"Not an equilibrium at all", r"The rate is still zero at the point, so it is an equilibrium. What special name fits when the sign does not flip?"),
            ],
        ),
    ],
)

# === 4.2 video 1 ============================================================
add_micro(
    "pZOmToxx-R8",
    'Unit 4, Module 4.2, video 1\n           "Autonomous Equations, Equilibrium Solutions, and Stability"',
    [
        item(
            "mp_pZOmToxx-R8_1",
            r"What makes a first order equation $\frac{dy}{dt} = f(t, y)$ autonomous?",
            r"Look at which variables the right side actually uses.",
            [
                C(r"The right side depends only on $y$, not explicitly on $t$", r"Yes. An autonomous equation has the form $\frac{dy}{dt} = f(y)$, with no explicit time dependence."),
                W(r"The right side depends only on $t$, not on $y$", r"That would make the equation a direct integration in $t$. Which variable must the rule depend on alone to be autonomous?"),
                W(r"The equation is linear in $y$", r"Autonomy is about variable dependence, not linearity. Which variable may not appear explicitly on the right?"),
                W(r"The solution is always constant", r"Autonomous equations have plenty of nonconstant solutions. What restriction on the right side defines the term?"),
            ],
        ),
        item(
            "mp_pZOmToxx-R8_2",
            r"On the phase line for $\frac{dy}{dt} = y - 4$, which way does the arrow point at $y = 5$?",
            r"Evaluate the rate at $y = 5$. A positive rate means $y$ is increasing.",
            [
                C(r"Upward, since $\frac{dy}{dt} = 1 > 0$ there", r"Yes. At $y = 5$ the rate is positive, so $y$ increases and the arrow points up."),
                W(r"Downward, since the rate is negative", r"Compute $5 - 4$. Is that value negative, or positive?"),
                W(r"It does not move, since $y = 5$ is an equilibrium", r"Check whether $5 - 4$ equals zero. Is $y = 5$ actually an equilibrium?"),
                W(r"Sideways, with no vertical direction", r"The phase line tracks whether $y$ rises or falls. What does a positive rate mean for the direction?"),
            ],
        ),
        item(
            "mp_pZOmToxx-R8_3",
            r"For an autonomous equation, the phase line is drawn along which axis?",
            r"The phase line displays the states of the system, which are the values of the dependent variable.",
            [
                C(r"The $y$ axis, the line of all possible values of the dependent variable", r"Yes. The phase line is the $y$ axis with arrows showing where $y$ increases or decreases."),
                W(r"The $t$ axis, the line of time values", r"Time is not displayed on the phase line. Which variable holds the states of the system?"),
                W(r"A diagonal line through the origin", r"The phase line is one straight axis of states. Which single variable does it represent?"),
                W(r"The horizontal axis of a slope field", r"A slope field is a different picture in the $t y$ plane. The phase line collapses onto which single axis?"),
            ],
        ),
        item(
            "mp_pZOmToxx-R8_4",
            r"For $\frac{dy}{dt} = 2 - y$, find the equilibrium and the direction of motion at $y = 0$.",
            r"Solve $2 - y = 0$, then evaluate the rate at $y = 0$ to see which way it heads.",
            [
                C(r"Equilibrium $y = 2$, and at $y = 0$ the rate is $2 > 0$, so $y$ increases toward $2$", r"Yes. The equilibrium is $y = 2$, and below it the positive rate carries solutions up toward it, making it stable."),
                W(r"Equilibrium $y = 2$, and at $y = 0$ the rate is negative", r"Evaluate $2 - 0$. Is that value negative, or positive?"),
                W(r"Equilibrium $y = -2$, and at $y = 0$ the rate is positive", r"Solve $2 - y = 0$ carefully. Does $y$ equal $2$ or $-2$?"),
                W(r"There is no equilibrium", r"Set $2 - y = 0$. Is there a value of $y$ that makes the rate vanish?"),
            ],
        ),
        item(
            "mp_pZOmToxx-R8_5",
            r"Why are all solution curves of an autonomous equation horizontal time shifts of one another?",
            r"If $y(t)$ solves the equation, consider whether $y(t - c)$ solves it too, since the rule does not depend on $t$.",
            [
                C(r"Because the rule does not depend on $t$, shifting a solution in time gives another solution", r"Yes. Time invariance of the right side means $y(t - c)$ is also a solution, so the graphs are horizontal shifts."),
                W(r"Because every solution is a straight line", r"Solutions are generally curved, not straight. What property of the right side makes time shifting work?"),
                W(r"Because the equation has only one solution", r"There is a whole family of solutions. What feature lets a shifted solution remain a solution?"),
                W(r"Because $t$ appears explicitly in the rule", r"Autonomous means $t$ does not appear explicitly. How does that absence permit horizontal shifting?"),
            ],
        ),
    ],
)

# === 4.2 video 2 ============================================================
add_micro(
    "swt-let4pCI",
    'Unit 4, Module 4.2, video 2\n           "ODE Phase diagrams"',
    [
        item(
            "mp_swt-let4pCI_1",
            r"On a phase line, an equilibrium with arrows pointing toward it from both sides is called what?",
            r"Arrows converging on a point mean nearby solutions are drawn in.",
            [
                C(r"A stable equilibrium, also called a sink", r"Yes. Arrows pointing inward from both sides pull solutions in, the signature of a sink."),
                W(r"An unstable equilibrium, also called a source", r"A source has arrows pointing away. Which way do the arrows point here, inward or outward?"),
                W(r"A semi-stable equilibrium", r"Semi-stable mixes one inward and one outward arrow. Do both arrows here point the same way or opposite ways?"),
                W(r"Not an equilibrium, since arrows surround it", r"The arrows surround it precisely because the rate is zero at the point. What do two inward arrows make it?"),
            ],
        ),
        item(
            "mp_swt-let4pCI_2",
            r"An equilibrium with arrows pointing away from it on both sides is which type?",
            r"Diverging arrows mean nearby solutions are pushed out.",
            [
                C(r"Unstable, a source", r"Yes. Arrows pointing outward on both sides drive solutions away, the signature of a source."),
                W(r"Stable, a sink", r"A sink pulls solutions inward. Do the arrows here converge or diverge?"),
                W(r"Semi-stable", r"Semi-stable has one inward and one outward arrow. Do both arrows here point outward?"),
                W(r"A center with closed orbits", r"Centers belong to systems in the plane, not a single phase line. What do two outward arrows indicate?"),
            ],
        ),
        item(
            "mp_swt-let4pCI_3",
            r"For $\frac{dy}{dt} = y^{2} - 4$, what is the sign of the rate for $y$ strictly between $-2$ and $2$?",
            r"Pick a test value such as $y = 0$ and evaluate $y^{2} - 4$.",
            [
                C(r"Negative, for example at $y = 0$ the rate is $-4$", r"Yes. Between the roots $y^{2} < 4$, so $y^{2} - 4 < 0$ throughout that interval."),
                W(r"Positive throughout", r"Test $y = 0$, giving $0 - 4$. Is that value positive?"),
                W(r"Zero throughout", r"The rate is zero only at the roots $y = \pm 2$. What sign does $y = 0$ give between them?"),
                W(r"It changes sign at $y = 0$", r"The sign only flips at the equilibria $y = \pm 2$. What single sign holds for all $y$ in between?"),
            ],
        ),
        item(
            "mp_swt-let4pCI_4",
            r"Classify the equilibria of $\frac{dy}{dt} = y^{2} - 4$ at $y = -2$ and $y = 2$.",
            r"Use the rate signs: below $-2$, between $-2$ and $2$, and above $2$. Track which way the arrows point.",
            [
                C(r"$y = -2$ is stable and $y = 2$ is unstable", r"Yes. The rate is positive below $-2$, negative between, and positive above, so $-2$ attracts and $2$ repels."),
                W(r"$y = -2$ is unstable and $y = 2$ is stable", r"You may have swapped them. Between the roots the rate is negative, pulling toward which root and away from which?"),
                W(r"Both are stable", r"Above $y = 2$ the rate is positive, pushing solutions away from $2$. Can $2$ be stable then?"),
                W(r"Both are unstable", r"Below $y = -2$ the rate is positive, carrying solutions up toward $-2$. Does that make $-2$ stable or unstable?"),
            ],
        ),
        item(
            "mp_swt-let4pCI_5",
            r"For $\frac{dy}{dt} = (y - 1)^{2}$, classify the equilibrium at $y = 1$.",
            r"The square is never negative. Check the rate sign just above and just below $y = 1$.",
            [
                C(r"Semi-stable, since the rate is positive on both sides", r"Yes. A square stays nonnegative, so solutions rise on both sides, approaching $1$ from below and leaving above."),
                W(r"Stable, since it is a perfect square", r"A square gives a positive rate above $y = 1$, which pushes solutions away. Does that fit a stable point?"),
                W(r"Unstable, since the rate is positive", r"Below $y = 1$ the positive rate carries solutions up toward $1$. Does it leave on both sides, or only one?"),
                W(r"Not an equilibrium", r"At $y = 1$ the rate $(1 - 1)^{2}$ is zero, so it is an equilibrium. With the same sign on each side, what name fits?"),
            ],
        ),
    ],
)

# === 4.3 video 1 ============================================================
add_micro(
    "aP4YXOo-Uko",
    'Unit 4, Module 4.3, video 1\n           "The Logistic Growth Differential Equation"',
    [
        item(
            "mp_aP4YXOo-Uko_1",
            r"In the logistic equation $\frac{dP}{dt} = rP\left(1 - \frac{P}{K}\right)$, what does the constant $K$ represent?",
            r"Look at the value of $P$ that makes the bracket, and therefore the growth, vanish.",
            [
                C(r"The carrying capacity, the population level where growth stops", r"Yes. At $P = K$ the bracket is zero, so the population levels off at the carrying capacity."),
                W(r"The intrinsic growth rate", r"The growth rate is the separate constant $r$. What does $K$ control about the long term population size?"),
                W(r"The initial population", r"The starting value is set by an initial condition, not $K$. What population level does $K$ cap the growth at?"),
                W(r"The time at which growth is fastest", r"$K$ is a population level, not a time. What size does the population approach as it levels off?"),
            ],
        ),
        item(
            "mp_aP4YXOo-Uko_2",
            r"Find the equilibrium solutions of $\frac{dP}{dt} = rP\left(1 - \frac{P}{K}\right)$.",
            r"Set the right side to zero. It is a product, so each factor offers a root.",
            [
                C(r"$P = 0$ and $P = K$", r"Yes. The product is zero when $P = 0$ or when the bracket gives $P = K$."),
                W(r"$P = K$ only", r"A product is zero when any factor is zero. What value of $P$ makes the first factor vanish?"),
                W(r"$P = r$ and $P = K$", r"The factor $rP$ is zero at $P = 0$, not $P = r$. Which population value zeroes that factor?"),
                W(r"$P = 0$ only", r"The bracket $1 - \frac{P}{K}$ also vanishes somewhere. At what value of $P$ does it equal zero?"),
            ],
        ),
        item(
            "mp_aP4YXOo-Uko_3",
            r"In the logistic model with $r > 0$, how do the two equilibria classify?",
            r"For a small population growth is positive, and near the carrying capacity growth slows to zero. Track the arrows.",
            [
                C(r"$P = 0$ is unstable and $P = K$ is stable", r"Yes. A small population grows away from $0$ and every positive start settles toward $K$."),
                W(r"$P = 0$ is stable and $P = K$ is unstable", r"Just above $P = 0$ the growth is positive, pushing the population up. Does that make $0$ stable?"),
                W(r"Both equilibria are stable", r"Solutions move away from $0$ when slightly positive. Can a point that repels nearby solutions be stable?"),
                W(r"Both equilibria are unstable", r"Populations between $0$ and $K$ rise toward $K$ and stay. Does that make $K$ stable or unstable?"),
            ],
        ),
        item(
            "mp_aP4YXOo-Uko_4",
            r"At what population does the logistic growth rate $rP\left(1 - \frac{P}{K}\right)$ reach its maximum?",
            r"The rate is a downward parabola in $P$ with roots at $0$ and $K$. The peak sits halfway between the roots.",
            [
                C(r"$P = \frac{K}{2}$", r"Yes. The parabola peaks at the midpoint of its roots, which is half the carrying capacity."),
                W(r"$P = K$", r"At $P = K$ the bracket is zero, so the rate is zero, not maximal. Where between the roots is the peak?"),
                W(r"$P = 0$", r"At $P = 0$ the factor $rP$ is zero, so the rate is zero. Where does the parabola actually peak?"),
                W(r"$P = \frac{K}{4}$", r"The peak of a parabola lies at the midpoint of its two roots $0$ and $K$. What is that midpoint?"),
            ],
        ),
        item(
            "mp_aP4YXOo-Uko_5",
            r"For a logistic model with $r > 0$ and any starting population $P_{0} > 0$, what happens as $t \to \infty$?",
            r"Think about where every positive solution is pulled, given the stability of the equilibria.",
            [
                C(r"$P$ approaches the carrying capacity $K$", r"Yes. Because $K$ is the stable equilibrium, every positive start converges to it over time."),
                W(r"$P$ grows without bound", r"The bracket shuts off growth as $P$ nears $K$. What finite level does the population approach?"),
                W(r"$P$ approaches $0$", r"Zero is unstable, so positive populations move away from it. Which equilibrium do they approach instead?"),
                W(r"$P$ oscillates between $0$ and $K$", r"A scalar logistic equation has no oscillation. Toward which single value does $P$ settle?"),
            ],
        ),
    ],
)

# === 4.3 video 2 ============================================================
add_micro(
    "TCkLSYxx21c",
    'Unit 4, Module 4.3, video 2\n           "The Logistic Equation"',
    [
        item(
            "mp_TCkLSYxx21c_1",
            r"In $\frac{dP}{dt} = rP\left(1 - \frac{P}{K}\right)$, what does the factor $1 - \frac{P}{K}$ do as $P$ rises toward $K$?",
            r"Substitute values of $P$ approaching $K$ into the bracket and watch it shrink.",
            [
                C(r"It approaches zero, slowing the growth to a halt", r"Yes. As $P$ nears $K$ the bracket shrinks toward zero, throttling the growth rate."),
                W(r"It approaches one, keeping growth at full strength", r"The bracket equals one only when $P = 0$. What does $1 - \frac{P}{K}$ become as $P$ nears $K$?"),
                W(r"It grows without bound", r"The bracket is bounded above by one. What value does it head to as $P$ approaches $K$?"),
                W(r"It becomes negative immediately", r"For $P$ below $K$ the bracket stays positive. What value does it approach right at $P = K$?"),
            ],
        ),
        item(
            "mp_TCkLSYxx21c_2",
            r"For a very small population $P$, the logistic equation behaves approximately like which simpler model?",
            r"When $P$ is tiny, the ratio $\frac{P}{K}$ is nearly zero, so the bracket is close to one.",
            [
                C(r"Exponential growth $\frac{dP}{dt} \approx rP$", r"Yes. With $\frac{P}{K}$ near zero the bracket is about one, leaving simple exponential growth."),
                W(r"Linear growth $\frac{dP}{dt} \approx r$", r"The rate still scales with $P$ through the factor $rP$. What model has rate proportional to $P$?"),
                W(r"Decay $\frac{dP}{dt} \approx -rP$", r"For small positive $P$ and $r > 0$ the rate is positive, not negative. Which growth model results?"),
                W(r"No growth at all", r"A small positive population still grows when $r > 0$. What familiar model does $rP$ alone describe?"),
            ],
        ),
        item(
            "mp_TCkLSYxx21c_3",
            r"With $r = 0.5$ and $K = 100$, compute $\frac{dP}{dt}$ when $P = 25$.",
            r"Substitute into $rP\left(1 - \frac{P}{K}\right)$ and simplify step by step.",
            [
                C(r"$9.375$", r"Correct. $0.5 \cdot 25 \cdot \left(1 - \frac{25}{100}\right) = 12.5 \cdot 0.75 = 9.375$."),
                W(r"$12.5$", r"You found $rP$ but skipped the bracket. What is $1 - \frac{25}{100}$, and what is $12.5$ times that?"),
                W(r"$6.25$", r"Recheck the bracket. Is $1 - \frac{25}{100}$ equal to $0.5$, or to $0.75$?"),
                W(r"$18.75$", r"Multiply carefully. What is $12.5 \cdot 0.75$?"),
            ],
        ),
        item(
            "mp_TCkLSYxx21c_4",
            r"The logistic solution curve starting below $K$ has what overall shape?",
            r"It grows slowly at first, fastest in the middle, then levels off. Picture that profile.",
            [
                C(r"An S shaped sigmoid with an inflection point at $P = \frac{K}{2}$", r"Yes. Growth accelerates up to $\frac{K}{2}$, then decelerates toward $K$, tracing an S curve."),
                W(r"A straight line with constant slope", r"The growth rate changes as $P$ changes, so the slope is not constant. What curved shape results?"),
                W(r"A parabola opening upward", r"The population levels off rather than rising forever. What bounded S like shape fits the logistic solution?"),
                W(r"An exponential curve that never levels off", r"The carrying capacity caps the growth. What shape captures both early acceleration and a final plateau?"),
            ],
        ),
        item(
            "mp_TCkLSYxx21c_5",
            r"What is the carrying capacity of the model $\frac{dP}{dt} = 0.2P\left(1 - \frac{P}{500}\right)$?",
            r"The carrying capacity is the population value that makes the bracket zero.",
            [
                C(r"$500$", r"Yes. The bracket vanishes at $P = 500$, which is the carrying capacity $K$."),
                W(r"$0.2$", r"That value is the growth rate $r$, not the capacity. Which number sets the level where growth stops?"),
                W(r"$250$", r"That is half the capacity, where growth peaks, not the capacity itself. What value zeroes the bracket?"),
                W(r"$100$", r"Look at the denominator inside the bracket. What value of $P$ makes $1 - \frac{P}{500}$ equal zero?"),
            ],
        ),
    ],
)

# === 4.4 video 1 ============================================================
add_micro(
    "NjIMGAIPbzg",
    'Unit 4, Module 4.4, video 1\n           "How to Solve Bernoulli Differential Equations (Differential Equations 23)"',
    [
        item(
            "mp_NjIMGAIPbzg_1",
            r"Which form identifies a Bernoulli differential equation?",
            r"It looks like a first order linear equation except for a power of $y$ on the right.",
            [
                C(r"$y' + P(x)y = Q(x)y^{n}$", r"Yes. A Bernoulli equation has the linear left side but a power $y^{n}$ multiplying the right side."),
                W(r"$y' + P(x)y = Q(x)$", r"That is already first order linear, with no power of $y$ on the right. What extra factor makes it Bernoulli?"),
                W(r"$y'' + P(x)y' + Q(x)y = 0$", r"That is a second order linear equation. Bernoulli is first order. What term on the right distinguishes it?"),
                W(r"$y' = P(x)Q(y)$", r"That is a separable equation. Which form keeps a linear left side but adds a power $y^{n}$ on the right?"),
            ],
        ),
        item(
            "mp_NjIMGAIPbzg_2",
            r"To solve $y' + P(x)y = Q(x)y^{n}$, which substitution is used?",
            r"The goal is to turn the equation into a linear one in a new variable. The exponent involves $1 - n$.",
            [
                C(r"$v = y^{1 - n}$", r"Yes. Setting $v = y^{1-n}$ converts the Bernoulli equation into a first order linear equation in $v$."),
                W(r"$v = y^{n}$", r"Check the exponent that linearizes the equation. Is it $n$, or $1 - n$?"),
                W(r"$v = y^{n - 1}$", r"You have the right pieces but the sign is off. Is the exponent $n - 1$ or $1 - n$?"),
                W(r"$v = e^{y}$", r"An exponential substitution does not match the power structure here. What power of $y$ linearizes a Bernoulli equation?"),
            ],
        ),
        item(
            "mp_NjIMGAIPbzg_3",
            r"For a Bernoulli equation with $n = 2$, what is the substitution $v = y^{1 - n}$?",
            r"Plug $n = 2$ into the exponent $1 - n$.",
            [
                C(r"$v = y^{-1}$", r"Correct. With $n = 2$, the exponent is $1 - 2 = -1$, so $v = y^{-1}$."),
                W(r"$v = y$", r"Compute $1 - n$ with $n = 2$. Does the exponent come out to $1$?"),
                W(r"$v = y^{2}$", r"That uses $n$ directly. The substitution exponent is $1 - n$. What is $1 - 2$?"),
                W(r"$v = y^{-2}$", r"Recheck the exponent. Is $1 - 2$ equal to $-1$ or $-2$?"),
            ],
        ),
        item(
            "mp_NjIMGAIPbzg_4",
            r"After the substitution $v = y^{1 - n}$, the Bernoulli equation becomes which type of equation in $v$?",
            r"The whole point of the substitution is to remove the power of $y$ and reach a familiar solvable form.",
            [
                C(r"A first order linear equation in $v$", r"Yes. The substitution clears the power of $y$, leaving a linear equation solvable by an integrating factor."),
                W(r"A separable equation in $v$", r"The result is not generally separable. What standard first order form does the substitution produce?"),
                W(r"A second order equation in $v$", r"The order does not increase. The substitution keeps it first order. What kind of first order equation results?"),
                W(r"Another Bernoulli equation in $v$", r"The power of the unknown is removed by the substitution. What simpler linear form does $v$ satisfy?"),
            ],
        ),
        item(
            "mp_NjIMGAIPbzg_5",
            r"For $y' + y = xy^{3}$, identify $n$ and the substitution $v$.",
            r"Match to $y' + P(x)y = Q(x)y^{n}$ to read off $n$, then use $v = y^{1 - n}$.",
            [
                C(r"$n = 3$ and $v = y^{-2}$", r"Yes. The right side carries $y^{3}$, so $n = 3$ and $v = y^{1 - 3} = y^{-2}$."),
                W(r"$n = 3$ and $v = y^{-3}$", r"You read $n$ correctly. Now compute $1 - n$ for the exponent. Is it $-2$ or $-3$?"),
                W(r"$n = 1$ and $v = y^{0}$", r"The power on the right is $y^{3}$, not $y^{1}$. What is $n$, and then $1 - n$?"),
                W(r"$n = 3$ and $v = y^{2}$", r"The exponent is $1 - n$, which is negative here. What is $1 - 3$?"),
            ],
        ),
    ],
)

# === 4.4 video 2 ============================================================
add_micro(
    "iCN8nGXE29o",
    'Unit 4, Module 4.4, video 2\n           "The Bernoulli Equation, Substitutions in Differential Equations"',
    [
        item(
            "mp_iCN8nGXE29o_1",
            r"Why does the substitution $v = y^{1 - n}$ help solve a Bernoulli equation?",
            r"The substitution is chosen so the troublesome power of $y$ cancels out.",
            [
                C(r"It transforms the nonlinear equation into a linear one that standard methods solve", r"Yes. The substitution linearizes the equation, so an integrating factor finishes the job."),
                W(r"It makes the equation separable so you can integrate both sides directly", r"The transformed equation is linear, not generally separable. What familiar solvable form does it reach?"),
                W(r"It reduces the order of the equation", r"The order stays first order throughout. What changes is the nonlinearity. Into what does it turn?"),
                W(r"It removes the need for any integration", r"Integration is still needed for the linear equation. What property of the equation does the substitution fix?"),
            ],
        ),
        item(
            "mp_iCN8nGXE29o_2",
            r"If $v = y^{1 - n}$, what is $\frac{dv}{dx}$ in terms of $y$ and $\frac{dy}{dx}$?",
            r"Differentiate $v = y^{1 - n}$ with respect to $x$ using the chain rule.",
            [
                C(r"$\frac{dv}{dx} = (1 - n)y^{-n}\frac{dy}{dx}$", r"Yes. The power rule and chain rule give $(1-n)y^{-n}$ times $\frac{dy}{dx}$."),
                W(r"$\frac{dv}{dx} = (1 - n)y^{1 - n}\frac{dy}{dx}$", r"Lower the exponent by one when differentiating $y^{1 - n}$. What power of $y$ should appear?"),
                W(r"$\frac{dv}{dx} = y^{-n}\frac{dy}{dx}$", r"Do not drop the coefficient from the power rule. What factor multiplies $y^{-n}$?"),
                W(r"$\frac{dv}{dx} = (1 - n)y^{-n}$", r"The chain rule attaches a derivative of the inside function. What factor besides $(1-n)y^{-n}$ belongs here?"),
            ],
        ),
        item(
            "mp_iCN8nGXE29o_3",
            r"For which values of $n$ is a Bernoulli equation already linear, needing no substitution?",
            r"Look at the right side $Q(x)y^{n}$. Which exponents make it linear in $y$ on its own?",
            [
                C(r"$n = 0$ and $n = 1$", r"Yes. With $n = 0$ the right side is just $Q(x)$, and with $n = 1$ it is linear in $y$, so both are already linear."),
                W(r"$n = 2$ and $n = 3$", r"Those exponents produce genuine nonlinear powers that need the substitution. Which small exponents leave the equation linear?"),
                W(r"Only $n = 0$", r"There is a second exponent that also keeps the equation linear. What does $n = 1$ give on the right side?"),
                W(r"Only $n = 1$", r"There is a second value too. What does the right side become when $n = 0$?"),
            ],
        ),
        item(
            "mp_iCN8nGXE29o_4",
            r"For $y' + \frac{1}{x}y = y^{2}$, identify $n$ and the substitution $v$.",
            r"Match to the Bernoulli form to read $n$, then apply $v = y^{1 - n}$.",
            [
                C(r"$n = 2$ and $v = y^{-1}$", r"Yes. The right side is $y^{2}$, so $n = 2$ and $v = y^{1 - 2} = y^{-1}$."),
                W(r"$n = 2$ and $v = y^{-2}$", r"You read $n$ correctly. Compute $1 - n$ for the exponent. Is it $-1$ or $-2$?"),
                W(r"$n = 1$ and $v = y^{0}$", r"The right side carries $y^{2}$. What is $n$, and then $1 - n$?"),
                W(r"$n = -1$ and $v = y^{2}$", r"The exponent on the right is $+2$, not $-1$. What is $n$ here, and what is $1 - n$?"),
            ],
        ),
        item(
            "mp_iCN8nGXE29o_5",
            r"Substituting $v = y^{-1}$ into $y' + \frac{1}{x}y = y^{2}$ produces which linear equation in $v$?",
            r"Divide through by $y^{2}$ first, then use $v = y^{-1}$ and $v' = -y^{-2}y'$ to rewrite each term.",
            [
                C(r"$v' - \frac{1}{x}v = -1$", r"Yes. Dividing by $y^{2}$ gives $y^{-2}y' + \frac{1}{x}y^{-1} = 1$, and $v' = -y^{-2}y'$ turns it into $v' - \frac{1}{x}v = -1$."),
                W(r"$v' + \frac{1}{x}v = 1$", r"Recall $v' = -y^{-2}y'$ carries a minus sign. How does that flip the signs when you substitute?"),
                W(r"$v' - \frac{1}{x}v = 1$", r"Track the right side after multiplying through by the minus sign from $v'$. What sign does the constant take?"),
                W(r"$v' + xv = -1$", r"The coefficient comes from $\frac{1}{x}$, not $x$, and the sign flips with $v'$. What is the correct coefficient of $v$?"),
            ],
        ),
    ],
)

# === 4.5 video 1 ============================================================
add_micro(
    "DdJzN4MS_0k",
    'Unit 4, Module 4.5, video 1\n           "How to Solve a Bernoulli Differential Equation"',
    [
        item(
            "mp_DdJzN4MS_0k_1",
            r"What is the first algebraic step when solving $y' + P(x)y = Q(x)y^{n}$ by hand?",
            r"You want the right side free of $y$, so think about what to divide the whole equation by.",
            [
                C(r"Divide every term by $y^{n}$", r"Yes. Dividing by $y^{n}$ sets up the equation for the substitution $v = y^{1 - n}$."),
                W(r"Multiply every term by $y^{n}$", r"Multiplying raises the powers of $y$ further. Which operation instead clears the power from the right side?"),
                W(r"Integrate both sides immediately", r"The equation is not yet in an integrable form. What division prepares it for the substitution?"),
                W(r"Differentiate both sides", r"Differentiating adds complexity rather than simplifying. What division sets up the linear substitution?"),
            ],
        ),
        item(
            "mp_DdJzN4MS_0k_2",
            r"Dividing $y' + y = xy^{2}$ by $y^{2}$ gives which equation?",
            r"Divide each term by $y^{2}$ and simplify the powers of $y$.",
            [
                C(r"$y^{-2}y' + y^{-1} = x$", r"Yes. Each term divided by $y^{2}$ gives $y^{-2}y'$, $y^{-1}$, and $x$ on the right."),
                W(r"$y^{-2}y' + y = x$", r"Divide the middle term $y$ by $y^{2}$ as well. What power of $y$ results?"),
                W(r"$y' + y^{-1} = x$", r"The first term $y'$ must also be divided by $y^{2}$. What factor appears in front of $y'$?"),
                W(r"$y^{-2}y' + y^{-1} = xy^{2}$", r"The right side $xy^{2}$ divided by $y^{2}$ simplifies. What is left after the powers cancel?"),
            ],
        ),
        item(
            "mp_DdJzN4MS_0k_3",
            r"With $v = y^{-1}$, what is $\frac{dv}{dx}$ in terms of $y'$?",
            r"Differentiate $v = y^{-1}$ using the power and chain rules.",
            [
                C(r"$\frac{dv}{dx} = -y^{-2}y'$", r"Yes. Differentiating $y^{-1}$ gives $-y^{-2}$ times $y'$."),
                W(r"$\frac{dv}{dx} = y^{-2}y'$", r"Do not lose the minus sign from lowering the exponent on $y^{-1}$. What sign should the coefficient carry?"),
                W(r"$\frac{dv}{dx} = -y^{-1}y'$", r"Lower the exponent by one when differentiating $y^{-1}$. What power of $y$ appears?"),
                W(r"$\frac{dv}{dx} = -2y^{-3}y'$", r"The starting exponent is $-1$, not $-2$. What is the derivative of $y^{-1}$?"),
            ],
        ),
        item(
            "mp_DdJzN4MS_0k_4",
            r"Substituting $v = y^{-1}$ and $v' = -y^{-2}y'$ into $y^{-2}y' + y^{-1} = x$ gives which linear equation?",
            r"Replace $y^{-1}$ with $v$ and note that $y^{-2}y' = -v'$, then rearrange into standard linear form.",
            [
                C(r"$v' - v = -x$", r"Yes. Since $y^{-2}y' = -v'$, the equation becomes $-v' + v = x$, which rearranges to $v' - v = -x$."),
                W(r"$v' + v = x$", r"The term $y^{-2}y'$ equals $-v'$, not $v'$. How does that minus sign change the equation?"),
                W(r"$v' - v = x$", r"Carry the minus sign through to the right side when you multiply by $-1$. What sign does $x$ take?"),
                W(r"$-v' - v = x$", r"Substitute $y^{-1} = v$ directly into the middle term. What sign should the $v$ term have before rearranging?"),
            ],
        ),
        item(
            "mp_DdJzN4MS_0k_5",
            r"What is the integrating factor for the linear equation $v' - v = -x$?",
            r"For $v' + p(x)v = g(x)$, the integrating factor is $e^{\int p(x)\,dx}$ with $p(x) = -1$ here.",
            [
                C(r"$e^{-x}$", r"Yes. With $p(x) = -1$, the integrating factor is $e^{\int -1\,dx} = e^{-x}$."),
                W(r"$e^{x}$", r"Check the sign of $p(x)$. The coefficient of $v$ is $-1$, so what is $\int p\,dx$?"),
                W(r"$e^{-x^{2}/2}$", r"That would come from $p(x) = -x$. Here $p(x)$ is the constant $-1$. What is its integral?"),
                W(r"$-x$", r"The integrating factor is an exponential of the integral, not the integral itself. What is $e^{\int -1\,dx}$?"),
            ],
        ),
    ],
)

# === 4.5 video 2 ============================================================
add_micro(
    "QnTt9huzdNU",
    'Unit 4, Module 4.5, video 2\n           "Solve a Bernoulli Differential Equation Initial Value Problem"',
    [
        item(
            "mp_QnTt9huzdNU_1",
            r"After solving the linear equation for $v$, where $v = y^{-1}$, how do you recover $y$?",
            r"Invert the substitution relation between $v$ and $y$.",
            [
                C(r"$y = \frac{1}{v}$", r"Yes. Since $v = y^{-1}$, taking the reciprocal returns $y = \frac{1}{v}$."),
                W(r"$y = v$", r"The substitution was $v = y^{-1}$, not $v = y$. What operation undoes a reciprocal?"),
                W(r"$y = v^{2}$", r"Squaring does not invert $v = y^{-1}$. What relationship recovers $y$ from its reciprocal?"),
                W(r"$y = -v$", r"A negative sign does not undo a reciprocal. How do you solve $v = y^{-1}$ for $y$?"),
            ],
        ),
        item(
            "mp_QnTt9huzdNU_2",
            r"In a Bernoulli initial value problem, when is the best time to apply the initial condition $y(x_{0}) = y_{0}$?",
            r"Think about whether it is cleaner to fix the constant in the $v$ solution or after returning to $y$.",
            [
                C(r"Either convert it to a condition on $v$, or apply it after back-substituting to $y$", r"Yes. You may translate $y_{0}$ into $v(x_{0})$ or wait until $y$ is recovered, both fix the constant correctly."),
                W(r"Before doing any substitution, on the original Bernoulli equation", r"The constant of integration only appears after solving the linear equation. When does a constant become available to pin down?"),
                W(r"It is never needed, since Bernoulli problems have unique solutions automatically", r"The general solution carries an arbitrary constant. What information removes that arbitrariness?"),
                W(r"Only on the integrating factor", r"The integrating factor carries no arbitrary constant to fix. Where does the constant that the initial condition determines actually appear?"),
            ],
        ),
        item(
            "mp_QnTt9huzdNU_3",
            r"If $v = y^{1 - n}$ with $n = 3$, and the initial condition is $y(0) = 1$, what is $v(0)$?",
            r"Compute the exponent $1 - n$, then evaluate $v = y^{1 - n}$ at the initial value.",
            [
                C(r"$v(0) = 1$", r"Yes. With $n = 3$, $v = y^{-2}$, and $1^{-2} = 1$."),
                W(r"$v(0) = -2$", r"The exponent $1 - n$ is $-2$, but you evaluate $1^{-2}$, not the exponent itself. What is $1^{-2}$?"),
                W(r"$v(0) = 0$", r"Raising $1$ to any power gives $1$, not $0$. What is $1^{-2}$?"),
                W(r"$v(0) = 3$", r"The base is $y(0) = 1$, not $n$. What is $1$ raised to the power $1 - 3$?"),
            ],
        ),
        item(
            "mp_QnTt9huzdNU_4",
            r"Which ordering of steps correctly solves a Bernoulli initial value problem?",
            r"Trace the path from the nonlinear equation to a number, ending with the initial condition.",
            [
                C(r"Divide by $y^{n}$, substitute $v = y^{1-n}$, solve the linear equation, back-substitute, then apply the initial condition", r"Yes. Linearize first, solve, return to $y$, and finally use the initial condition to fix the constant."),
                W(r"Apply the initial condition, then divide by $y^{n}$, then substitute", r"The constant to be fixed only appears after integrating the linear equation. Can the initial condition be used before that constant exists?"),
                W(r"Substitute $v = y^{1-n}$, apply the initial condition, then divide by $y^{n}$", r"Dividing by $y^{n}$ sets up the substitution and must come first. What is the correct opening step?"),
                W(r"Integrate the original equation directly, then substitute", r"The original Bernoulli equation is not directly integrable due to the power of $y$. What step removes that nonlinearity first?"),
            ],
        ),
        item(
            "mp_QnTt9huzdNU_5",
            r"Suppose back-substitution gives the linear solution $v = Ce^{x} + x + 1$ and the condition $v(0) = 2$. Find $C$.",
            r"Evaluate the solution at $x = 0$, set it equal to $2$, and solve for $C$.",
            [
                C(r"$C = 1$", r"Correct. At $x = 0$, $v(0) = C + 0 + 1 = C + 1 = 2$, so $C = 1$."),
                W(r"$C = 2$", r"Do not forget the constant term. At $x = 0$ the solution is $C + 1$, not $C$. What value of $C$ makes that equal $2$?"),
                W(r"$C = 3$", r"Evaluate carefully at $x = 0$: the $x$ term vanishes and the $+1$ remains. What is $C$ if $C + 1 = 2$?"),
                W(r"$C = 0$", r"With $C = 0$ the solution at $x = 0$ would be $1$, not $2$. What value of $C$ gives $C + 1 = 2$?"),
            ],
        ),
    ],
)

# === 4.6 video 1 ============================================================
add_micro(
    "tsBxekziI6Q",
    'Unit 4, Module 4.6, video 1\n           "The Bernoulli Equation and Fluid Flow"',
    [
        item(
            "mp_tsBxekziI6Q_1",
            r"The fluid Bernoulli equation $P + \frac{1}{2}\rho v^{2} + \rho g h = \text{constant}$ expresses the conservation of what along a streamline?",
            r"Each term is an energy per unit volume. Adding them and holding the total fixed states a conservation law.",
            [
                C(r"Energy, the total mechanical energy per unit volume of the flowing fluid", r"Yes. The pressure, kinetic, and potential terms sum to a constant total energy per unit volume."),
                W(r"Mass, the amount of fluid passing a point", r"Mass conservation is the separate continuity equation. What quantity do the summed pressure and energy terms conserve?"),
                W(r"Momentum, the product of mass and velocity", r"Bernoulli is an energy statement, not a momentum balance. What conserved quantity do the three terms represent together?"),
                W(r"Temperature of the fluid", r"Temperature does not appear in these terms. What physical quantity per unit volume stays constant along the streamline?"),
            ],
        ),
        item(
            "mp_tsBxekziI6Q_2",
            r"According to Bernoulli's principle, as the speed of a fluid increases along a streamline, its pressure does what?",
            r"With the total held constant, raising one term forces another to fall. Watch the pressure and the speed terms trade off.",
            [
                C(r"It decreases", r"Yes. Since the total is fixed, a larger speed term $\frac{1}{2}\rho v^{2}$ requires a smaller pressure."),
                W(r"It increases", r"If both the speed term and pressure rose, the fixed total would be exceeded. Which way must pressure move to compensate?"),
                W(r"It stays the same", r"The pressure cannot stay fixed while the speed term grows and the total is constant. What must pressure do?"),
                W(r"It drops to zero immediately", r"Pressure decreases gradually, not to zero. In which direction does it change as speed rises?"),
            ],
        ),
        item(
            "mp_tsBxekziI6Q_3",
            r"In the Bernoulli equation, the term $\frac{1}{2}\rho v^{2}$ represents which energy per unit volume?",
            r"The form $\frac{1}{2}(\text{mass density})(\text{speed})^{2}$ should look familiar from mechanics.",
            [
                C(r"Kinetic energy per unit volume", r"Yes. The $\frac{1}{2}\rho v^{2}$ term is the kinetic energy of the moving fluid per unit volume."),
                W(r"Potential energy per unit volume", r"Potential energy is carried by the height term $\rho g h$. What does the speed squared term measure?"),
                W(r"Pressure energy from the surroundings", r"That role belongs to the term $P$. What kind of energy does motion at speed $v$ contribute?"),
                W(r"Thermal energy from friction", r"Bernoulli assumes no friction losses. What mechanical energy does $\frac{1}{2}\rho v^{2}$ describe?"),
            ],
        ),
        item(
            "mp_tsBxekziI6Q_4",
            r"The continuity equation $A_{1}v_{1} = A_{2}v_{2}$ implies what about fluid speed in a narrower section of pipe?",
            r"The product of cross sectional area and speed is constant. If the area shrinks, the speed must adjust.",
            [
                C(r"The speed increases where the area is smaller", r"Yes. To keep the product constant, a smaller area forces a larger speed."),
                W(r"The speed decreases where the area is smaller", r"That would make the product $Av$ shrink, breaking the equality. Which way must speed move when area falls?"),
                W(r"The speed is unaffected by area", r"The relation $A_{1}v_{1} = A_{2}v_{2}$ ties them together. How does speed respond when area decreases?"),
                W(r"The speed drops to zero in the narrow part", r"A narrow section speeds the flow rather than stopping it. What happens to speed as area shrinks?"),
            ],
        ),
        item(
            "mp_tsBxekziI6Q_5",
            r"How does Bernoulli's principle help explain lift on an airplane wing?",
            r"Air moving faster over one surface relates to a pressure difference between the two surfaces.",
            [
                C(r"Faster flow over the top lowers the pressure there, and the higher pressure below pushes the wing up", r"Yes. The speed difference creates a pressure difference, and the net upward pressure force is lift."),
                W(r"Faster flow over the top raises the pressure there, pushing the wing up", r"Bernoulli ties faster flow to lower pressure, not higher. Which side ends up at lower pressure?"),
                W(r"The wing is lifted by the temperature difference across it", r"Temperature is not the mechanism here. What pressure difference does the speed difference create?"),
                W(r"Lift comes from the air being compressed to zero speed below the wing", r"The flow does not stop below the wing. What pressure relationship does the speed difference produce?"),
            ],
        ),
    ],
)

# === 4.6 video 2 ============================================================
add_micro(
    "DW4rItB20h4",
    'Unit 4, Module 4.6, video 2\n           "Understanding Bernoulli\'s Equation"',
    [
        item(
            "mp_DW4rItB20h4_1",
            r"Bernoulli's principle is fundamentally a statement of the conservation of which quantity for an ideal fluid?",
            r"It balances pressure, motion, and height contributions that together form one conserved total.",
            [
                C(r"Energy", r"Yes. Bernoulli's equation is the conservation of mechanical energy per unit volume for an ideal fluid."),
                W(r"Electric charge", r"Charge plays no role in fluid flow here. What conserved mechanical quantity do the pressure and motion terms form?"),
                W(r"Angular momentum", r"Bernoulli does not track rotation. What quantity per unit volume stays constant along a streamline?"),
                W(r"Entropy", r"Entropy is a thermodynamic measure, not the conserved quantity here. What mechanical quantity is conserved?"),
            ],
        ),
        item(
            "mp_DW4rItB20h4_2",
            r"In $P + \frac{1}{2}\rho v^{2} + \rho g h = \text{constant}$, the term $\rho g h$ represents which energy per unit volume?",
            r"The structure $(\text{density})(\text{gravity})(\text{height})$ mirrors the familiar $mgh$ from mechanics.",
            [
                C(r"Gravitational potential energy per unit volume", r"Yes. The term $\rho g h$ is the gravitational potential energy of the fluid per unit volume."),
                W(r"Kinetic energy per unit volume", r"Kinetic energy is the speed squared term. What does the height term $\rho g h$ measure?"),
                W(r"Pressure energy per unit volume", r"Pressure energy is the term $P$. What does the height dependence $\rho g h$ contribute?"),
                W(r"Frictional energy loss", r"Bernoulli neglects friction. What stored energy does raising the fluid to height $h$ represent?"),
            ],
        ),
        item(
            "mp_DW4rItB20h4_3",
            r"In a horizontal pipe, if the fluid speed in a section doubles, the dynamic pressure $\frac{1}{2}\rho v^{2}$ changes by what factor?",
            r"The term depends on $v^{2}$. Replace $v$ with $2v$ and see how the square responds.",
            [
                C(r"It quadruples, since the term depends on $v^{2}$", r"Yes. Doubling $v$ multiplies $v^{2}$ by four, so the dynamic pressure quadruples."),
                W(r"It doubles", r"The term scales with the square of speed, not the speed itself. What is $(2v)^{2}$ compared with $v^{2}$?"),
                W(r"It stays the same", r"A change in speed changes $\frac{1}{2}\rho v^{2}$. By what factor does squaring a doubled speed grow?"),
                W(r"It is cut in half", r"Faster flow raises the dynamic pressure, not lowers it. What factor comes from squaring a doubling?"),
            ],
        ),
        item(
            "mp_DW4rItB20h4_4",
            r"Which set of assumptions underlies the standard Bernoulli equation?",
            r"Recall the idealizations that let energy be conserved with no losses along a streamline.",
            [
                C(r"Steady, incompressible, non-viscous flow along a streamline", r"Yes. These idealizations remove energy losses and density changes, so the energy sum stays constant."),
                W(r"Unsteady, compressible, viscous flow", r"Each of these would break the simple energy balance. What opposite idealizations does Bernoulli assume?"),
                W(r"Flow that gains energy from friction along the walls", r"Friction removes mechanical energy rather than adding it, and Bernoulli neglects it. What viscosity assumption is required?"),
                W(r"Flow with strong heat exchange and turbulence", r"Heat exchange and turbulence introduce losses the equation ignores. What smooth, loss free conditions are assumed?"),
            ],
        ),
        item(
            "mp_DW4rItB20h4_5",
            r"The Venturi effect, where flow speeds up and pressure drops in a constriction, follows from combining Bernoulli's equation with what?",
            r"You need a second relation linking the cross sectional area to the speed of the flow.",
            [
                C(r"The continuity equation relating area and speed", r"Yes. Continuity forces higher speed in the constriction, and Bernoulli then predicts the lower pressure."),
                W(r"Newton's law of cooling", r"Cooling describes heat transfer, not flow speed and area. What conservation relation ties area to speed?"),
                W(r"Hooke's law for springs", r"Springs are unrelated to pipe flow. What equation connects cross sectional area to fluid speed?"),
                W(r"The ideal gas law alone", r"The gas law relates pressure, volume, and temperature, not area and speed. Which flow relation does Bernoulli combine with here?"),
            ],
        ),
    ],
)


# ----------------------------------------------------------------------------
# UNIT MASTERY CONTENT, 30 items
# ----------------------------------------------------------------------------

MASTERY = [
    # --- Equilibrium solutions and stability (4.1) ---
    item(
        "um_4_1",
        r"An equilibrium solution of $\frac{dy}{dt} = f(y)$ is a constant $y = c$ for which condition?",
        r"A constant solution has zero derivative. What does that force $f$ to be?",
        [
            C(r"$f(c) = 0$", r"Yes. The rate vanishes where $f(c) = 0$, so the solution stays constant."),
            W(r"$f'(c) = 0$", r"That is about the slope of $f$, not the rate of $y$. What must the rate equal?"),
            W(r"$f(c) = c$", r"That is a fixed point of a map, not an equilibrium of this rate equation. What value must $f$ take?"),
            W(r"$c = 0$", r"Equilibria are not always at the origin. What equation in $f$ defines them?"),
        ],
    ),
    item(
        "um_4_2",
        r"Find all equilibrium solutions of $\frac{dy}{dt} = y(y - 3)$.",
        r"Set the product equal to zero and read off both roots.",
        [
            C(r"$y = 0$ and $y = 3$", r"Yes. The product is zero exactly at $y = 0$ and $y = 3$."),
            W(r"$y = 3$ only", r"A product vanishes when either factor does. What makes the factor $y$ zero?"),
            W(r"$y = -3$ and $y = 0$", r"Check the sign inside $y - 3$. Which value zeroes it?"),
            W(r"No equilibria exist", r"Can a product be zero? Which values of $y$ achieve that here?"),
        ],
    ),
    item(
        "um_4_3",
        r"Using the sign of $f'$, classify the equilibrium $y = 2$ of $\frac{dy}{dt} = y - 2$.",
        r"Here $f(y) = y - 2$, so compute $f'(2)$ and use its sign.",
        [
            C(r"Unstable, since $f'(2) = 1 > 0$", r"Yes. A positive slope of $f$ at the equilibrium repels nearby solutions."),
            W(r"Stable, since $f'(2) = 1$", r"A positive $f'$ signals instability, not stability. What does a positive slope do to disturbances?"),
            W(r"Semi-stable, since $f'(2) = 0$", r"Compute $f'(y)$ for $f = y - 2$. Is it really zero at $y = 2$?"),
            W(r"Stable, since $f(2) = 0$", r"Vanishing of $f$ only marks the equilibrium. Which derivative decides stability, and what is its sign?"),
        ],
    ),
    item(
        "um_4_4",
        r"For $\frac{dy}{dt} = y - y^{3}$, classify the equilibrium $y = 1$.",
        r"Compute $f'(y) = 1 - 3y^{2}$ and evaluate at $y = 1$.",
        [
            C(r"Stable, since $f'(1) = -2 < 0$", r"Yes. The negative slope at $y = 1$ makes it stable."),
            W(r"Unstable, since $f'(1) > 0$", r"Recompute $1 - 3(1)^{2}$. Is the result positive?"),
            W(r"Semi-stable, since $f'(1) = 0$", r"Evaluate $1 - 3$. Does it equal zero?"),
            W(r"Stable, only because $y = 1$ is positive", r"The sign of $y$ does not set stability. Which derivative does, and what is its value here?"),
        ],
    ),
    item(
        "um_4_5",
        r"A steady state where $f$ touches zero without changing sign across it is called what?",
        r"Picture a double root, where the rate keeps the same sign on both sides.",
        [
            C(r"Semi-stable", r"Yes. With the same sign on both sides, it attracts from one side and repels from the other."),
            W(r"Asymptotically stable", r"Full stability needs the rate to restore from both sides. Does a constant sign do that?"),
            W(r"A source", r"A source repels on both sides. Does a non-changing sign push away on both sides?"),
            W(r"Not an equilibrium", r"The rate is still zero there. What name applies when the sign does not flip?"),
        ],
    ),
    item(
        "um_4_6",
        r"For $\frac{dy}{dt} = (y - 1)(y + 2)$, classify the equilibrium $y = -2$.",
        r"Test the rate sign just above and just below $y = -2$.",
        [
            C(r"Stable", r"Yes. Below $-2$ the rate is positive and just above it is negative, so solutions return to $-2$."),
            W(r"Unstable", r"Just below $-2$ both factors are negative, giving a positive rate toward $-2$. Does that repel or attract?"),
            W(r"Semi-stable", r"The sign of the rate flips across $y = -2$. Does a sign flip toward the point mean semi-stable?"),
            W(r"It is not an equilibrium", r"Check $(y - 1)(y + 2)$ at $y = -2$. Does the product vanish there?"),
        ],
    ),
    # --- Autonomous equations and the phase line (4.2) ---
    item(
        "um_4_7",
        r"What characterizes an autonomous first order equation?",
        r"Focus on which variable is allowed to appear on the right side.",
        [
            C(r"The right side depends only on $y$, not explicitly on $t$", r"Yes. Autonomous means $\frac{dy}{dt} = f(y)$ with no explicit $t$."),
            W(r"The right side depends only on $t$", r"That gives a direct integration, not an autonomous equation. Which variable alone may appear?"),
            W(r"The equation is separable", r"Autonomy concerns variable dependence, not separability. Which variable is excluded from the right side?"),
            W(r"The solution is always constant", r"Autonomous equations have many nonconstant solutions. What restriction defines the term?"),
        ],
    ),
    item(
        "um_4_8",
        r"On the phase line for $\frac{dy}{dt} = y - 4$, which way does the arrow point at $y = 5$?",
        r"Evaluate the rate at $y = 5$ and read its sign.",
        [
            C(r"Upward, since the rate is $1 > 0$", r"Yes. A positive rate means $y$ increases, so the arrow points up."),
            W(r"Downward, since the rate is negative", r"Compute $5 - 4$. Is that negative?"),
            W(r"No motion, since $y = 5$ is an equilibrium", r"Is $5 - 4$ equal to zero? Check whether $y = 5$ is an equilibrium."),
            W(r"The direction cannot be determined", r"The sign of $5 - 4$ settles it. What is that sign?"),
        ],
    ),
    item(
        "um_4_9",
        r"On a phase line, an equilibrium with arrows pointing toward it from both sides is which type?",
        r"Converging arrows pull nearby solutions inward.",
        [
            C(r"Stable, a sink", r"Yes. Inward arrows from both sides make it a stable sink."),
            W(r"Unstable, a source", r"A source has outward arrows. Which way do these point?"),
            W(r"Semi-stable", r"Semi-stable mixes one inward and one outward arrow. Do both point the same way here?"),
            W(r"A center", r"Centers belong to planar systems, not a phase line. What do two inward arrows make it?"),
        ],
    ),
    item(
        "um_4_10",
        r"For $\frac{dy}{dt} = y^{2} - 4$, what is the sign of the rate for $-2 < y < 2$?",
        r"Test $y = 0$ in $y^{2} - 4$.",
        [
            C(r"Negative", r"Yes. Between the roots $y^{2} < 4$, so $y^{2} - 4 < 0$."),
            W(r"Positive", r"Test $y = 0$, giving $-4$. Is that positive?"),
            W(r"Zero", r"The rate is zero only at $y = \pm 2$. What sign holds strictly between them?"),
            W(r"It alternates sign", r"The sign only changes at the equilibria. What single sign holds in the interval?"),
        ],
    ),
    item(
        "um_4_11",
        r"Classify the equilibria of $\frac{dy}{dt} = y^{2} - 4$.",
        r"Track the rate sign below $-2$, between $-2$ and $2$, and above $2$.",
        [
            C(r"$y = -2$ stable, $y = 2$ unstable", r"Yes. The rate is positive below $-2$, negative between, and positive above, so $-2$ attracts and $2$ repels."),
            W(r"$y = -2$ unstable, $y = 2$ stable", r"You may have swapped them. Between the roots the rate is negative, pulling toward which root?"),
            W(r"Both stable", r"Above $y = 2$ the rate is positive, pushing away from $2$. Can $2$ be stable?"),
            W(r"Both unstable", r"Below $y = -2$ the rate is positive, carrying solutions up to $-2$. Is $-2$ stable or unstable?"),
        ],
    ),
    item(
        "um_4_12",
        r"Why are solution curves of an autonomous equation horizontal time shifts of one another?",
        r"If $y(t)$ is a solution, consider whether $y(t - c)$ also solves the equation.",
        [
            C(r"Because the right side has no explicit $t$, so a time-shifted solution is still a solution", r"Yes. Time invariance means $y(t - c)$ solves the equation too, giving horizontal shifts."),
            W(r"Because every solution is a straight line", r"Solutions are usually curved. What property allows shifting in time?"),
            W(r"Because there is only one solution", r"There is a whole family. What lets a shifted curve remain a solution?"),
            W(r"Because $t$ appears explicitly", r"Autonomous means $t$ does not appear explicitly. How does that absence allow the shift?"),
        ],
    ),
    # --- The logistic equation (4.3) ---
    item(
        "um_4_13",
        r"In $\frac{dP}{dt} = rP\left(1 - \frac{P}{K}\right)$, what does $K$ represent?",
        r"Find the population value that makes the bracket and the growth vanish.",
        [
            C(r"The carrying capacity", r"Yes. At $P = K$ the bracket is zero and growth stops, so $K$ is the carrying capacity."),
            W(r"The intrinsic growth rate", r"That is the constant $r$. What level does $K$ cap the population at?"),
            W(r"The initial population", r"The start is set by an initial condition. What ceiling does $K$ impose?"),
            W(r"The time of fastest growth", r"$K$ is a population level, not a time. What size does the population approach?"),
        ],
    ),
    item(
        "um_4_14",
        r"What are the equilibrium solutions of $\frac{dP}{dt} = rP\left(1 - \frac{P}{K}\right)$?",
        r"Set the product to zero and solve each factor.",
        [
            C(r"$P = 0$ and $P = K$", r"Yes. The factor $rP$ gives $P = 0$ and the bracket gives $P = K$."),
            W(r"$P = K$ only", r"The factor $rP$ also vanishes. At what $P$?"),
            W(r"$P = r$ and $P = K$", r"The factor $rP$ is zero at $P = 0$, not $P = r$. Which value zeroes it?"),
            W(r"$P = 0$ only", r"The bracket $1 - \frac{P}{K}$ also vanishes. At what value of $P$?"),
        ],
    ),
    item(
        "um_4_15",
        r"For the logistic model with $r > 0$, how do the equilibria classify?",
        r"A small population grows away from zero and large populations settle near the capacity.",
        [
            C(r"$P = 0$ unstable, $P = K$ stable", r"Yes. Solutions move away from $0$ and toward $K$."),
            W(r"$P = 0$ stable, $P = K$ unstable", r"Just above $0$ growth is positive, pushing up. Does that make $0$ stable?"),
            W(r"Both stable", r"Solutions leave the neighborhood of $0$. Can a repelling point be stable?"),
            W(r"Both unstable", r"Populations between $0$ and $K$ approach $K$ and remain. Is $K$ stable?"),
        ],
    ),
    item(
        "um_4_16",
        r"At what population is the logistic growth rate $rP\left(1 - \frac{P}{K}\right)$ greatest?",
        r"The rate is a downward parabola in $P$ with roots at $0$ and $K$.",
        [
            C(r"$P = \frac{K}{2}$", r"Yes. The parabola peaks halfway between its roots."),
            W(r"$P = K$", r"At $P = K$ the rate is zero. Where between the roots is the peak?"),
            W(r"$P = 0$", r"At $P = 0$ the rate is zero. Where does the parabola peak?"),
            W(r"$P = \frac{K}{4}$", r"The peak is at the midpoint of $0$ and $K$. What is that midpoint?"),
        ],
    ),
    item(
        "um_4_17",
        r"With $r = 0.5$ and $K = 100$, what is $\frac{dP}{dt}$ when $P = 25$?",
        r"Substitute into $rP\left(1 - \frac{P}{K}\right)$ and simplify.",
        [
            C(r"$9.375$", r"Correct. $0.5 \cdot 25 \cdot 0.75 = 9.375$."),
            W(r"$12.5$", r"That is $rP$ alone. Multiply by the bracket $1 - \frac{25}{100}$. What results?"),
            W(r"$6.25$", r"Recheck the bracket. Is $1 - 0.25$ equal to $0.5$ or $0.75$?"),
            W(r"$18.75$", r"Recompute $12.5 \cdot 0.75$. What is the product?"),
        ],
    ),
    item(
        "um_4_18",
        r"For small $P$, the logistic equation is approximately which simpler model?",
        r"When $P$ is tiny, $\frac{P}{K}$ is near zero and the bracket is near one.",
        [
            C(r"Exponential growth $\frac{dP}{dt} \approx rP$", r"Yes. With the bracket near one, only $rP$ remains."),
            W(r"Linear growth $\frac{dP}{dt} \approx r$", r"The rate still scales with $P$. What model has rate proportional to $P$?"),
            W(r"Decay $\frac{dP}{dt} \approx -rP$", r"For small positive $P$ and $r > 0$ the rate is positive. Which growth model applies?"),
            W(r"Constant population", r"A small positive population still grows. What model does $rP$ describe?"),
        ],
    ),
    # --- Bernoulli equations (4.4 and 4.5) ---
    item(
        "um_4_19",
        r"Which form identifies a Bernoulli equation?",
        r"It resembles a first order linear equation but with a power of $y$ on the right.",
        [
            C(r"$y' + P(x)y = Q(x)y^{n}$", r"Yes. The linear left side with a $y^{n}$ on the right is the Bernoulli form."),
            W(r"$y' + P(x)y = Q(x)$", r"That is already linear with no power of $y$. What extra factor makes it Bernoulli?"),
            W(r"$y'' + P(x)y' + Q(x)y = 0$", r"That is second order linear. Bernoulli is first order. What right side term distinguishes it?"),
            W(r"$y' = P(x)Q(y)$", r"That is separable. Which form keeps a linear left side but a power $y^{n}$ on the right?"),
        ],
    ),
    item(
        "um_4_20",
        r"Which substitution linearizes the Bernoulli equation $y' + P(x)y = Q(x)y^{n}$?",
        r"The linearizing exponent is $1 - n$.",
        [
            C(r"$v = y^{1 - n}$", r"Yes. This substitution turns the equation linear in $v$."),
            W(r"$v = y^{n}$", r"Check the linearizing exponent. Is it $n$ or $1 - n$?"),
            W(r"$v = y^{n - 1}$", r"The sign is reversed. Is the exponent $n - 1$ or $1 - n$?"),
            W(r"$v = \ln y$", r"A logarithm does not match the power structure. What power of $y$ linearizes it?"),
        ],
    ),
    item(
        "um_4_21",
        r"For a Bernoulli equation with $n = 2$, the substitution $v = y^{1 - n}$ is what?",
        r"Compute $1 - n$ for $n = 2$.",
        [
            C(r"$v = y^{-1}$", r"Yes. $1 - 2 = -1$, so $v = y^{-1}$."),
            W(r"$v = y^{2}$", r"That uses $n$ directly. What is $1 - 2$?"),
            W(r"$v = y^{-2}$", r"Recheck $1 - 2$. Is it $-1$ or $-2$?"),
            W(r"$v = y$", r"Compute $1 - n$ for $n = 2$. Does it give $1$?"),
        ],
    ),
    item(
        "um_4_22",
        r"After the substitution $v = y^{1 - n}$, a Bernoulli equation becomes which type in $v$?",
        r"The substitution is designed to remove the power of $y$.",
        [
            C(r"First order linear in $v$", r"Yes. The result is linear, solvable by an integrating factor."),
            W(r"Separable in $v$", r"The result is not generally separable. What standard form appears?"),
            W(r"Second order in $v$", r"The order stays first. What first order form results?"),
            W(r"Still Bernoulli in $v$", r"The power is cleared by the substitution. What simpler form is left?"),
        ],
    ),
    item(
        "um_4_23",
        r"For $y' + y = xy^{3}$, identify $n$ and the substitution.",
        r"Read $n$ from the power on the right, then use $v = y^{1 - n}$.",
        [
            C(r"$n = 3$, $v = y^{-2}$", r"Yes. The right side is $y^{3}$, so $n = 3$ and $v = y^{-2}$."),
            W(r"$n = 3$, $v = y^{-3}$", r"Compute $1 - n$ for the exponent. Is it $-2$ or $-3$?"),
            W(r"$n = 1$, $v = y^{0}$", r"The right power is $y^{3}$. What is $n$?"),
            W(r"$n = 3$, $v = y^{2}$", r"The exponent $1 - 3$ is negative. What is its value?"),
        ],
    ),
    item(
        "um_4_24",
        r"If $v = y^{1 - n}$, then $\frac{dv}{dx}$ equals which expression?",
        r"Differentiate $y^{1 - n}$ with the chain rule.",
        [
            C(r"$(1 - n)y^{-n}\frac{dy}{dx}$", r"Yes. The power rule lowers the exponent and the chain rule attaches $\frac{dy}{dx}$."),
            W(r"$(1 - n)y^{1 - n}\frac{dy}{dx}$", r"Lower the exponent by one. What power of $y$ appears?"),
            W(r"$y^{-n}\frac{dy}{dx}$", r"Do not drop the coefficient. What factor multiplies $y^{-n}$?"),
            W(r"$(1 - n)y^{-n}$", r"The chain rule attaches a derivative. What factor besides $(1-n)y^{-n}$ belongs?"),
        ],
    ),
    item(
        "um_4_25",
        r"For which $n$ is a Bernoulli equation already linear, with no substitution needed?",
        r"Look at the right side $Q(x)y^{n}$ for exponents that keep it linear.",
        [
            C(r"$n = 0$ and $n = 1$", r"Yes. With $n = 0$ the right side is $Q(x)$, and with $n = 1$ it is linear in $y$."),
            W(r"$n = 2$ and $n = 3$", r"Those give genuine nonlinear powers. Which small exponents stay linear?"),
            W(r"Only $n = 0$", r"A second exponent also stays linear. What does $n = 1$ give?"),
            W(r"Only $n = 1$", r"A second value too. What does $n = 0$ give on the right?"),
        ],
    ),
    item(
        "um_4_26",
        r"What is the first algebraic step in solving $y' + P(x)y = Q(x)y^{n}$ by hand?",
        r"You want to clear the power of $y$ from the right side.",
        [
            C(r"Divide every term by $y^{n}$", r"Yes. Dividing by $y^{n}$ prepares the substitution $v = y^{1 - n}$."),
            W(r"Multiply every term by $y^{n}$", r"That raises the powers further. Which operation clears the power instead?"),
            W(r"Integrate both sides", r"The equation is not yet integrable. What division sets up the substitution?"),
            W(r"Take the logarithm of both sides", r"A logarithm does not match the structure. What division prepares the substitution?"),
        ],
    ),
    item(
        "um_4_27",
        r"With $v = y^{-1}$, what is $\frac{dv}{dx}$ in terms of $y'$?",
        r"Differentiate $y^{-1}$ with the power and chain rules.",
        [
            C(r"$-y^{-2}y'$", r"Yes. The derivative of $y^{-1}$ is $-y^{-2}$ times $y'$."),
            W(r"$y^{-2}y'$", r"Do not lose the minus sign from the exponent $-1$. What sign appears?"),
            W(r"$-y^{-1}y'$", r"Lower the exponent by one. What power of $y$ results?"),
            W(r"$y^{-1}y'$", r"Both the sign and the exponent need care. What is the derivative of $y^{-1}$?"),
        ],
    ),
    item(
        "um_4_28",
        r"After solving the linear equation for $v$ where $v = y^{-1}$, how do you recover $y$?",
        r"Invert the relation $v = y^{-1}$.",
        [
            C(r"$y = \frac{1}{v}$", r"Yes. The reciprocal of $v = y^{-1}$ returns $y = \frac{1}{v}$."),
            W(r"$y = v$", r"The substitution was a reciprocal, not equality. What undoes a reciprocal?"),
            W(r"$y = v^{2}$", r"Squaring does not invert $v = y^{-1}$. What operation does?"),
            W(r"$y = \sqrt{v}$", r"A square root does not invert a reciprocal. How do you solve $v = y^{-1}$ for $y$?"),
        ],
    ),
    # --- Applications of Bernoulli, fluid flow (4.6) ---
    item(
        "um_4_29",
        r"The fluid Bernoulli equation $P + \frac{1}{2}\rho v^{2} + \rho g h = \text{constant}$ expresses conservation of what?",
        r"Each term is an energy per unit volume summing to a fixed total.",
        [
            C(r"Mechanical energy per unit volume along a streamline", r"Yes. The pressure, kinetic, and potential terms sum to a constant energy per unit volume."),
            W(r"Mass of the fluid", r"Mass conservation is the continuity equation. What do these energy terms conserve?"),
            W(r"Momentum of the fluid", r"Bernoulli is an energy statement. What conserved quantity do the three terms form?"),
            W(r"Temperature of the fluid", r"Temperature does not appear here. What quantity per unit volume stays constant?"),
        ],
    ),
    item(
        "um_4_30",
        r"By Bernoulli's principle, as a fluid speeds up along a streamline, its pressure does what, and in a horizontal pipe doubling the speed changes the dynamic pressure $\frac{1}{2}\rho v^{2}$ by what factor?",
        r"The total is fixed, so a larger speed term lowers pressure, and the speed term depends on $v^{2}$.",
        [
            C(r"Pressure decreases, and the dynamic pressure quadruples", r"Yes. A larger speed term forces lower pressure, and squaring a doubled speed multiplies the term by four."),
            W(r"Pressure increases, and the dynamic pressure doubles", r"Bernoulli ties faster flow to lower pressure, and the speed term scales with $v^{2}$. Reconsider both parts."),
            W(r"Pressure decreases, and the dynamic pressure doubles", r"The pressure direction is right, but $\frac{1}{2}\rho v^{2}$ depends on the square of speed. What is $(2v)^{2}$ over $v^{2}$?"),
            W(r"Pressure increases, and the dynamic pressure quadruples", r"The factor is right, but check the pressure direction. With the total fixed, does a larger speed term raise or lower pressure?"),
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

    # Exactly one correct per item, exactly four options.
    def one_correct(its, label):
        for it in its:
            n = sum(1 for o in it["answerOptions"] if o.get("correct"))
            assert n == 1, "%s %s has %d correct" % (label, it["id"], n)
            assert len(it["answerOptions"]) == 4, "%s %s not 4 options" % (label, it["id"])

    for (v, c, its) in MICRO:
        assert len(its) == 5, "%s not 5 items" % v
        one_correct(its, "micro")
    assert len(MICRO) == 12, "expected 12 micro videos, got %d" % len(MICRO)
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
    print("[+] Unit 4 quiz generation complete")
