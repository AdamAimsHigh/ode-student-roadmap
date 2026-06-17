#!/usr/bin/env python3
"""
Generate Unit 5 (Numerical Methods) and Unit 6 (Multivariable Calculus
Foundations) interactive quizzes in a single batch.

Authors the 32 video micro-practice quizzes (five items each) and the two 30
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

UNIT5_TITLE = "Unit 5: Numerical Methods"
UNIT6_TITLE = "Unit 6: Multivariable Calculus Foundations"


def C(text, rationale):
    return {"text": text, "correct": True, "rationale": rationale}


def W(text, rationale):
    return {"text": text, "rationale": rationale}


def item(qid, prompt, hint, options):
    return {"id": qid, "prompt": prompt, "hint": hint, "answerOptions": options}


MICRO = []  # list of (video_id, comment_line, [items])


def add_micro(video_id, comment, items):
    MICRO.append((video_id, comment, items))


# ============================================================================
# UNIT 5 MICRO PRACTICE
# ============================================================================

# === 5.1 video 1 ============================================================
add_micro(
    "Q6A_m9YGG6A",
    'Unit 5, Module 5.1, video 1\n           "5.1 Introducing Euler\'s Method"',
    [
        item(
            "mp_Q6A_m9YGG6A_1",
            r"Euler's method advances the solution of $\frac{dy}{dt} = f(t, y)$ using which update formula?",
            r"You start at a known point and step forward along the slope the equation gives you, scaled by the step size.",
            [
                C(r"$y_{n+1} = y_n + h\,f(t_n, y_n)$", r"Yes. You take the slope at the current point and step forward by $h$ times that slope."),
                W(r"$y_{n+1} = y_n + f(t_n, y_n)$", r"Without the step size $h$, the units do not match. What scales the slope to the length of one step?"),
                W(r"$y_{n+1} = y_n + h\,f(t_{n+1}, y_{n+1})$", r"That uses the slope at the unknown next point. Which point does the explicit method evaluate the slope at?"),
                W(r"$y_{n+1} = y_n - h\,f(t_n, y_n)$", r"Check the sign. Do you move along the slope or against it when advancing forward in $t$?"),
            ],
        ),
        item(
            "mp_Q6A_m9YGG6A_2",
            r"For $\frac{dy}{dt} = y$ with $y(0) = 1$ and step $h = 0.1$, what is the first Euler estimate $y_1$?",
            r"Apply $y_1 = y_0 + h\,f(t_0, y_0)$ with $f(t, y) = y$.",
            [
                C(r"$1.1$", r"Correct. $y_1 = 1 + 0.1 \cdot 1 = 1.1$."),
                W(r"$1.0$", r"You left the value unchanged. What does adding $0.1 \cdot 1$ to $1$ give?"),
                W(r"$1.11$", r"That looks like a second step result. What is $1 + 0.1 \cdot 1$ for the first step alone?"),
                W(r"$0.9$", r"Check the sign of the increment. Does the value grow or shrink when the slope is positive?"),
            ],
        ),
        item(
            "mp_Q6A_m9YGG6A_3",
            r"Geometrically, each Euler step follows which line away from the current point?",
            r"The differential equation hands you a slope at the current point. Picture the line through that point with that slope.",
            [
                C(r"The tangent line whose slope is $f(t_n, y_n)$", r"Yes. Euler walks along the tangent line given by the slope at the current point."),
                W(r"A horizontal line of zero slope", r"The slope is set by $f$, not fixed at zero. What line carries the slope the equation provides?"),
                W(r"The secant line between two known solution points", r"You only know one point, not two. Which line uses just the slope at the single current point?"),
                W(r"A vertical line at $t_n$", r"A vertical line cannot represent a function value advancing in $t$. What line has slope $f(t_n, y_n)$?"),
            ],
        ),
        item(
            "mp_Q6A_m9YGG6A_4",
            r"As the step size $h$ in Euler's method decreases, what generally happens to the accuracy?",
            r"Smaller steps follow the curving solution more closely before the slope has a chance to change.",
            [
                C(r"The error generally decreases", r"Yes. Smaller steps track the changing slope more closely, so the error shrinks."),
                W(r"The error generally increases", r"Smaller steps stay closer to the true curve. Does following it more tightly raise or lower error?"),
                W(r"The accuracy is unaffected by $h$", r"The whole point of $h$ is how far you stretch a fixed slope. Does stretching less change the error?"),
                W(r"The method becomes exact for any nonzero $h$", r"Euler is only an approximation while $h$ is positive. Does shrinking $h$ remove all error or merely reduce it?"),
            ],
        ),
        item(
            "mp_Q6A_m9YGG6A_5",
            r"For $\frac{dy}{dt} = t + y$ with $y(0) = 1$ and $h = 0.5$, what is $y_1$?",
            r"Evaluate the slope $f(0, 1) = 0 + 1$ first, then step forward by $h$ times that slope.",
            [
                C(r"$1.5$", r"Correct. The slope is $0 + 1 = 1$, so $y_1 = 1 + 0.5 \cdot 1 = 1.5$."),
                W(r"$1.0$", r"You skipped the increment. What is $1 + 0.5 \cdot 1$?"),
                W(r"$2.0$", r"That uses a full step of size $1$, not $0.5$. What does $0.5 \cdot 1$ contribute?"),
                W(r"$1.25$", r"Recheck the slope. Is $f(0, 1) = 0 + 1$ equal to $0.5$ or to $1$?"),
            ],
        ),
    ],
)

# === 5.1 video 2 ============================================================
add_micro(
    "6GfkRtf-A4M",
    'Unit 5, Module 5.1, video 2\n           "Why does Euler\'s Method Work?"',
    [
        item(
            "mp_6GfkRtf-A4M_1",
            r"Euler's method approximates the solution over one small step by replacing the curve with what?",
            r"Over a short interval, a smooth curve and its tangent line stay close together.",
            [
                C(r"Its tangent line, using the slope from the differential equation", r"Yes. Over a small step the tangent line is a good stand in for the curve."),
                W(r"A parabola through three sampled points", r"Euler uses only one point and one slope. What simple line approximates the curve locally?"),
                W(r"The exact integral of $f$", r"If you could integrate exactly you would not need a numerical method. What local linear object does Euler use?"),
                W(r"A constant equal to $y_n$", r"A constant ignores the slope entirely. What line carries the slope $f(t_n, y_n)$?"),
            ],
        ),
        item(
            "mp_6GfkRtf-A4M_2",
            r"The local truncation error of Euler's method, the error made in a single step, is of which order in $h$?",
            r"It comes from dropping the quadratic and higher terms of the Taylor expansion over one step.",
            [
                C(r"$O(h^2)$", r"Yes. A single Euler step omits the $\frac{h^2}{2}y''$ term, giving local error of order $h^2$."),
                W(r"$O(h)$", r"That is the global order, not the per step order. What is the order of the first dropped Taylor term?"),
                W(r"$O(h^3)$", r"The first omitted term is quadratic in $h$, not cubic. What order does that make the local error?"),
                W(r"$O(h^4)$", r"That order belongs to far more accurate methods. What is the order of the leading dropped term in Euler?"),
            ],
        ),
        item(
            "mp_6GfkRtf-A4M_3",
            r"Euler's method is called a first order method because its global error scales like what?",
            r"Accumulating many local errors of order $h^2$ over about $1/h$ steps lowers the exponent by one.",
            [
                C(r"$O(h)$", r"Yes. Summing $O(h^2)$ local errors across $O(1/h)$ steps gives global error of order $h$."),
                W(r"$O(h^2)$", r"That is the per step error before accumulation. What happens to the order after summing over $1/h$ steps?"),
                W(r"$O(1)$", r"A bounded constant error would not improve as $h$ shrinks, yet Euler does improve. What order captures that?"),
                W(r"$O(h^{1/2})$", r"The global order is a whole power of $h$, set by the local order and step count. What is it?"),
            ],
        ),
        item(
            "mp_6GfkRtf-A4M_4",
            r"If you halve the step size in Euler's method, the global error changes by approximately what factor?",
            r"For a first order method the error is roughly proportional to $h$.",
            [
                C(r"It is roughly halved", r"Yes. First order error scales with $h$, so halving $h$ roughly halves the error."),
                W(r"It is roughly quartered", r"Quartering would mean error proportional to $h^2$. What power of $h$ does a first order method carry?"),
                W(r"It is unchanged", r"Error that ignored $h$ would not be first order. How does error proportional to $h$ respond to halving $h$?"),
                W(r"It roughly doubles", r"Smaller steps reduce error rather than enlarge it. Which way does halving $h$ move a first order error?"),
            ],
        ),
        item(
            "mp_6GfkRtf-A4M_5",
            r"Why does Euler's method accumulate error as it marches forward?",
            r"The slope it uses is computed once at the start of each step and never updated within the step.",
            [
                C(r"It holds the slope fixed across each step, ignoring how the slope changes along the way", r"Yes. Freezing the slope for the whole step misses the curve's bending, and those misses add up."),
                W(r"It uses too many steps, and each adds randomness", r"The error is systematic, not random, and more steps usually help. What fixed assumption inside each step causes the drift?"),
                W(r"It divides by the step size and amplifies roundoff", r"Euler multiplies by $h$, it does not divide by it. What does holding one slope per step overlook?"),
                W(r"It requires the exact solution, which is unavailable", r"Euler never uses the exact solution. What approximation within each step is the true source of error?"),
            ],
        ),
    ],
)

# === 5.2 video 1 ============================================================
add_micro(
    "A5ObpYPADPQ",
    'Unit 5, Module 5.2, video 1\n           "Improved Euler Method"',
    [
        item(
            "mp_A5ObpYPADPQ_1",
            r"The improved Euler method updates $y$ using which combination of slopes, with $k_1 = f(t_n, y_n)$ and $k_2 = f(t_n + h, y_n + h k_1)$?",
            r"It predicts the endpoint with a plain Euler step, then averages the starting and predicted slopes.",
            [
                C(r"$y_{n+1} = y_n + \frac{h}{2}(k_1 + k_2)$", r"Yes. It averages the slope at the start and at the predicted endpoint."),
                W(r"$y_{n+1} = y_n + h k_1$", r"That is just plain Euler using one slope. What second slope does the improved method add in?"),
                W(r"$y_{n+1} = y_n + h k_2$", r"Using only the predicted endpoint slope discards the starting slope. How are the two slopes combined?"),
                W(r"$y_{n+1} = y_n + \frac{h}{3}(k_1 + 2k_2)$", r"Check the weights. Does the improved Euler method average the two slopes equally or unequally?"),
            ],
        ),
        item(
            "mp_A5ObpYPADPQ_2",
            r"For $\frac{dy}{dt} = y$ with $y(0) = 1$ and $h = 0.1$, what is the improved Euler estimate $y_1$?",
            r"Compute $k_1 = 1$, predict $y_n + h k_1 = 1.1$ so $k_2 = 1.1$, then average.",
            [
                C(r"$1.105$", r"Correct. $y_1 = 1 + \frac{0.1}{2}(1 + 1.1) = 1 + 0.05 \cdot 2.1 = 1.105$."),
                W(r"$1.1$", r"That is the plain Euler value using only $k_1$. What does averaging in $k_2 = 1.1$ add?"),
                W(r"$1.11$", r"Recheck the averaging weight. The factor is $\frac{h}{2}$, not $h$. What does that give?"),
                W(r"$1.21$", r"That doubles the increment. What is $1 + 0.05 \cdot (1 + 1.1)$?"),
            ],
        ),
        item(
            "mp_A5ObpYPADPQ_3",
            r"In the improved Euler method, the predictor step is computed using which method?",
            r"Before correcting, you need a first guess for the endpoint value to evaluate the second slope.",
            [
                C(r"A plain Euler step to estimate the endpoint value", r"Yes. The predictor is an ordinary Euler step that locates a provisional endpoint."),
                W(r"An exact integration of $f$", r"Exact integration would defeat the purpose. What simple one slope step provides the prediction?"),
                W(r"A midpoint slope evaluation", r"The midpoint slope belongs to a different method. Which basic step predicts the endpoint here?"),
                W(r"A backward implicit solve", r"No implicit equation is solved in improved Euler. What explicit step gives the predicted endpoint?"),
            ],
        ),
        item(
            "mp_A5ObpYPADPQ_4",
            r"The improved Euler method is a second order method, so its global error scales like what?",
            r"Averaging two slopes captures the curvature term that plain Euler drops, raising the order by one.",
            [
                C(r"$O(h^2)$", r"Yes. The slope averaging makes the method second order, with global error proportional to $h^2$."),
                W(r"$O(h)$", r"That is the order of plain Euler. What order does averaging the two slopes achieve?"),
                W(r"$O(h^3)$", r"Third order needs more slope samples than two. What order does a two slope average reach?"),
                W(r"$O(h^4)$", r"Fourth order is the realm of RK4. What order does improved Euler attain?"),
            ],
        ),
        item(
            "mp_A5ObpYPADPQ_5",
            r"Why does averaging the slopes at the two endpoints improve accuracy over plain Euler?",
            r"Plain Euler uses only the starting slope, but the slope generally changes across the interval.",
            [
                C(r"It better approximates the average slope across the interval, accounting for how the slope changes", r"Yes. Two slopes bracket the change, so their average tracks the true mean slope more closely."),
                W(r"It secretly uses a smaller step size", r"The step size is unchanged. What about the slope estimate itself becomes more representative?"),
                W(r"It removes the need to evaluate $f$", r"It actually evaluates $f$ twice. What does combining those two evaluations capture?"),
                W(r"It makes the method implicit", r"Improved Euler stays explicit. What property of the averaged slope reduces the error?"),
            ],
        ),
    ],
)

# === 5.2 video 2 ============================================================
add_micro(
    "2-vJuL2hqN4",
    'Unit 5, Module 5.2, video 2\n           "Modified Euler Method"',
    [
        item(
            "mp_2-vJuL2hqN4_1",
            r"The modified Euler, or midpoint, method estimates the slope at which location in the interval?",
            r"It takes a half step first, then reads the slope where it lands.",
            [
                C(r"At the midpoint $t_n + \frac{h}{2}$, using a half step Euler prediction", r"Yes. It predicts the midpoint with a half step, then uses the slope there for the full step."),
                W(r"At the left endpoint only", r"That is plain Euler. Where does the modified method move before reading the slope?"),
                W(r"At the right endpoint only", r"The right endpoint slope drives a different scheme. Which interior point does this method sample?"),
                W(r"Averaged over both endpoints", r"Endpoint averaging is the improved Euler idea. Which single interior point does the midpoint method use?"),
            ],
        ),
        item(
            "mp_2-vJuL2hqN4_2",
            r"For $\frac{dy}{dt} = y$ with $y(0) = 1$ and $h = 0.2$, what is the midpoint method estimate $y_1$?",
            r"Half step to $y_n + \frac{h}{2}f = 1 + 0.1 \cdot 1 = 1.1$, take the slope $1.1$ there, then full step.",
            [
                C(r"$1.22$", r"Correct. The midpoint slope is $1.1$, so $y_1 = 1 + 0.2 \cdot 1.1 = 1.22$."),
                W(r"$1.2$", r"That is plain Euler using the starting slope. What does the midpoint slope $1.1$ give instead?"),
                W(r"$1.1$", r"That is only the half step prediction, not the full update. What is $1 + 0.2 \cdot 1.1$?"),
                W(r"$1.221$", r"Recheck the arithmetic. What is $0.2 \cdot 1.1$ added to $1$?"),
            ],
        ),
        item(
            "mp_2-vJuL2hqN4_3",
            r"The midpoint method has which order of global accuracy?",
            r"Sampling the slope at the midpoint captures the leading curvature, like the improved Euler method.",
            [
                C(r"Second order, $O(h^2)$", r"Yes. The midpoint slope makes the method second order accurate."),
                W(r"First order, $O(h)$", r"First order is plain Euler. What order does the midpoint sampling reach?"),
                W(r"Third order, $O(h^3)$", r"Third order needs more than one interior sample. What order does a single midpoint slope give?"),
                W(r"Fourth order, $O(h^4)$", r"Fourth order belongs to RK4. What order does the midpoint method attain?"),
            ],
        ),
        item(
            "mp_2-vJuL2hqN4_4",
            r"Why is the slope at the midpoint a better representative of the whole step than the slope at the left endpoint?",
            r"Think about where a single sample best stands in for the average of a changing quantity over an interval.",
            [
                C(r"The midpoint slope is closer to the average slope over the interval", r"Yes. A midpoint sample typically matches the interval's mean slope better than an endpoint sample."),
                W(r"The midpoint is where the solution is always exact", r"No point is guaranteed exact. Why does the middle sample better represent the interval as a whole?"),
                W(r"It requires no function evaluations", r"It still evaluates $f$, in fact twice. What makes the midpoint slope more typical of the step?"),
                W(r"The left slope is always zero", r"The left slope is whatever $f$ gives, rarely zero. Why is the center a better sampling spot?"),
            ],
        ),
        item(
            "mp_2-vJuL2hqN4_5",
            r"How many evaluations of $f$ does the midpoint method require per step?",
            r"One evaluation locates the midpoint, and another reads the slope there.",
            [
                C(r"Two", r"Yes. One evaluation for the half step prediction and one for the midpoint slope."),
                W(r"One", r"A single evaluation is plain Euler. How many slopes does the midpoint method compute per step?"),
                W(r"Four", r"Four evaluations is the RK4 count. How many does a single midpoint sample need?"),
                W(r"Three", r"Count the evaluations: predict the midpoint, then read its slope. How many is that?"),
            ],
        ),
    ],
)

# === 5.3 video 1 ============================================================
add_micro(
    "wTS8SDG0_sQ",
    'Unit 5, Module 5.3, video 1\n           "7.1.4-ODEs: Heun\'s Method"',
    [
        item(
            "mp_wTS8SDG0_sQ_1",
            r"Heun's method estimates the increment using the average of the starting and predicted ending slopes, mirroring which integration rule?",
            r"Averaging the function values at the two ends of an interval to estimate an integral is a classic quadrature rule.",
            [
                C(r"The trapezoidal rule", r"Yes. Averaging the two endpoint slopes is exactly the trapezoidal estimate of the increment."),
                W(r"The midpoint rule", r"The midpoint rule samples the center, not the two ends. Which rule averages the endpoint values?"),
                W(r"Simpson's rule", r"Simpson's rule uses three weighted points. Which two point rule averages the ends?"),
                W(r"The left endpoint rule", r"The left endpoint rule uses one slope and is plain Euler. Which rule blends both ends equally?"),
            ],
        ),
        item(
            "mp_wTS8SDG0_sQ_2",
            r"In Heun's method, the predicted endpoint value $\tilde{y}_{n+1}$ is found with which formula?",
            r"The prediction is an ordinary Euler step using the slope at the current point.",
            [
                C(r"$\tilde{y}_{n+1} = y_n + h\,f(t_n, y_n)$", r"Yes. The predictor is a plain Euler step from the current point."),
                W(r"$\tilde{y}_{n+1} = y_n + \frac{h}{2}f(t_n, y_n)$", r"A half step is the midpoint idea, not Heun's predictor. What full step predicts the endpoint?"),
                W(r"$\tilde{y}_{n+1} = y_n + h\,f(t_{n+1}, \tilde{y}_{n+1})$", r"That is an implicit relation. Which explicit Euler step gives the prediction?"),
                W(r"$\tilde{y}_{n+1} = y_n - h\,f(t_n, y_n)$", r"Check the sign of a forward step. Which direction does the predictor move?"),
            ],
        ),
        item(
            "mp_wTS8SDG0_sQ_3",
            r"The corrector step in Heun's method computes $y_{n+1}$ as which expression?",
            r"It averages the slope at the start with the slope at the predicted endpoint, scaled by $h$.",
            [
                C(r"$y_n + \frac{h}{2}\left[f(t_n, y_n) + f(t_{n+1}, \tilde{y}_{n+1})\right]$", r"Yes. The corrector averages the two slopes and scales by $h$."),
                W(r"$y_n + h\,f(t_{n+1}, \tilde{y}_{n+1})$", r"That uses only the endpoint slope. How does Heun blend it with the starting slope?"),
                W(r"$y_n + \frac{h}{2}f(t_n, y_n)$", r"That is a half step on one slope. Which two slopes does the corrector combine?"),
                W(r"$\tilde{y}_{n+1}$", r"That is just the predictor, with no correction. What averaged increment refines it?"),
            ],
        ),
        item(
            "mp_wTS8SDG0_sQ_4",
            r"For $\frac{dy}{dt} = t + y$ with $y(0) = 1$ and $h = 0.2$, what is the Heun estimate $y_1$?",
            r"Compute $k_1 = 0 + 1 = 1$, predict $1.2$, then $k_2 = f(0.2, 1.2) = 1.4$, and average.",
            [
                C(r"$1.24$", r"Correct. $y_1 = 1 + \frac{0.2}{2}(1 + 1.4) = 1 + 0.1 \cdot 2.4 = 1.24$."),
                W(r"$1.2$", r"That is the plain Euler predictor. What does averaging in $k_2 = 1.4$ change?"),
                W(r"$1.4$", r"That is the predicted endpoint slope, not the new $y$ value. What is $1 + 0.1(1 + 1.4)$?"),
                W(r"$1.28$", r"Recheck the averaging factor $\frac{h}{2} = 0.1$. What does $0.1 \cdot 2.4$ give?"),
            ],
        ),
        item(
            "mp_wTS8SDG0_sQ_5",
            r"Heun's method has what order of global accuracy?",
            r"Averaging two slopes captures the curvature term, the same gain seen in the improved Euler method.",
            [
                C(r"Second order", r"Yes. Heun's method is second order accurate, with global error proportional to $h^2$."),
                W(r"First order", r"First order is plain Euler. What order does the two slope average produce?"),
                W(r"Third order", r"Third order needs additional slope samples. What order does Heun reach with two?"),
                W(r"Fourth order", r"Fourth order is RK4. What order is Heun's method?"),
            ],
        ),
    ],
)

# === 5.3 video 2 ============================================================
add_micro(
    "aeRqofNb3_4",
    'Unit 5, Module 5.3, video 2\n           "Heun\'s Method (improved Euler)"',
    [
        item(
            "mp_aeRqofNb3_4_1",
            r"Heun's method is another name for which method?",
            r"It uses a plain Euler predictor and then averages the two endpoint slopes to correct.",
            [
                C(r"The improved Euler method", r"Yes. Heun's method and the improved Euler method are the same predictor corrector scheme."),
                W(r"The modified Euler midpoint method", r"The midpoint method samples the center, not the two ends. Which endpoint averaging method matches Heun?"),
                W(r"The RK4 method", r"RK4 uses four slopes. Which two slope method shares Heun's name?"),
                W(r"The backward Euler method", r"Backward Euler is implicit and uses the endpoint alone. Which explicit averaging method is Heun?"),
            ],
        ),
        item(
            "mp_aeRqofNb3_4_2",
            r"Heun's method evaluates $f$ twice per step because it needs which two slopes?",
            r"One slope comes from where you stand now, the other from where a plain Euler step predicts you will land.",
            [
                C(r"The slope at the current point and the slope at the predicted endpoint", r"Yes. One evaluation at the start and one at the predicted endpoint give the two slopes to average."),
                W(r"The slope at the midpoint and the slope at the endpoint", r"Heun does not use a midpoint slope. Which two points does it actually sample?"),
                W(r"Two slopes both taken at the starting point", r"Sampling the same point twice gives no new information. Where is the second slope taken?"),
                W(r"The second derivative evaluated twice", r"Heun uses first order slopes, not second derivatives. Which two slope values does it average?"),
            ],
        ),
        item(
            "mp_aeRqofNb3_4_3",
            r"For $\frac{dy}{dt} = 2t$ with $y(0) = 0$ and $h = 0.5$, what is the Heun estimate $y_1$?",
            r"Here $k_1 = 0$, the predictor is $0$, and $k_2 = f(0.5, 0) = 1$. Average the slopes.",
            [
                C(r"$0.25$", r"Correct. $y_1 = 0 + \frac{0.5}{2}(0 + 1) = 0.25$, which matches the exact value $t^2$ at $0.5$."),
                W(r"$0$", r"That ignores the endpoint slope $k_2 = 1$. What does averaging $0$ and $1$ contribute?"),
                W(r"$0.5$", r"That uses a full step on slope $1$. What does the factor $\frac{h}{2} = 0.25$ give?"),
                W(r"$0.125$", r"Recheck the average of the slopes. What is $0.25 \cdot (0 + 1)$?"),
            ],
        ),
        item(
            "mp_aeRqofNb3_4_4",
            r"Compared with plain Euler at the same step size, Heun's method generally produces what?",
            r"It corrects the plain Euler prediction by accounting for how the slope changes across the step.",
            [
                C(r"Smaller error, since it accounts for the changing slope", r"Yes. The slope correction makes Heun more accurate than plain Euler at the same step size."),
                W(r"Larger error, since it does more arithmetic", r"Extra slope information helps rather than hurts. Which way does the correction move the error?"),
                W(r"Identical error, since both are explicit", r"Being explicit does not fix accuracy. What does the second slope do to the error?"),
                W(r"Zero error in all cases", r"Heun is still an approximation. Does it reduce the error or eliminate it entirely?"),
            ],
        ),
        item(
            "mp_aeRqofNb3_4_5",
            r"Heun's method belongs to which family of methods?",
            r"It first predicts an endpoint, then corrects that prediction with a better slope estimate.",
            [
                C(r"Predictor corrector methods", r"Yes. Heun predicts with a plain Euler step and corrects with the averaged slope."),
                W(r"Implicit one step methods", r"Heun is explicit, with no equation to solve for the unknown. Which predict then correct family fits?"),
                W(r"Multistep methods only", r"Heun uses just the previous point, not several past points. Which single step family does it belong to?"),
                W(r"Spectral methods", r"Spectral methods expand in basis functions, unlike Heun. Which stepwise family describes it?"),
            ],
        ),
    ],
)

# === 5.4 video 1 ============================================================
add_micro(
    "ydFM5yON-24",
    'Unit 5, Module 5.4, video 1\n           "The RK4 method"',
    [
        item(
            "mp_ydFM5yON-24_1",
            r"RK4 combines its four slopes $k_1, k_2, k_3, k_4$ using which weighted average?",
            r"The midpoint slopes are weighted more heavily than the endpoint slopes, and the total weight divides by six.",
            [
                C(r"$y_{n+1} = y_n + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$", r"Yes. The two midpoint slopes get double weight, and the sum is scaled by $\frac{h}{6}$."),
                W(r"$y_{n+1} = y_n + \frac{h}{4}(k_1 + k_2 + k_3 + k_4)$", r"Equal weights miss the emphasis on the midpoint slopes. Which slopes does RK4 weight twice?"),
                W(r"$y_{n+1} = y_n + \frac{h}{6}(k_1 + 3k_2 + 3k_3 + k_4)$", r"Check the weights. Do the middle slopes carry a factor of two or three?"),
                W(r"$y_{n+1} = y_n + h k_1$", r"That is plain Euler with one slope. How many slopes does RK4 combine, and with what weights?"),
            ],
        ),
        item(
            "mp_ydFM5yON-24_2",
            r"In RK4, the first slope $k_1$ is evaluated where?",
            r"It is the very first sample, taken before any trial step is made.",
            [
                C(r"At the current point $(t_n, y_n)$", r"Yes. $k_1$ is the slope at the starting point, just as in plain Euler."),
                W(r"At the midpoint $(t_n + \frac{h}{2}, y_n + \frac{h}{2}k_1)$", r"That describes $k_2$. Where is the very first slope taken?"),
                W(r"At the endpoint $(t_n + h, y_n + h k_3)$", r"That is $k_4$. Which slope is computed first, before any trial step?"),
                W(r"At $(t_n + h, y_n)$", r"RK4 does not sample there. Where does the initial slope $k_1$ sit?"),
            ],
        ),
        item(
            "mp_ydFM5yON-24_3",
            r"Why do $k_2$ and $k_3$ carry twice the weight of $k_1$ and $k_4$ in RK4?",
            r"The weights match a well known three point quadrature rule that emphasizes the center of the interval.",
            [
                C(r"They sample the slope near the midpoint, which Simpson's rule weights more heavily", r"Yes. The RK4 weights mirror Simpson's rule, which gives the midpoint the largest weight."),
                W(r"They are always larger in value than $k_1$ and $k_4$", r"The weighting is about position, not size. Which quadrature rule gives the center extra weight?"),
                W(r"They are each evaluated twice", r"Each slope is computed once. Why does the midpoint region deserve a larger weight?"),
                W(r"They correct for the step size $h$", r"The factor $h$ is handled separately. What rule sets the two to one weighting pattern?"),
            ],
        ),
        item(
            "mp_ydFM5yON-24_4",
            r"For $\frac{dy}{dt} = 2t$ with $y(0) = 0$ and $h = 1$, what is the RK4 estimate $y_1$?",
            r"Since $f$ depends only on $t$: $k_1 = 0$, $k_2 = k_3 = 2(0.5) = 1$, $k_4 = 2(1) = 2$. Apply the weighted average.",
            [
                C(r"$1$", r"Correct. $y_1 = \frac{1}{6}(0 + 2 + 2 + 2) = 1$, matching the exact value $t^2$ at $t = 1$."),
                W(r"$0.5$", r"Recompute the weighted sum. What is $\frac{1}{6}(0 + 2 \cdot 1 + 2 \cdot 1 + 2)$?"),
                W(r"$2$", r"That is the endpoint slope $k_4$ alone. How does the full weighted average reduce it?"),
                W(r"$0.75$", r"Check each slope and weight carefully. What does $\frac{1}{6}(0 + 2 + 2 + 2)$ equal?"),
            ],
        ),
        item(
            "mp_ydFM5yON-24_5",
            r"RK4 is a fourth order method, so its global error scales like what?",
            r"The four carefully weighted slopes match the Taylor expansion through the fourth order term.",
            [
                C(r"$O(h^4)$", r"Yes. RK4 has global error proportional to $h^4$, which is why it is so accurate."),
                W(r"$O(h^2)$", r"Second order is the level of Heun and the midpoint method. What order does four weighted slopes reach?"),
                W(r"$O(h)$", r"First order is plain Euler. What much higher order does RK4 achieve?"),
                W(r"$O(h^6)$", r"Sixth order needs even more stages. What order does the classical four stage method reach?"),
            ],
        ),
    ],
)

# === 5.4 video 2 ============================================================
add_micro(
    "1YZnic1Ug9g",
    'Unit 5, Module 5.4, video 2\n           "4th-Order Runge Kutta Method for ODEs"',
    [
        item(
            "mp_1YZnic1Ug9g_1",
            r"How many evaluations of $f$ does RK4 require per step?",
            r"Count the distinct slopes $k_1$ through $k_4$.",
            [
                C(r"Four", r"Yes. RK4 evaluates $f$ four times per step, once for each slope."),
                W(r"One", r"One evaluation is plain Euler. How many slopes does the fourth order method use?"),
                W(r"Two", r"Two evaluations is Heun or the midpoint method. How many slopes does RK4 sample?"),
                W(r"Six", r"The classical method uses fewer than six. How many $k$ values appear in RK4?"),
            ],
        ),
        item(
            "mp_1YZnic1Ug9g_2",
            r"If you halve the step size in RK4, the global error decreases by approximately what factor?",
            r"For a fourth order method the error scales like $h^4$, so consider $2^4$.",
            [
                C(r"About $16$", r"Yes. Fourth order error scales as $h^4$, and $2^4 = 16$."),
                W(r"About $4$", r"That would be second order behavior. What is $2$ raised to the fourth power?"),
                W(r"About $2$", r"That would be first order behavior. What factor comes from $h^4$ when $h$ halves?"),
                W(r"About $8$", r"That is $2^3$, a third order factor. What power matches RK4?"),
            ],
        ),
        item(
            "mp_1YZnic1Ug9g_3",
            r"In RK4, the fourth slope $k_4$ uses which point?",
            r"It is the slope at the far end of the step, using the increment built from $k_3$.",
            [
                C(r"$(t_n + h, y_n + h k_3)$", r"Yes. The final slope is evaluated at the endpoint, stepping with $k_3$."),
                W(r"$(t_n, y_n)$", r"That is the starting point used by $k_1$. Where does the last slope $k_4$ sit?"),
                W(r"$(t_n + \frac{h}{2}, y_n + \frac{h}{2}k_2)$", r"That is the second midpoint slope $k_3$. Where is the final endpoint slope taken?"),
                W(r"$(t_n + h, y_n)$", r"The endpoint value must include the increment from $k_3$. What $y$ position does $k_4$ use?"),
            ],
        ),
        item(
            "mp_1YZnic1Ug9g_4",
            r"Compared with Euler at the same step size, RK4 typically gives much higher accuracy because it does what?",
            r"Instead of trusting one slope, it probes the step at several places and blends the results.",
            [
                C(r"It samples the slope at several points within the step and averages them", r"Yes. Multiple weighted slope samples capture the curve's bending far better than one slope."),
                W(r"It automatically uses a much smaller step", r"The step size is the same in the comparison. What does RK4 do within each step that Euler does not?"),
                W(r"It solves the equation exactly", r"RK4 is still an approximation. What sampling strategy gives it the edge over Euler?"),
                W(r"It ignores the endpoints entirely", r"RK4 uses both endpoints and the midpoint. What is its real source of accuracy?"),
            ],
        ),
        item(
            "mp_1YZnic1Ug9g_5",
            r"RK4 is a single step method, meaning each new value depends on what?",
            r"Think about how much past history the update formula actually requires.",
            [
                C(r"Only the value at the immediately previous step", r"Yes. RK4 needs just the current point to produce the next, making it self starting."),
                W(r"The previous four steps", r"The four refers to the order and slope count, not stored history. How many past points does it need?"),
                W(r"All prior steps from the start", r"RK4 carries no long history. How many previous values does each update use?"),
                W(r"Future steps not yet computed", r"An explicit method never uses future values. Which single prior value does it rely on?"),
            ],
        ),
    ],
)

# === 5.5 video 1 ============================================================
add_micro(
    "b-OSyxOpxKc",
    'Unit 5, Module 5.5, video 1\n           "7.1.2-ODEs: Introduction to Runge-Kutta Methods"',
    [
        item(
            "mp_b-OSyxOpxKc_1",
            r"Runge-Kutta methods of all orders share which common strategy?",
            r"Each one probes the slope at several places inside the step and blends them.",
            [
                C(r"They take a weighted combination of slope evaluations within each step", r"Yes. Every Runge-Kutta method blends several sampled slopes with chosen weights."),
                W(r"They require the exact solution to start", r"No exact solution is needed. What do these methods do with several slope samples?"),
                W(r"They use only the left endpoint slope", r"One slope is plain Euler, the simplest member. What do higher members add?"),
                W(r"They store many past steps", r"That describes multistep methods. What single step strategy defines the Runge-Kutta family?"),
            ],
        ),
        item(
            "mp_b-OSyxOpxKc_2",
            r"The simplest member of the Runge-Kutta family, using one slope evaluation, is which method?",
            r"A single slope sample at the start of the step is the most basic scheme you know.",
            [
                C(r"Euler's method", r"Yes. Plain Euler is the one stage, first order Runge-Kutta method."),
                W(r"RK4", r"RK4 uses four slopes. Which method uses just one?"),
                W(r"Heun's method", r"Heun uses two slopes. Which single slope method is the simplest?"),
                W(r"The midpoint method", r"The midpoint method uses two evaluations. Which uses only one?"),
            ],
        ),
        item(
            "mp_b-OSyxOpxKc_3",
            r"The coefficients of a Runge-Kutta method are commonly organized in what?",
            r"There is a standard tableau named after a numerical analyst that lays out the nodes, weights, and stage coefficients.",
            [
                C(r"A Butcher tableau", r"Yes. The Butcher tableau compactly stores the nodes, weights, and internal coefficients."),
                W(r"A Jacobian matrix", r"The Jacobian holds partial derivatives, not method coefficients. What named tableau stores Runge-Kutta data?"),
                W(r"A Wronskian", r"The Wronskian tests linear independence of solutions. What array holds the method's coefficients?"),
                W(r"A phase portrait", r"A phase portrait pictures trajectories, not coefficients. What tableau organizes the weights and nodes?"),
            ],
        ),
        item(
            "mp_b-OSyxOpxKc_4",
            r"Higher order Runge-Kutta methods generally require what in exchange for greater accuracy?",
            r"More accuracy comes from probing the step in more places.",
            [
                C(r"More function evaluations per step", r"Yes. Each added stage means another slope evaluation, the cost of higher order."),
                W(r"Fewer function evaluations per step", r"Greater accuracy does not come for free. Which way does the evaluation count move with order?"),
                W(r"A larger step size automatically", r"The step size is independent of order. What grows when the order grows?"),
                W(r"An implicit solver in every case", r"Many high order methods are explicit. What per step cost rises with the order?"),
            ],
        ),
        item(
            "mp_b-OSyxOpxKc_5",
            r"A general second order Runge-Kutta method uses how many slope evaluations, or stages, per step?",
            r"Heun and the midpoint method are both second order examples. Count their slope evaluations.",
            [
                C(r"Two", r"Yes. Second order Runge-Kutta methods use two stages, as in Heun and the midpoint method."),
                W(r"One", r"One stage gives only first order Euler. How many stages reach second order?"),
                W(r"Four", r"Four stages is the classical fourth order count. How many give second order?"),
                W(r"Three", r"Three stages typically aim for third order. How many stages does second order need?"),
            ],
        ),
    ],
)

# === 5.5 video 2 ============================================================
add_micro(
    "Rad-9gfIj5s",
    'Unit 5, Module 5.5, video 2\n           "The Theory of Runge-Kutta Methods"',
    [
        item(
            "mp_Rad-9gfIj5s_1",
            r"The order conditions that a Runge-Kutta method must satisfy come from matching what?",
            r"You compare the numerical update term by term against the true solution expanded in a power series.",
            [
                C(r"The method's Taylor expansion to the exact solution's Taylor expansion", r"Yes. Matching Taylor series term by term yields the order conditions on the coefficients."),
                W(r"The boundary conditions of the problem", r"Order is about local accuracy, not boundary data. Which series comparison sets the conditions?"),
                W(r"The eigenvalues of the system", r"Eigenvalues govern stability, not the order conditions. What expansion must the method match?"),
                W(r"The initial condition alone", r"A single initial value does not pin down the coefficients. What series matching does?"),
            ],
        ),
        item(
            "mp_Rad-9gfIj5s_2",
            r"In an explicit Runge-Kutta method, each stage slope depends only on what?",
            r"Explicit means you can compute the stages one after another with no equation solving.",
            [
                C(r"Slopes already computed at earlier stages", r"Yes. Each explicit stage uses only previously found slopes, so no system must be solved."),
                W(r"Slopes at all stages including itself", r"Self dependence makes a method implicit. What does an explicit stage rely on instead?"),
                W(r"Future steps", r"No method uses future steps. Which earlier information does an explicit stage use?"),
                W(r"The exact solution", r"The exact solution is unknown. Which already computed quantities feed an explicit stage?"),
            ],
        ),
        item(
            "mp_Rad-9gfIj5s_3",
            r"For a Runge-Kutta method to be consistent, the weights $b_i$ in the final combination must satisfy what?",
            r"Consistency at minimum requires the method to reproduce the simplest case correctly over one step.",
            [
                C(r"They sum to one", r"Yes. The weights must sum to one for the method to be consistent."),
                W(r"They sum to zero", r"Weights summing to zero would give no net step. What must they sum to for consistency?"),
                W(r"They each equal the step size", r"The weights are dimensionless numbers, not step sizes. What is their required total?"),
                W(r"They sum to the order of the method", r"The sum is fixed regardless of order. What single value must the weights total?"),
            ],
        ),
        item(
            "mp_Rad-9gfIj5s_4",
            r"The classical RK4 method has how many stages?",
            r"The name encodes both the order and, in this classical case, the stage count.",
            [
                C(r"Four", r"Yes. Classical RK4 uses four stages to reach fourth order accuracy."),
                W(r"Two", r"Two stages reach only second order. How many stages does classical RK4 use?"),
                W(r"Six", r"Six stages would aim higher than fourth order. How many does the classical method use?"),
                W(r"Three", r"Three stages typically give third order. How many stages does RK4 have?"),
            ],
        ),
        item(
            "mp_Rad-9gfIj5s_5",
            r"Implicit Runge-Kutta methods are valued primarily because they offer what?",
            r"Their main advantage shows up on problems with widely separated time scales.",
            [
                C(r"Better stability for stiff problems", r"Yes. Implicit methods can stay stable on stiff problems where explicit methods would need tiny steps."),
                W(r"Fewer stages in every case", r"Stage count is not their advantage. What property helps them on stiff problems?"),
                W(r"Exact solutions", r"Implicit methods are still approximate. What stability benefit do they provide?"),
                W(r"No equations to solve", r"Implicit methods require solving equations each step. What do they gain in return?"),
            ],
        ),
    ],
)

# === 5.6 video 1 ============================================================
add_micro(
    "JcRsGD2pKlA",
    'Unit 5, Module 5.6, video 1\n           "Learning the Runge-Kutta Method 2. Adaptive Step Size"',
    [
        item(
            "mp_JcRsGD2pKlA_1",
            r"Adaptive step size methods choose the step size $h$ based on what?",
            r"They watch how much error each tentative step seems to be making and react to it.",
            [
                C(r"An estimate of the local error at each step", r"Yes. The step size is tuned step by step using an on the fly error estimate."),
                W(r"A fixed schedule set in advance", r"A preset schedule cannot react to the solution. What measured quantity drives an adaptive choice?"),
                W(r"The total number of steps allowed", r"A step budget does not set each individual size. What local quantity guides the adaptation?"),
                W(r"The initial condition alone", r"The starting value cannot dictate every future step. What ongoing estimate controls $h$?"),
            ],
        ),
        item(
            "mp_JcRsGD2pKlA_2",
            r"When the estimated local error exceeds the tolerance, an adaptive method does what?",
            r"Too much error means the current step is too ambitious.",
            [
                C(r"Reduces the step size and retries", r"Yes. If the error is too large, the method shrinks $h$ and repeats the step."),
                W(r"Increases the step size", r"Growing the step would worsen an already large error. Which way should $h$ move?"),
                W(r"Stops the computation", r"An error overshoot is recoverable. What adjustment lets the method continue accurately?"),
                W(r"Ignores the error and proceeds", r"Ignoring the tolerance defeats adaptation. What does the method do when error is too high?"),
            ],
        ),
        item(
            "mp_JcRsGD2pKlA_3",
            r"A common way to estimate the local error for adaptive stepping is to compare what?",
            r"You need two estimates of the same step that differ in accuracy, so their gap reveals the error.",
            [
                C(r"Results from two methods of different order, or two different step sizes", r"Yes. The difference between a lower and higher order result estimates the local error."),
                W(r"The initial and final times", r"The time span does not measure step error. Which two solution estimates does it compare?"),
                W(r"Two unrelated differential equations", r"Only the current problem matters. What two estimates of this step are compared?"),
                W(r"The exact and numerical solution", r"The exact solution is unknown, so it cannot be used. What computable pair estimates the error?"),
            ],
        ),
        item(
            "mp_JcRsGD2pKlA_4",
            r"The main efficiency benefit of adaptive stepping is that it uses small steps where?",
            r"Effort should be concentrated where the solution is hardest to follow.",
            [
                C(r"Only where the solution changes rapidly, and larger steps elsewhere", r"Yes. Adaptation spends small steps on fast changing regions and saves effort on smooth ones."),
                W(r"Everywhere uniformly", r"Uniform small steps waste effort on easy regions. Where does adaptation focus the small steps?"),
                W(r"Only at the start of the interval", r"The hard regions can appear anywhere. Where does an adaptive method place its fine steps?"),
                W(r"Only at the end of the interval", r"There is no reason to favor the end. Where are small steps actually needed?"),
            ],
        ),
        item(
            "mp_JcRsGD2pKlA_5",
            r"The Runge-Kutta-Fehlberg, or RKF45, method estimates error by pairing methods of which orders?",
            r"The name 45 encodes the two orders it runs side by side.",
            [
                C(r"Orders four and five", r"Yes. RKF45 pairs a fourth order and a fifth order estimate, and their difference gauges the error."),
                W(r"Orders one and two", r"Those low orders would not match the name. Which two orders does 45 indicate?"),
                W(r"Orders two and three", r"The digits in the name point higher. Which orders does RKF45 pair?"),
                W(r"Orders five and six", r"The pairing is one order lower than that. What two orders does RKF45 use?"),
            ],
        ),
    ],
)

# === 5.6 video 2 ============================================================
add_micro(
    "uzCD3K3VOV4",
    'Unit 5, Module 5.6, video 2\n           "Orbital Motion: Euler vs. Runge-Kutta"',
    [
        item(
            "mp_uzCD3K3VOV4_1",
            r"In a long orbital simulation, plain Euler's method typically causes the orbit to do what?",
            r"Small per step errors in energy build up over thousands of steps.",
            [
                C(r"Spiral outward or inward as energy drifts, due to accumulated error", r"Yes. Euler's accumulated error makes the simulated orbit gain or lose energy and spiral."),
                W(r"Stay perfectly periodic forever", r"Perfect periodicity would require no error at all. What does accumulated error do to the orbit?"),
                W(r"Stop moving immediately", r"The simulation keeps running. What slow defect appears in the orbit shape over time?"),
                W(r"Become exact after many steps", r"Errors accumulate rather than cancel. What happens to the orbit radius as they build?"),
            ],
        ),
        item(
            "mp_uzCD3K3VOV4_2",
            r"Compared with Euler, RK4 in an orbital simulation at the same step size does what?",
            r"A fourth order method makes far smaller errors per step.",
            [
                C(r"Tracks the true orbit far more closely with less energy drift", r"Yes. RK4's small per step error keeps the orbit close to the true path for much longer."),
                W(r"Drifts away faster than Euler", r"Higher order means smaller error. Which method holds the orbit better?"),
                W(r"Gives results identical to Euler", r"The methods differ sharply in accuracy. Which one keeps the orbit tighter?"),
                W(r"Cannot simulate orbits at all", r"RK4 handles orbits well. How does its accuracy compare with Euler's here?"),
            ],
        ),
        item(
            "mp_uzCD3K3VOV4_3",
            r"Over a long simulation with many steps, why does the choice of method matter so much?",
            r"Think about how individual step errors combine across a very large number of steps.",
            [
                C(r"Per step errors accumulate, so a higher order method keeps the total error small", r"Yes. With many steps the accumulated error dominates, so a higher order method pays off."),
                W(r"Each step is independent with no accumulation", r"Errors do build on one another. Why does that make the method choice critical over long runs?"),
                W(r"The method has no effect on long runs", r"The method strongly affects accuracy. Why does its effect grow with the number of steps?"),
                W(r"Error decreases automatically with more steps", r"More steps over a fixed span means smaller $h$, but error per method still accumulates. Why does order matter?"),
            ],
        ),
        item(
            "mp_uzCD3K3VOV4_4",
            r"One way to reduce Euler's orbital drift is to shrink the step size, but the cost is what?",
            r"Halving the step over a fixed time span doubles how many steps you must compute.",
            [
                C(r"Many more steps and more computation", r"Yes. Smaller steps reduce error but require proportionally more work."),
                W(r"Less accuracy", r"Smaller steps improve accuracy, not worsen it. What is the trade off in effort?"),
                W(r"A higher order method automatically", r"Shrinking $h$ does not change the method's order. What computational price does it carry?"),
                W(r"No change in runtime", r"More steps take more time. How does the runtime respond to a smaller step size?"),
            ],
        ),
        item(
            "mp_uzCD3K3VOV4_5",
            r"A good check on a numerical orbit method is whether it approximately conserves which quantity?",
            r"For a closed orbit under gravity, one scalar quantity should stay essentially constant.",
            [
                C(r"The total energy of the orbit", r"Yes. A faithful method keeps the total energy nearly constant over the orbit."),
                W(r"The number of steps", r"The step count is a setting, not a conserved physical quantity. What physical quantity should hold steady?"),
                W(r"The step size", r"The step size is chosen, not conserved. Which physical invariant tests the method?"),
                W(r"The initial time", r"The starting time is fixed input. What conserved quantity signals a good orbit method?"),
            ],
        ),
    ],
)


# ============================================================================
# UNIT 6 MICRO PRACTICE
# ============================================================================

# === 6.1 video 1 ============================================================
add_micro(
    "Rvnv3bPDCs8",
    'Unit 6, Module 6.1, video 1\n           "Part III: Partial Derivatives, Lec 6 | MIT Calculus Revisited: Multivariable Calculus"',
    [
        item(
            "mp_Rvnv3bPDCs8_1",
            r"To compute the partial derivative $f_x$ of $f(x, y)$, you differentiate with respect to $x$ while doing what?",
            r"A partial derivative isolates the effect of one variable by freezing the others.",
            [
                C(r"Holding $y$ constant", r"Yes. You treat $y$ as a constant and differentiate in $x$ only."),
                W(r"Holding $x$ constant", r"You are differentiating in $x$, so $x$ must vary. Which variable is held fixed?"),
                W(r"Setting $y = 0$", r"Fixing $y$ at a value is not the same as treating it as a constant symbol. What happens to $y$ during the differentiation?"),
                W(r"Differentiating with respect to both variables at once", r"A partial derivative changes only one variable. Which variable stays frozen while $x$ moves?"),
            ],
        ),
        item(
            "mp_Rvnv3bPDCs8_2",
            r"For $f(x, y) = x^2 y + y^3$, what is $f_x$?",
            r"Treat $y$ as a constant and differentiate each term in $x$.",
            [
                C(r"$2xy$", r"Correct. The first term gives $2xy$, and $y^3$ has no $x$ so it differentiates to zero."),
                W(r"$2xy + 3y^2$", r"The term $3y^2$ is the $y$ derivative of $y^3$, not the $x$ derivative. What is $\frac{\partial}{\partial x}(y^3)$?"),
                W(r"$x^2$", r"That is the coefficient of $y$, not the $x$ derivative of $x^2 y$. What is $\frac{\partial}{\partial x}(x^2 y)$?"),
                W(r"$2x$", r"Do not drop the constant factor $y$ from $x^2 y$. What multiplies $2x$ here?"),
            ],
        ),
        item(
            "mp_Rvnv3bPDCs8_3",
            r"For $f(x, y) = x^2 y + y^3$, what is $f_y$?",
            r"Now treat $x$ as a constant and differentiate each term in $y$.",
            [
                C(r"$x^2 + 3y^2$", r"Correct. The term $x^2 y$ gives $x^2$, and $y^3$ gives $3y^2$."),
                W(r"$2xy$", r"That is the $x$ derivative. What do you get differentiating in $y$ instead?"),
                W(r"$x^2$", r"You handled the first term but dropped $y^3$. What is $\frac{\partial}{\partial y}(y^3)$?"),
                W(r"$3y^2$", r"You handled $y^3$ but dropped $x^2 y$. What is $\frac{\partial}{\partial y}(x^2 y)$?"),
            ],
        ),
        item(
            "mp_Rvnv3bPDCs8_4",
            r"Geometrically, $f_x(a, b)$ gives the slope of the surface $z = f(x, y)$ in which direction?",
            r"Holding $y$ fixed at $b$ slices the surface into a curve. The partial is the slope of that curve.",
            [
                C(r"The $x$ direction, along the slice $y = b$", r"Yes. Freezing $y = b$ gives a curve in $x$, and $f_x$ is its slope."),
                W(r"The $y$ direction", r"That slope is given by $f_y$. Which variable does $f_x$ let vary?"),
                W(r"Straight up the $z$ axis", r"A slope measures rise over horizontal run, not a vertical direction. Along which horizontal axis does $f_x$ point?"),
                W(r"The steepest direction at the point", r"The steepest direction is the gradient, generally not aligned with an axis. Which axis does $f_x$ follow?"),
            ],
        ),
        item(
            "mp_Rvnv3bPDCs8_5",
            r"Which of these is standard notation for the partial derivative of $f$ with respect to $x$?",
            r"The partial derivative uses a special rounded symbol to distinguish it from the ordinary derivative.",
            [
                C(r"$\frac{\partial f}{\partial x}$", r"Yes. The rounded partial symbol signals differentiation with the other variables held fixed."),
                W(r"$\frac{df}{dx}$", r"That ordinary derivative is for single variable functions. What symbol marks a partial derivative?"),
                W(r"$\Delta f$", r"That denotes a change or the Laplacian, not a partial derivative. Which rounded symbol is standard?"),
                W(r"$\int f\,dx$", r"That is an integral, the opposite operation. What notation denotes the partial derivative?"),
            ],
        ),
    ],
)

# === 6.1 video 2 ============================================================
add_micro(
    "JJG2t5IBKy4",
    'Unit 6, Module 6.1, video 2\n           "Partial derivatives - Chain rule for higher derivatives"',
    [
        item(
            "mp_JJG2t5IBKy4_1",
            r"The second partial derivative $f_{xx}$ is obtained by doing what?",
            r"It is a derivative of a derivative, both taken in the same variable.",
            [
                C(r"Differentiating $f_x$ again with respect to $x$", r"Yes. You take the $x$ partial twice in a row."),
                W(r"Differentiating $f$ with respect to $y$ twice", r"That would be $f_{yy}$. Which variable does $f_{xx}$ use both times?"),
                W(r"Multiplying $f_x$ by $x$", r"A second derivative is another differentiation, not a multiplication. What operation gives $f_{xx}$?"),
                W(r"Integrating $f_x$ with respect to $x$", r"Integration undoes differentiation. What repeated operation produces $f_{xx}$?"),
            ],
        ),
        item(
            "mp_JJG2t5IBKy4_2",
            r"For $f = x^3 y^2$, what is $f_{xx}$?",
            r"First find $f_x$, then differentiate that again with respect to $x$.",
            [
                C(r"$6x y^2$", r"Correct. $f_x = 3x^2 y^2$, and differentiating again gives $6x y^2$."),
                W(r"$3x^2 y^2$", r"That is only the first partial $f_x$. What do you get differentiating it once more in $x$?"),
                W(r"$6xy$", r"Do not change the $y^2$ factor when differentiating in $x$. What power of $y$ remains?"),
                W(r"$2x^3 y$", r"That is $f_y$, the $y$ derivative. What is the second $x$ derivative instead?"),
            ],
        ),
        item(
            "mp_JJG2t5IBKy4_3",
            r"For $f = x^3 y^2$, what is the mixed partial $f_{xy}$?",
            r"Take $f_x$ first, then differentiate that result with respect to $y$.",
            [
                C(r"$6x^2 y$", r"Correct. $f_x = 3x^2 y^2$, and differentiating in $y$ gives $6x^2 y$."),
                W(r"$3x^2 y^2$", r"That is $f_x$ before the $y$ differentiation. What is $\frac{\partial}{\partial y}(3x^2 y^2)$?"),
                W(r"$6x y^2$", r"That is $f_{xx}$. What do you get differentiating $f_x$ in $y$ instead of $x$?"),
                W(r"$2x^3 y$", r"That is $f_y$, taken before any $x$ differentiation. What is $f_{xy}$?"),
            ],
        ),
        item(
            "mp_JJG2t5IBKy4_4",
            r"In the notation $f_{xy}$, the differentiation is performed in which order?",
            r"Subscript notation is read from left to right as the order of operations.",
            [
                C(r"First with respect to $x$, then with respect to $y$", r"Yes. The subscripts are applied left to right, so $x$ first then $y$."),
                W(r"First $y$, then $x$", r"That left to right reading is reversed. Which subscript comes first in $f_{xy}$?"),
                W(r"Both at the same time", r"Differentiation happens one variable at a time. Which order do the subscripts indicate?"),
                W(r"The order does not matter for the notation", r"The notation does encode an order, even if the result is often the same. What order does $f_{xy}$ specify?"),
            ],
        ),
        item(
            "mp_JJG2t5IBKy4_5",
            r"A function $f(x, y)$ has how many second order partial derivatives in total?",
            r"Each of $f_x$ and $f_y$ can be differentiated again in either variable.",
            [
                C(r"Four", r"Yes. They are $f_{xx}$, $f_{xy}$, $f_{yx}$, and $f_{yy}$."),
                W(r"Two", r"You may be counting only the pure second partials. What about the two mixed ones?"),
                W(r"Three", r"Count both pure and both mixed second partials. How many is that altogether?"),
                W(r"One", r"There is more than a single second derivative for two variables. How many combinations of two differentiations are there?"),
            ],
        ),
    ],
)

# === 6.2 video 1 ============================================================
add_micro(
    "DmB8I0TFlc8",
    'Unit 6, Module 6.2, video 1\n           "11: Clairaut\'s Theorem Intuition - Valuable Vector Calculus"',
    [
        item(
            "mp_DmB8I0TFlc8_1",
            r"Clairaut's theorem states that for a function with continuous second partials, what is true?",
            r"It concerns the two mixed partials, taken in opposite orders.",
            [
                C(r"$f_{xy} = f_{yx}$", r"Yes. The mixed partials are equal when the second partials are continuous."),
                W(r"$f_{xx} = f_{yy}$", r"That compares the two pure second partials, which need not be equal. Which pair does Clairaut equate?"),
                W(r"$f_x = f_y$", r"The first partials are generally different. Which second order quantities does the theorem relate?"),
                W(r"$f_{xy} = 0$", r"Clairaut does not force the mixed partial to vanish. What does it equate the mixed partial to?"),
            ],
        ),
        item(
            "mp_DmB8I0TFlc8_2",
            r"Clairaut's theorem requires which condition to guarantee the mixed partials are equal?",
            r"The guarantee depends on smoothness of the relevant derivatives near the point.",
            [
                C(r"The second partial derivatives are continuous near the point", r"Yes. Continuity of the second partials is what guarantees the mixed partials match."),
                W(r"The function is zero at the point", r"The value of $f$ is irrelevant to the symmetry. What smoothness condition is required?"),
                W(r"The first partials vanish", r"Vanishing first partials describe a critical point, not Clairaut's hypothesis. What must be continuous?"),
                W(r"The function is linear", r"Clairaut applies far beyond linear functions. What continuity condition does it need?"),
            ],
        ),
        item(
            "mp_DmB8I0TFlc8_3",
            r"For $f = x^2 y^3$, compute the mixed partial $f_{xy}$.",
            r"Find $f_x$ first, then differentiate in $y$.",
            [
                C(r"$6x y^2$", r"Correct. $f_x = 2x y^3$, and differentiating in $y$ gives $6x y^2$."),
                W(r"$2x y^3$", r"That is $f_x$ before the $y$ step. What is $\frac{\partial}{\partial y}(2x y^3)$?"),
                W(r"$3x^2 y^2$", r"That is $f_y$. What is the mixed partial $f_{xy}$ instead?"),
                W(r"$6x^2 y$", r"Check the powers. Differentiating $2x y^3$ in $y$ leaves what power of $x$ and of $y$?"),
            ],
        ),
        item(
            "mp_DmB8I0TFlc8_4",
            r"The practical upshot of Clairaut's theorem is that for nice functions, what does not matter?",
            r"Since the two mixed partials are equal, you are free in one respect.",
            [
                C(r"The order in which you take the mixed partial derivatives", r"Yes. For smooth functions you may differentiate in either order and get the same result."),
                W(r"The variables involved", r"The variables still matter to the result. What flexibility does the equality of mixed partials give?"),
                W(r"The value of the function", r"The function's value is unrelated to the symmetry. What ordering becomes free?"),
                W(r"The number of derivatives taken", r"Taking more derivatives changes the result. What specifically can be reordered?"),
            ],
        ),
        item(
            "mp_DmB8I0TFlc8_5",
            r"Clairaut's theorem can fail when which condition is violated?",
            r"The theorem's one hypothesis is about the smoothness of the second partials.",
            [
                C(r"The second partials are not continuous at the point", r"Yes. Without continuity of the second partials, the mixed partials can disagree."),
                W(r"The function has three variables", r"Clairaut extends to more variables just fine. What smoothness failure can break it?"),
                W(r"The function is a polynomial", r"Polynomials are smooth and always satisfy Clairaut. What condition must fail for it to break?"),
                W(r"The partials are positive", r"Sign plays no role here. What discontinuity allows the mixed partials to differ?"),
            ],
        ),
    ],
)

# === 6.2 video 2 ============================================================
add_micro(
    "wLkXUmVKyi4",
    'Unit 6, Module 6.2, video 2\n           "Clever Clairaut Proof"',
    [
        item(
            "mp_wLkXUmVKyi4_1",
            r"The equality $f_{xy} = f_{yx}$ is often called the symmetry of what?",
            r"It concerns the array of all second partial derivatives.",
            [
                C(r"The second derivatives, so the Hessian is symmetric", r"Yes. Equal mixed partials make the Hessian of second derivatives symmetric."),
                W(r"The gradient", r"The gradient holds first derivatives, not the mixed second partials. Which collection is symmetric?"),
                W(r"The function itself", r"Symmetry here is about derivatives, not the function. Which derivative array is symmetric?"),
                W(r"The domain", r"The domain is unrelated to mixed partials. What derivative structure does the equality make symmetric?"),
            ],
        ),
        item(
            "mp_wLkXUmVKyi4_2",
            r"For a function satisfying Clairaut's theorem, the Hessian matrix of second partials is what?",
            r"If the off diagonal entries $f_{xy}$ and $f_{yx}$ are equal, the matrix has a special structure.",
            [
                C(r"Symmetric", r"Yes. Equal mixed partials place equal values off the diagonal, making the Hessian symmetric."),
                W(r"Diagonal in all cases", r"The mixed partials need not be zero, so off diagonal entries can be nonzero. What property does equality give?"),
                W(r"Always zero", r"The second partials are generally nonzero. What symmetry does Clairaut guarantee?"),
                W(r"Antisymmetric", r"Antisymmetry would need opposite off diagonal entries. Equal entries give which property instead?"),
            ],
        ),
        item(
            "mp_wLkXUmVKyi4_3",
            r"For $f = \sin(xy)$, which statement about the mixed partials is guaranteed by Clairaut?",
            r"Sine and its derivatives are continuous everywhere, so the hypothesis holds.",
            [
                C(r"$f_{xy} = f_{yx}$, since the second partials are continuous everywhere", r"Yes. Because the second partials are continuous, the mixed partials must agree."),
                W(r"They differ by a constant", r"Clairaut gives exact equality, not a constant offset. What does it guarantee here?"),
                W(r"They are both zero", r"The mixed partials of $\sin(xy)$ are not zero. What relation does Clairaut assure?"),
                W(r"They cannot be computed", r"They are perfectly computable. What does Clairaut say about their relationship?"),
            ],
        ),
        item(
            "mp_wLkXUmVKyi4_4",
            r"The proof of Clairaut's theorem typically compares two ways of taking a limit of what?",
            r"It builds a small rectangle and measures how $f$ changes across its corners.",
            [
                C(r"A second order difference quotient of $f$", r"Yes. The proof evaluates a mixed second difference over a small rectangle two different ways."),
                W(r"The gradient vector", r"The gradient is a first order object. What second order difference does the proof use?"),
                W(r"A line integral around a curve", r"The proof is local and uses differences, not line integrals. What difference quotient appears?"),
                W(r"An infinite series", r"No series is needed for the standard proof. What finite difference construction does it compare?"),
            ],
        ),
        item(
            "mp_wLkXUmVKyi4_5",
            r"Clairaut's theorem extends to higher mixed partials, so for smooth $f$, $f_{xyy}$ equals what?",
            r"For smooth functions, any reordering of the same differentiations gives the same result.",
            [
                C(r"$f_{yxy}$ and $f_{yyx}$", r"Yes. Any ordering with one $x$ and two $y$ differentiations gives the same third partial."),
                W(r"$f_{xxy}$", r"That has two $x$ differentiations and one $y$, a different combination. Which orderings match $f_{xyy}$?"),
                W(r"Zero", r"Clairaut does not force the partial to vanish. What other orderings equal $f_{xyy}$?"),
                W(r"$f_{xxx}$", r"That uses three $x$ differentiations. Which reorderings of one $x$ and two $y$ match $f_{xyy}$?"),
            ],
        ),
    ],
)

# === 6.3 video 1 ============================================================
add_micro(
    "9yCtWfI_Vjg",
    'Unit 6, Module 6.3, video 1\n           "The Multi-Variable Chain Rule: Derivatives of Compositions"',
    [
        item(
            "mp_9yCtWfI_Vjg_1",
            r"If $z = f(x, y)$ with $x = x(t)$ and $y = y(t)$, then $\frac{dz}{dt}$ equals what?",
            r"Each path from $z$ down to $t$ contributes a product of a partial and an ordinary derivative.",
            [
                C(r"$\frac{\partial f}{\partial x}\frac{dx}{dt} + \frac{\partial f}{\partial y}\frac{dy}{dt}$", r"Yes. You sum the contributions through $x$ and through $y$."),
                W(r"$\frac{\partial f}{\partial x} + \frac{\partial f}{\partial y}$", r"Each term needs the rate of its intermediate variable. What multiplies each partial?"),
                W(r"$\frac{\partial f}{\partial x}\frac{dy}{dt} + \frac{\partial f}{\partial y}\frac{dx}{dt}$", r"The factors are mismatched. Which rate should pair with $\frac{\partial f}{\partial x}$?"),
                W(r"$\frac{df}{dx}\frac{dx}{dt}$", r"That ignores the path through $y$. What second term accounts for $y$?"),
            ],
        ),
        item(
            "mp_9yCtWfI_Vjg_2",
            r"For $z = x^2 + y^2$ with $x = t$ and $y = t^2$, what is $\frac{dz}{dt}$?",
            r"Use $\frac{dz}{dt} = 2x \cdot x'(t) + 2y \cdot y'(t)$ and substitute $x = t$, $y = t^2$.",
            [
                C(r"$2t + 4t^3$", r"Correct. $2t \cdot 1 + 2t^2 \cdot 2t = 2t + 4t^3$."),
                W(r"$2t + 2t^2$", r"The second term needs $y' = 2t$, not $1$. What is $2y \cdot y'$ with $y = t^2$?"),
                W(r"$2x + 2y$", r"You left the answer in terms of $x$ and $y$ without the path rates. What are $x'$ and $y'$?"),
                W(r"$4t^3$", r"You dropped the contribution through $x$. What does $2x \cdot x'$ add?"),
            ],
        ),
        item(
            "mp_9yCtWfI_Vjg_3",
            r"The multivariable chain rule sums several terms because $z$ changes through what?",
            r"There is one term for every intermediate route by which $t$ influences $z$.",
            [
                C(r"Each intermediate variable contributes a term to the total rate", r"Yes. Every dependency path adds its own product term to the sum."),
                W(r"Only one variable ever matters", r"Both $x$ and $y$ carry $t$'s influence. How many terms result?"),
                W(r"The variables cancel each other", r"The contributions add, they do not cancel. What does each intermediate variable contribute?"),
                W(r"None of the variables contribute", r"If none contributed, $z$ would not change. What does each path add to $\frac{dz}{dt}$?"),
            ],
        ),
        item(
            "mp_9yCtWfI_Vjg_4",
            r"A tree diagram for the chain rule helps by showing what?",
            r"It traces the branching dependencies from the top variable down to the independent one.",
            [
                C(r"The dependency paths from the final variable down to the independent variable", r"Yes. Each branch of the tree becomes one product term in the chain rule sum."),
                W(r"The numerical answer directly", r"The tree organizes structure, not the final number. What does it display?"),
                W(r"The integral of $f$", r"Trees track differentiation paths, not integrals. What dependency structure do they show?"),
                W(r"The boundary of the domain", r"The diagram is about variable dependence, not the domain. What paths does it lay out?"),
            ],
        ),
        item(
            "mp_9yCtWfI_Vjg_5",
            r"If $z = f(x, y)$ with $x = x(s, t)$ and $y = y(s, t)$, then $\frac{\partial z}{\partial s}$ equals what?",
            r"Hold $t$ fixed and sum the contributions through $x$ and $y$ using their $s$ partials.",
            [
                C(r"$\frac{\partial f}{\partial x}\frac{\partial x}{\partial s} + \frac{\partial f}{\partial y}\frac{\partial y}{\partial s}$", r"Yes. With two independent variables, you use the $s$ partials of $x$ and $y$."),
                W(r"$\frac{\partial f}{\partial x}\frac{\partial x}{\partial t} + \frac{\partial f}{\partial y}\frac{\partial y}{\partial t}$", r"Those are the $t$ partials, which give $\frac{\partial z}{\partial t}$. Which variable's partials does $\frac{\partial z}{\partial s}$ need?"),
                W(r"$\frac{\partial f}{\partial x} + \frac{\partial f}{\partial y}$", r"Each partial of $f$ must multiply a rate. What rates with respect to $s$ belong here?"),
                W(r"$\frac{\partial f}{\partial x}\frac{\partial y}{\partial s}$", r"The factors are mismatched and the $x$ path is missing its partner. Which rate pairs with $\frac{\partial f}{\partial x}$?"),
            ],
        ),
    ],
)

# === 6.3 video 2 ============================================================
add_micro(
    "hFvBZf-Jx28",
    'Unit 6, Module 6.3, video 2\n           "Multivariable chain rule intuition"',
    [
        item(
            "mp_hFvBZf-Jx28_1",
            r"In the chain rule, each product term such as $f_x \frac{dx}{dt}$ represents what?",
            r"It isolates how much of $z$'s total change flows through one particular variable.",
            [
                C(r"The contribution to $z$'s rate of change coming through the variable $x$", r"Yes. That term is the share of $\frac{dz}{dt}$ carried by the $x$ path."),
                W(r"The total rate of change of $z$", r"The total is the sum of all such terms. What does a single term represent?"),
                W(r"The second derivative of $z$", r"These are first order rates, not second derivatives. What does $f_x \frac{dx}{dt}$ measure?"),
                W(r"An error term to be discarded", r"It is a genuine part of the answer, not an error. What contribution does it capture?"),
            ],
        ),
        item(
            "mp_hFvBZf-Jx28_2",
            r"The chain rule $\frac{dz}{dt} = f_x x' + f_y y'$ can be written as which dot product?",
            r"Group the partials into one vector and the path rates into another.",
            [
                C(r"The gradient of $f$ dotted with the velocity vector $(x', y')$", r"Yes. It is $\nabla f \cdot (x', y')$, the gradient dotted with the velocity."),
                W(r"The gradient dotted with itself", r"That would square the gradient, not involve the path. Which vector pairs with $\nabla f$?"),
                W(r"$f$ times the velocity vector", r"The function value does not multiply the velocity here. Which derivative vector does?"),
                W(r"The Hessian times the velocity", r"The Hessian is second order. Which first order vector dots with the velocity?"),
            ],
        ),
        item(
            "mp_hFvBZf-Jx28_3",
            r"For $f = xy$ along $x = \cos t$ and $y = \sin t$, what is $\frac{dz}{dt}$?",
            r"Use $\frac{dz}{dt} = y \cdot x' + x \cdot y'$ with $x' = -\sin t$ and $y' = \cos t$.",
            [
                C(r"$\cos^2 t - \sin^2 t$", r"Correct. $y(-\sin t) + x(\cos t) = -\sin^2 t + \cos^2 t$."),
                W(r"$\sin^2 t - \cos^2 t$", r"Check the signs. The term $y \cdot x'$ is $-\sin^2 t$ and $x \cdot y'$ is $+\cos^2 t$. Which is positive?"),
                W(r"$2\sin t \cos t$", r"That is the derivative of $\sin^2 t$, a different combination. What is $-\sin^2 t + \cos^2 t$?"),
                W(r"$0$", r"The two squared terms are not equal in general. What is their difference?"),
            ],
        ),
        item(
            "mp_hFvBZf-Jx28_4",
            r"The multivariable chain rule reduces to the single variable chain rule when the function depends on how many variables?",
            r"With fewer intermediate variables, the sum collapses to a single term.",
            [
                C(r"One", r"Yes. With a single intermediate variable, the sum has one term, the ordinary chain rule."),
                W(r"Zero", r"A function of no variables has no rate to compute. How many intermediate variables give the single variable rule?"),
                W(r"Infinitely many", r"More variables make the rule larger, not simpler. How few variables recover the single variable case?"),
                W(r"It never reduces", r"It does reduce in a special case. For how many intermediate variables?"),
            ],
        ),
        item(
            "mp_hFvBZf-Jx28_5",
            r"The multivariable chain rule underlies which technique for relations like $F(x, y) = 0$?",
            r"Differentiating such a relation treating $y$ as a function of $x$ uses the chain rule.",
            [
                C(r"Implicit differentiation", r"Yes. Implicit differentiation applies the chain rule to a relation defining $y$ in terms of $x$."),
                W(r"Integration by parts", r"That is an integration technique, not differentiation of a relation. What method does the chain rule power here?"),
                W(r"Partial fractions", r"Partial fractions decompose rational expressions. Which differentiation method uses the chain rule on $F(x, y) = 0$?"),
                W(r"Separation of variables", r"That solves certain differential equations. Which technique differentiates an implicit relation?"),
            ],
        ),
    ],
)

# === 6.4 video 1 ============================================================
add_micro(
    "2MN0aq5gNOg",
    'Unit 6, Module 6.4, video 1\n           "Differential Equations #9 | Line Integrals"',
    [
        item(
            "mp_2MN0aq5gNOg_1",
            r"A scalar line integral $\int_C f\,ds$ accumulates what along the curve?",
            r"The element $ds$ is a tiny piece of arc length, and $f$ weights each piece.",
            [
                C(r"The values of $f$ weighted by arc length", r"Yes. It sums $f$ over the curve, each contribution scaled by the bit of arc length $ds$."),
                W(r"The slope of the curve $C$", r"Slope is not what $ds$ measures. What does $f$ get weighted by along $C$?"),
                W(r"The area under $f$ over a flat interval", r"That is an ordinary single variable integral, not one along a curve. What does $ds$ represent?"),
                W(r"The volume beneath a surface", r"A line integral is one dimensional in its path. What quantity does $f\,ds$ accumulate?"),
            ],
        ),
        item(
            "mp_2MN0aq5gNOg_2",
            r"A vector line integral $\int_C \mathbf{F} \cdot d\mathbf{r}$ computes which physical quantity when $\mathbf{F}$ is a force?",
            r"Force dotted with displacement along a path is a familiar mechanics quantity.",
            [
                C(r"The work done by the force along the path", r"Yes. Integrating $\mathbf{F} \cdot d\mathbf{r}$ gives the work done by the force."),
                W(r"The area enclosed by the path", r"Enclosed area is a different computation. What does force dotted with displacement give?"),
                W(r"The arc length of the path", r"Arc length ignores the force entirely. What does $\mathbf{F} \cdot d\mathbf{r}$ measure?"),
                W(r"The flux through the path", r"Flux uses a normal component, not the tangential dot product. What does $\mathbf{F} \cdot d\mathbf{r}$ compute?"),
            ],
        ),
        item(
            "mp_2MN0aq5gNOg_3",
            r"To evaluate $\int_C f\,ds$ with parametrization $\mathbf{r}(t)$, the arc length element $ds$ becomes what?",
            r"The speed of the parametrization converts the parameter step $dt$ into arc length.",
            [
                C(r"$|\mathbf{r}'(t)|\,dt$", r"Yes. The magnitude of the velocity, the speed, converts $dt$ into arc length $ds$."),
                W(r"$dt$", r"That ignores how fast the curve is traced. What factor scales $dt$ into arc length?"),
                W(r"$\mathbf{r}'(t)\,dt$", r"Arc length is a scalar, but this is a vector. What scalar version converts $dt$ to $ds$?"),
                W(r"$|\mathbf{r}(t)|\,dt$", r"You need the speed, the magnitude of the derivative, not of the position. What is $ds$?"),
            ],
        ),
        item(
            "mp_2MN0aq5gNOg_4",
            r"For the constant field $\mathbf{F} = (1, 1)$, the work along any path from $(0, 0)$ to $(1, 1)$ is what?",
            r"A constant field is conservative, so the work is the field dotted with the total displacement.",
            [
                C(r"$2$", r"Correct. The displacement is $(1, 1)$, and $\mathbf{F} \cdot (1, 1) = 1 + 1 = 2$."),
                W(r"$0$", r"The field points along the displacement, so it does positive work. What is $(1, 1) \cdot (1, 1)$?"),
                W(r"$1$", r"Add both components of the dot product. What is $1 \cdot 1 + 1 \cdot 1$?"),
                W(r"It depends on the path", r"A constant field is conservative, so the work is path independent. What is its value?"),
            ],
        ),
        item(
            "mp_2MN0aq5gNOg_5",
            r"Reversing the direction of traversal of $C$ changes a vector line integral $\int_C \mathbf{F} \cdot d\mathbf{r}$ how?",
            r"Reversing direction flips the sign of every displacement vector $d\mathbf{r}$.",
            [
                C(r"It flips the sign", r"Yes. Reversing orientation negates $d\mathbf{r}$, so the integral changes sign."),
                W(r"It has no effect", r"The displacement directions all reverse. What does that do to the signed integral?"),
                W(r"It doubles the value", r"Reversal negates rather than scales. What sign change results?"),
                W(r"It makes the integral zero", r"The magnitude is unchanged, only the sign flips. What is the effect of reversing direction?"),
            ],
        ),
    ],
)

# === 6.4 video 2 ============================================================
add_micro(
    "we88mTXj6Yc",
    'Unit 6, Module 6.4, video 2\n           "The Fundamental Theorem of Line Integrals // Big Idea and Proof // Vector Calculus"',
    [
        item(
            "mp_we88mTXj6Yc_1",
            r"The Fundamental Theorem of Line Integrals states that $\int_C \nabla f \cdot d\mathbf{r}$ equals what?",
            r"Just like the single variable Fundamental Theorem, the answer is the antiderivative evaluated at the endpoints.",
            [
                C(r"$f(\text{end}) - f(\text{start})$", r"Yes. The integral of a gradient is the potential at the end minus at the start."),
                W(r"Zero always", r"It is zero only for closed loops. What is the value for a general path with distinct endpoints?"),
                W(r"The arc length of $C$", r"Arc length ignores the potential. What endpoint expression gives the value?"),
                W(r"$f(\text{end}) + f(\text{start})$", r"The theorem uses a difference, not a sum. Which combination of endpoint values is correct?"),
            ],
        ),
        item(
            "mp_we88mTXj6Yc_2",
            r"When $\mathbf{F} = \nabla f$, the line integral $\int_C \mathbf{F} \cdot d\mathbf{r}$ depends only on what?",
            r"By the theorem, only the values of $f$ at the two ends enter.",
            [
                C(r"The endpoints of the path", r"Yes. For a gradient field the integral is path independent, set by the endpoints alone."),
                W(r"The full shape of the path", r"The shape does not matter for a gradient field. What does the value depend on?"),
                W(r"The length of the path", r"Length does not enter the endpoint formula. What determines the value?"),
                W(r"The orientation only", r"Orientation affects the sign but not the path independence. What fixes the value?"),
            ],
        ),
        item(
            "mp_we88mTXj6Yc_3",
            r"For a gradient field, the line integral around any closed loop is what?",
            r"On a closed loop the start and end points coincide.",
            [
                C(r"Zero", r"Yes. With the same start and end, $f(\text{end}) - f(\text{start}) = 0$."),
                W(r"The area enclosed", r"That is a different kind of result. What does $f(\text{end}) - f(\text{start})$ give when the points coincide?"),
                W(r"Nonzero in general", r"For a true gradient field the loop integral always vanishes. Why must it be zero?"),
                W(r"The circumference of the loop", r"Length does not enter the gradient formula. What is the value when start equals end?"),
            ],
        ),
        item(
            "mp_we88mTXj6Yc_4",
            r"If $f = x^2 + y^2$, then $\int_C \nabla f \cdot d\mathbf{r}$ from $(0, 0)$ to $(1, 2)$ equals what?",
            r"Apply $f(\text{end}) - f(\text{start})$ with the given potential.",
            [
                C(r"$5$", r"Correct. $f(1, 2) - f(0, 0) = (1 + 4) - 0 = 5$."),
                W(r"$0$", r"The endpoints differ, so the difference is nonzero. What is $f(1, 2) - f(0, 0)$?"),
                W(r"$3$", r"Recompute $f(1, 2) = 1^2 + 2^2$. What does that equal?"),
                W(r"$\sqrt{5}$", r"The potential is $x^2 + y^2$, not its square root. What is $f(1, 2) - f(0, 0)$?"),
            ],
        ),
        item(
            "mp_we88mTXj6Yc_5",
            r"The Fundamental Theorem of Line Integrals is the multivariable analog of which single variable theorem?",
            r"Both say that integrating a derivative recovers the original function at the endpoints.",
            [
                C(r"The Fundamental Theorem of Calculus", r"Yes. It generalizes the Fundamental Theorem of Calculus to paths and gradients."),
                W(r"The Mean Value Theorem", r"That concerns an intermediate slope, not endpoint evaluation. Which theorem evaluates an antiderivative at the ends?"),
                W(r"Clairaut's theorem", r"Clairaut is about mixed partials. Which theorem relates an integral of a derivative to endpoint values?"),
                W(r"The chain rule", r"The chain rule differentiates compositions. Which integration theorem does the line integral theorem generalize?"),
            ],
        ),
    ],
)

# === 6.5 video 1 ============================================================
add_micro(
    "76nzOtupeRc",
    'Unit 6, Module 6.5, video 1\n           "Conservative Vector Fields // Vector Calculus"',
    [
        item(
            "mp_76nzOtupeRc_1",
            r"A vector field $\mathbf{F}$ is conservative if it can be written as what?",
            r"The defining feature is the existence of a scalar function whose gradient is the field.",
            [
                C(r"The gradient of a scalar potential function, $\mathbf{F} = \nabla f$", r"Yes. A conservative field is exactly one that is the gradient of some potential."),
                W(r"The curl of another field", r"That describes a different structure. What scalar function's gradient gives a conservative field?"),
                W(r"A constant vector", r"Constant fields are a special case, not the definition. What general form defines conservative fields?"),
                W(r"A function of time only", r"Time dependence is not the point. What gradient structure defines conservativeness?"),
            ],
        ),
        item(
            "mp_76nzOtupeRc_2",
            r"A key property of a conservative field is that its line integrals are what?",
            r"Since the integral equals a difference of potential values, the route taken drops out.",
            [
                C(r"Path independent", r"Yes. Line integrals of a conservative field depend only on the endpoints, not the path."),
                W(r"Always zero", r"They are zero only on closed loops, not on every path. What property holds for all paths?"),
                W(r"Dependent on arc length", r"Arc length does not enter the potential difference. What independence property holds?"),
                W(r"Undefined on loops", r"They are well defined on loops, where they equal zero. What is the general property?"),
            ],
        ),
        item(
            "mp_76nzOtupeRc_3",
            r"For a conservative field, the circulation around any closed curve is what?",
            r"Circulation is the line integral around a closed loop.",
            [
                C(r"Zero", r"Yes. A conservative field has zero circulation around every closed curve."),
                W(r"Positive", r"A nonzero circulation would contradict path independence. What value must it take?"),
                W(r"Equal to the enclosed area", r"Area is unrelated to a conservative loop integral. What is the circulation?"),
                W(r"Equal to the perimeter", r"Length does not enter the potential difference. What does the closed loop integral equal?"),
            ],
        ),
        item(
            "mp_76nzOtupeRc_4",
            r"In physics, a conservative force is one for which which quantity is conserved?",
            r"The name itself hints at what stays constant as the object moves.",
            [
                C(r"Mechanical energy", r"Yes. Under a conservative force the total mechanical energy is conserved."),
                W(r"Momentum only", r"Momentum conservation comes from different conditions. What does a conservative force conserve?"),
                W(r"Temperature", r"Temperature is unrelated to this mechanics idea. What conserved quantity gives the force its name?"),
                W(r"Mass", r"Mass conservation is separate. What energy quantity stays constant under a conservative force?"),
            ],
        ),
        item(
            "mp_76nzOtupeRc_5",
            r"Which of the following is a classic example of a conservative force field?",
            r"Look for a force that stores potential energy and does path independent work.",
            [
                C(r"A uniform gravitational field", r"Yes. Gravity is conservative, with a well defined potential energy."),
                W(r"A friction force", r"Friction dissipates energy and depends on the path. Is it conservative?"),
                W(r"A generic time varying field", r"Time dependence generally breaks conservativeness. Which steady field stores potential energy?"),
                W(r"Air drag", r"Drag removes energy along the path, like friction. Which listed force conserves energy?"),
            ],
        ),
    ],
)

# === 6.5 video 2 ============================================================
add_micro(
    "ZGUvyGeNT44",
    'Unit 6, Module 6.5, video 2\n           "How to Test if a Vector Field is Conservative // Vector Calculus"',
    [
        item(
            "mp_ZGUvyGeNT44_1",
            r"For $\mathbf{F} = (P, Q)$ on a simply connected domain, the test for conservativeness is which equation?",
            r"Compare the cross partials of the two components.",
            [
                C(r"$\frac{\partial P}{\partial y} = \frac{\partial Q}{\partial x}$", r"Yes. Equality of these cross partials signals a conservative field on a simply connected domain."),
                W(r"$\frac{\partial P}{\partial x} = \frac{\partial Q}{\partial y}$", r"Those are the wrong partials. Which cross partials must match for conservativeness?"),
                W(r"$P = Q$", r"The components themselves need not be equal. Which of their derivatives must agree?"),
                W(r"$P_x + Q_y = 0$", r"That is a divergence free condition, not the conservative test. Which partials must be equal?"),
            ],
        ),
        item(
            "mp_ZGUvyGeNT44_2",
            r"Is $\mathbf{F} = (2xy, x^2)$ conservative? Test using the partials.",
            r"Here $P = 2xy$ and $Q = x^2$. Compare $P_y$ with $Q_x$.",
            [
                C(r"Yes, since $P_y = 2x = Q_x$", r"Correct. Both cross partials equal $2x$, so the field is conservative."),
                W(r"No, since $P_y \neq Q_x$", r"Recompute. $P_y = 2x$ and $Q_x = 2x$. Do they match?"),
                W(r"Yes, since $P = Q$", r"The components are not equal, but that is not the test. Which partials did you compare?"),
                W(r"Cannot tell from the partials", r"The cross partials are computable and decide the matter. What are $P_y$ and $Q_x$?"),
            ],
        ),
        item(
            "mp_ZGUvyGeNT44_3",
            r"Is $\mathbf{F} = (y, -x)$ conservative?",
            r"Here $P = y$ and $Q = -x$. Compute $P_y$ and $Q_x$.",
            [
                C(r"No, since $P_y = 1$ but $Q_x = -1$", r"Correct. The cross partials differ, so the field is not conservative."),
                W(r"Yes, since $P_y = Q_x$", r"Recompute. $P_y = 1$ and $Q_x = -1$. Are those equal?"),
                W(r"Yes, since it is linear", r"Linearity does not guarantee conservativeness. What do the cross partials say?"),
                W(r"Cannot tell from the partials", r"The partials decide it. What are the values of $P_y$ and $Q_x$?"),
            ],
        ),
        item(
            "mp_ZGUvyGeNT44_4",
            r"The partial derivative test guarantees a conservative field only when the domain is what?",
            r"The domain must have no holes for the local test to give a global conclusion.",
            [
                C(r"Simply connected, with no holes", r"Yes. On a simply connected domain, matching cross partials guarantees a conservative field."),
                W(r"Bounded", r"Boundedness is not the issue. What topological property removes the holes?"),
                W(r"A single point", r"A single point is too small to define a field. What connectivity property is required?"),
                W(r"The whole plane only", r"Many smaller domains work too, as long as they have no holes. What is that property called?"),
            ],
        ),
        item(
            "mp_ZGUvyGeNT44_5",
            r"A conservative vector field always has what value of curl?",
            r"Conservative fields are gradient fields, and the curl of a gradient is fixed.",
            [
                C(r"Zero", r"Yes. The curl of a gradient field is always zero, so conservative fields are curl free."),
                W(r"One", r"The curl is not a fixed nonzero number. What is the curl of any gradient field?"),
                W(r"Equal to its divergence", r"Curl and divergence are independent quantities. What is the curl of a conservative field?"),
                W(r"Undefined", r"The curl is perfectly well defined and equal to a specific value. What value?"),
            ],
        ),
    ],
)

# === 6.6 video 1 ============================================================
add_micro(
    "jlza4rEFXKM",
    'Unit 6, Module 6.6, video 1\n           "Finding the scalar potential function for a conservative vector field // Vector Calculus"',
    [
        item(
            "mp_jlza4rEFXKM_1",
            r"To find a potential $f$ for $\mathbf{F} = (P, Q)$, a standard first step is to do what?",
            r"You want a function whose $x$ partial is $P$, so reverse that differentiation.",
            [
                C(r"Integrate $P$ with respect to $x$", r"Yes. Integrating $P$ in $x$ recovers $f$ up to a function of $y$."),
                W(r"Differentiate $P$ with respect to $y$", r"Differentiating goes the wrong way. What operation recovers $f$ from $f_x = P$?"),
                W(r"Multiply $P$ and $Q$", r"Multiplying the components does not build a potential. What undoes the partial $f_x = P$?"),
                W(r"Set $f = P + Q$", r"Adding the components does not invert the gradient. What integration recovers $f$?"),
            ],
        ),
        item(
            "mp_jlza4rEFXKM_2",
            r"When you integrate $P$ with respect to $x$ to find $f$, the constant of integration is what?",
            r"Anything that vanishes under an $x$ derivative can still depend on $y$.",
            [
                C(r"A function $g(y)$ of the other variable", r"Yes. The integration constant in $x$ can be any function of $y$."),
                W(r"A numerical constant only", r"A pure number is too restrictive. What can depend on $y$ and still vanish under $\partial_x$?"),
                W(r"Zero always", r"Discarding it loses information about $y$. What general object replaces the constant?"),
                W(r"A function of $x$", r"A function of $x$ would not vanish under $\partial_x$. Which variable can the unknown piece depend on?"),
            ],
        ),
        item(
            "mp_jlza4rEFXKM_3",
            r"A potential for $\mathbf{F} = (2x, 2y)$ is which function?",
            r"Integrate $2x$ in $x$, then match the $y$ component.",
            [
                C(r"$f = x^2 + y^2 + C$", r"Correct. Its gradient is $(2x, 2y)$, matching the field."),
                W(r"$f = 2x + 2y$", r"Differentiate this: its gradient is $(2, 2)$, not $(2x, 2y)$. What potential gives $(2x, 2y)$?"),
                W(r"$f = x^2 - y^2$", r"Its gradient is $(2x, -2y)$, with the wrong sign on the second component. What gives $(2x, 2y)$?"),
                W(r"$f = xy$", r"Its gradient is $(y, x)$, not $(2x, 2y)$. Which potential matches the field?"),
            ],
        ),
        item(
            "mp_jlza4rEFXKM_4",
            r"A potential for $\mathbf{F} = (y, x)$ is which function?",
            r"Integrate the first component $y$ with respect to $x$.",
            [
                C(r"$f = xy + C$", r"Correct. The gradient of $xy$ is $(y, x)$, matching the field."),
                W(r"$f = x + y$", r"Its gradient is $(1, 1)$, not $(y, x)$. What potential gives $(y, x)$?"),
                W(r"$f = \frac{x^2 + y^2}{2}$", r"Its gradient is $(x, y)$, with the variables swapped. Which potential gives $(y, x)$?"),
                W(r"$f = x^2 y$", r"Its gradient is $(2xy, x^2)$, not $(y, x)$. What potential matches?"),
            ],
        ),
        item(
            "mp_jlza4rEFXKM_5",
            r"To check a candidate potential $f$, you confirm that what holds?",
            r"A potential is defined by the gradient condition.",
            [
                C(r"$\nabla f = \mathbf{F}$", r"Yes. The gradient of the potential must reproduce the field."),
                W(r"$f = 0$", r"A potential need not be zero. What gradient condition validates it?"),
                W(r"The curl of $f$ is the field", r"Curl applies to vector fields, not scalar potentials. What operation on $f$ should give $\mathbf{F}$?"),
                W(r"$f$ is constant", r"A constant has zero gradient and could not give a nonzero field. What must $\nabla f$ equal?"),
            ],
        ),
    ],
)

# === 6.6 video 2 ============================================================
add_micro(
    "nQkHh2psLck",
    'Unit 6, Module 6.6, video 2\n           "Determining the Potential Function of a Conservative Vector Field"',
    [
        item(
            "mp_nQkHh2psLck_1",
            r"After integrating $P$ to get $f = \int P\,dx + g(y)$, how do you find $g(y)$?",
            r"Use the second component $Q$ to pin down the unknown $y$ piece.",
            [
                C(r"Differentiate with respect to $y$ and set it equal to $Q$", r"Yes. Matching $f_y$ to $Q$ produces an equation for $g'(y)$."),
                W(r"Integrate again with respect to $x$", r"A second $x$ integration does not involve $Q$. What condition determines $g(y)$?"),
                W(r"Set $g(y) = Q$", r"You match the derivative $f_y$ to $Q$, not $g$ itself. What equation results?"),
                W(r"Differentiate with respect to $x$", r"The unknown depends on $y$, so an $x$ derivative loses it. Which derivative reveals $g'(y)$?"),
            ],
        ),
        item(
            "mp_nQkHh2psLck_2",
            r"For $\mathbf{F} = (2xy, x^2 + 2y)$, a potential is which function?",
            r"Integrate $2xy$ in $x$ to get $x^2 y + g(y)$, then match the $y$ component.",
            [
                C(r"$f = x^2 y + y^2 + C$", r"Correct. Its gradient is $(2xy, x^2 + 2y)$, matching the field."),
                W(r"$f = x^2 y$", r"Its gradient is $(2xy, x^2)$, missing the $2y$ in the second component. What term in $g(y)$ supplies it?"),
                W(r"$f = 2x^2 y + 2y$", r"Differentiate to check: this does not give $(2xy, x^2 + 2y)$. What potential does?"),
                W(r"$f = xy^2$", r"Its gradient is $(y^2, 2xy)$, unrelated to the field. Which potential matches?"),
            ],
        ),
        item(
            "mp_nQkHh2psLck_3",
            r"A potential function exists for $\mathbf{F}$ only if the field is what?",
            r"Only a special class of fields are gradients of some scalar function.",
            [
                C(r"Conservative", r"Yes. Only conservative fields admit a potential function."),
                W(r"Constant", r"Many nonconstant fields have potentials. What property is actually required?"),
                W(r"Zero", r"The zero field is a trivial case, not the general requirement. What class admits a potential?"),
                W(r"Divergence free only", r"Divergence free is a different condition. What property guarantees a potential exists?"),
            ],
        ),
        item(
            "mp_nQkHh2psLck_4",
            r"Once a potential $f$ is known, a line integral $\int_C \mathbf{F} \cdot d\mathbf{r}$ is evaluated how?",
            r"Use the Fundamental Theorem of Line Integrals.",
            [
                C(r"As $f$ at the endpoint minus $f$ at the start", r"Yes. The integral is the potential difference between the endpoints."),
                W(r"By integrating $f$ over $C$", r"You evaluate $f$ at two points, not integrate it along the curve. What endpoint formula applies?"),
                W(r"As the arc length times $f$", r"Length does not enter the potential method. What difference of values gives the integral?"),
                W(r"As zero always", r"It is zero only for closed loops. What is the general value?"),
            ],
        ),
        item(
            "mp_nQkHh2psLck_5",
            r"Two potential functions for the same conservative field can differ by what?",
            r"Anything with zero gradient can be added without changing the field.",
            [
                C(r"An additive constant", r"Yes. Potentials are unique up to an added constant, since constants have zero gradient."),
                W(r"A multiplicative constant", r"Scaling $f$ would scale its gradient too. What can be added without changing $\nabla f$?"),
                W(r"A function of $x$", r"A nonconstant function of $x$ has nonzero gradient. What kind of term has zero gradient?"),
                W(r"Nothing, they must be identical", r"They need not be identical. What harmless difference is allowed between two potentials?"),
            ],
        ),
    ],
)

# === 6.7 video 1 ============================================================
add_micro(
    "uaHiAxFESc4",
    'Unit 6, Module 6.7, video 1\n           "Level curves | MIT 18.02SC Multivariable Calculus, Fall 2010"',
    [
        item(
            "mp_uaHiAxFESc4_1",
            r"A level curve of $f(x, y)$ is the set of points where what holds?",
            r"On a level curve the function output is pinned to a fixed value.",
            [
                C(r"$f(x, y) = c$ for a constant $c$", r"Yes. A level curve collects all points where $f$ equals a chosen constant."),
                W(r"$f(x, y) = 0$ only", r"Zero is just one possible level. What general value defines a level curve?"),
                W(r"$f_x = 0$", r"That locates critical behavior in $x$, not a level set. What condition on $f$ itself defines the curve?"),
                W(r"$f$ is maximized", r"A maximum is a single point or set, not a general level curve. What equation defines a level curve?"),
            ],
        ),
        item(
            "mp_uaHiAxFESc4_2",
            r"The level curve $x^2 + y^2 = 4$ is which shape?",
            r"Recognize the equation of a circle and read off its radius.",
            [
                C(r"A circle of radius $2$", r"Correct. $x^2 + y^2 = 4$ is a circle of radius $\sqrt{4} = 2$."),
                W(r"A circle of radius $4$", r"The radius is the square root of the right side. What is $\sqrt{4}$?"),
                W(r"A parabola", r"Both variables are squared with equal positive coefficients. What closed shape is that?"),
                W(r"A line", r"A line has no squared terms. What shape does $x^2 + y^2 = 4$ describe?"),
            ],
        ),
        item(
            "mp_uaHiAxFESc4_3",
            r"At any point, the gradient $\nabla f$ is oriented how relative to the level curve through that point?",
            r"The gradient points toward the fastest increase, which is straight across the level curve.",
            [
                C(r"Perpendicular to the level curve", r"Yes. The gradient is always perpendicular to the level curve at each point."),
                W(r"Tangent to it", r"Along the level curve $f$ does not change, but the gradient points where $f$ changes fastest. What angle is that?"),
                W(r"At 45 degrees to it", r"The angle is fixed by the geometry, not a generic 45 degrees. What is it?"),
                W(r"Parallel to it", r"Parallel would mean no change across the curve, but the gradient measures change. How is it oriented?"),
            ],
        ),
        item(
            "mp_uaHiAxFESc4_4",
            r"Where level curves are packed closely together, the surface is doing what?",
            r"Close spacing means the output changes a lot over a small horizontal distance.",
            [
                C(r"Changing steeply", r"Yes. Tightly spaced level curves indicate a steep part of the surface."),
                W(r"Staying flat", r"Flat regions have widely spaced level curves. What does tight spacing mean?"),
                W(r"At a maximum", r"A maximum is a specific point, not implied by spacing alone. What does close spacing indicate?"),
                W(r"Undefined", r"Close spacing is perfectly well defined behavior. What steepness does it show?"),
            ],
        ),
        item(
            "mp_uaHiAxFESc4_5",
            r"The level curves of the plane $f = x + y$ are which shapes?",
            r"Set $x + y = c$ for various constants and picture the resulting curves.",
            [
                C(r"Parallel straight lines", r"Yes. Each equation $x + y = c$ is a line, and different $c$ give parallel lines."),
                W(r"Concentric circles", r"Circles come from squared terms, which this plane lacks. What shape is $x + y = c$?"),
                W(r"Parabolas", r"Parabolas need a squared term. What does the linear equation $x + y = c$ describe?"),
                W(r"A single point", r"Each level is a whole curve, not a point. What do the equations $x + y = c$ trace?"),
            ],
        ),
    ],
)

# === 6.7 video 2 ============================================================
add_micro(
    "CCLrfpD5_sE",
    'Unit 6, Module 6.7, video 2\n           "Level Curves of Functions of Two Variables"',
    [
        item(
            "mp_CCLrfpD5_sE_1",
            r"A level curve can be viewed as the projection onto the $xy$ plane of what?",
            r"Picture slicing the surface horizontally and dropping the slice straight down.",
            [
                C(r"The intersection of the surface with a horizontal plane $z = c$", r"Yes. Slicing at height $c$ and projecting down gives the level curve."),
                W(r"A vertical cross section", r"Vertical slices are traces, not level curves. Which horizontal slice projects to a level curve?"),
                W(r"The gradient vector", r"The gradient is a direction, not a slice. What horizontal intersection gives the level curve?"),
                W(r"The tangent plane", r"The tangent plane touches at one point. What horizontal cut yields a level curve?"),
            ],
        ),
        item(
            "mp_CCLrfpD5_sE_2",
            r"The level curve $y - x^2 = 0$ is which curve?",
            r"Solve the equation for $y$ in terms of $x$.",
            [
                C(r"The parabola $y = x^2$", r"Correct. Rearranged, the level curve is the standard parabola $y = x^2$."),
                W(r"A circle", r"There is no $y^2$ term, so it is not a circle. What curve is $y = x^2$?"),
                W(r"A line", r"The squared $x$ term rules out a straight line. What shape is $y = x^2$?"),
                W(r"An ellipse", r"An ellipse needs both variables squared. What single curve does $y = x^2$ describe?"),
            ],
        ),
        item(
            "mp_CCLrfpD5_sE_3",
            r"Two level curves of the same function for different values $c_1 \neq c_2$ can do what?",
            r"A single point cannot have two different output values at once.",
            [
                C(r"Never intersect", r"Yes. A point on both would force $f$ to equal two different values, which is impossible."),
                W(r"Always intersect", r"Intersection would require one point to hold two output values. Can that happen?"),
                W(r"Be identical", r"Different constants give different level sets. Can they coincide?"),
                W(r"Cross at the origin", r"The origin is not special here. Can curves of different levels meet anywhere?"),
            ],
        ),
        item(
            "mp_CCLrfpD5_sE_4",
            r"A set of nested closed level curves shrinking to a point usually indicates what there?",
            r"Think of contour rings tightening around a summit or a basin.",
            [
                C(r"A local maximum or minimum", r"Yes. Nested shrinking loops typically encircle a peak or a pit."),
                W(r"A saddle point", r"Saddles show crossing, not nested, contours. What does a nest of shrinking loops indicate?"),
                W(r"A flat region", r"Flat regions have sparse contours, not tight nests. What feature do shrinking loops mark?"),
                W(r"A discontinuity", r"Nested smooth loops suggest smooth behavior. What extreme feature do they surround?"),
            ],
        ),
        item(
            "mp_CCLrfpD5_sE_5",
            r"Level curves are usually drawn at equally spaced values of $c$ so that the spacing reveals what?",
            r"With equal output increments, horizontal crowding carries the meaning.",
            [
                C(r"The steepness of the surface", r"Yes. Equal value spacing turns crowding into a direct read on steepness."),
                W(r"The area of the region", r"Spacing of contours does not measure area. What surface property does crowding reveal?"),
                W(r"The sign of $f$", r"Sign is read from the values, not the spacing. What does the density of curves indicate?"),
                W(r"The domain of $f$", r"The domain is where $f$ is defined, unrelated to spacing. What does contour crowding show?"),
            ],
        ),
    ],
)

# === 6.8 video 1 ============================================================
add_micro(
    "iOmDo5jLFw8",
    'Unit 6, Module 6.8, video 1\n           "Indifference Curves"',
    [
        item(
            "mp_iOmDo5jLFw8_1",
            r"In economics, an indifference curve is a level curve of which function?",
            r"It connects bundles that the consumer ranks as equally desirable.",
            [
                C(r"A utility function", r"Yes. An indifference curve is a level curve of utility, holding satisfaction constant."),
                W(r"A cost function", r"Equal cost is the budget line, not an indifference curve. Which function does it hold constant?"),
                W(r"The budget constraint", r"The budget constraint is a separate line. Which function's level set is an indifference curve?"),
                W(r"A production function only", r"Production is a different application. Which consumer function is held constant here?"),
            ],
        ),
        item(
            "mp_iOmDo5jLFw8_2",
            r"All bundles on a single indifference curve give the consumer what?",
            r"The word indifference is the clue: the consumer cannot prefer one over another.",
            [
                C(r"The same level of utility or satisfaction", r"Yes. Every bundle on one curve yields equal utility, hence indifference."),
                W(r"The same cost", r"Equal cost defines the budget line, not the indifference curve. What is held equal here?"),
                W(r"Zero utility", r"The utility is constant but not necessarily zero. What is equal across the curve?"),
                W(r"Maximum income", r"Income is not what the curve holds fixed. What does each bundle share?"),
            ],
        ),
        item(
            "mp_iOmDo5jLFw8_3",
            r"Indifference curves typically slope downward because to keep utility constant, more of one good requires what?",
            r"To stay equally satisfied while gaining one good, something must be given up.",
            [
                C(r"Less of the other good", r"Yes. Gaining one good must be offset by losing some of the other to hold utility fixed."),
                W(r"More of the other good", r"Gaining both goods would raise utility, not hold it constant. What must happen to the other good?"),
                W(r"A higher budget", r"The budget is a separate constraint. What trade off keeps utility constant?"),
                W(r"No change in the other good", r"If the other good were unchanged, utility would rise. What must it do?"),
            ],
        ),
        item(
            "mp_iOmDo5jLFw8_4",
            r"The slope of an indifference curve, the marginal rate of substitution, is the rate at which the consumer will do what?",
            r"It measures a willingness to swap goods while remaining equally happy.",
            [
                C(r"Trade one good for another while staying equally satisfied", r"Yes. The marginal rate of substitution is the trade ratio that holds utility constant."),
                W(r"Increase total spending", r"Spending relates to the budget, not the indifference slope. What trade does the slope measure?"),
                W(r"Maximize one good", r"The slope is a local trade rate, not a maximization. What exchange does it describe?"),
                W(r"Reduce utility deliberately", r"Along the curve utility is held constant, not reduced. What trade keeps it constant?"),
            ],
        ),
        item(
            "mp_iOmDo5jLFw8_5",
            r"An indifference curve farther from the origin represents what?",
            r"Bundles farther out generally contain more of both goods.",
            [
                C(r"A higher level of utility", r"Yes. Curves farther from the origin correspond to greater utility."),
                W(r"A lower level of utility", r"More of both goods raises satisfaction. Which way does utility move outward?"),
                W(r"The same utility", r"Different curves carry different utility levels. What does a farther curve indicate?"),
                W(r"Zero consumption", r"Farther out means more consumption, not zero. What utility level does it represent?"),
            ],
        ),
    ],
)

# === 6.8 video 2 ============================================================
add_micro(
    "4RLEf70CDnw",
    'Unit 6, Module 6.8, video 2\n           "Budget lines and indifference curves"',
    [
        item(
            "mp_4RLEf70CDnw_1",
            r"A budget line for two goods with prices $p_1, p_2$ and income $m$ is which equation?",
            r"Total spending on the two goods equals the available income.",
            [
                C(r"$p_1 x_1 + p_2 x_2 = m$", r"Yes. Spending on both goods sums to the income $m$."),
                W(r"$x_1 + x_2 = m$", r"That ignores the prices. How do $p_1$ and $p_2$ enter the spending total?"),
                W(r"$p_1 x_1 = p_2 x_2$", r"That equates the two expenditures, not the total to income. What is the budget equation?"),
                W(r"$x_1 x_2 = m$", r"Spending is a sum of price times quantity, not a product. What is the correct form?"),
            ],
        ),
        item(
            "mp_4RLEf70CDnw_2",
            r"The consumer's optimal bundle occurs where the budget line does what to an indifference curve?",
            r"At the best affordable bundle, the budget line just grazes the highest reachable curve.",
            [
                C(r"Is tangent to it", r"Yes. The optimum is where the budget line is tangent to the highest attainable indifference curve."),
                W(r"Crosses it twice", r"Crossing means a higher curve is still affordable. What single contact marks the optimum?"),
                W(r"Is perpendicular to it", r"Perpendicularity is not the optimality condition. What contact condition holds at the optimum?"),
                W(r"Never touches it", r"If they never touch, the bundle is unaffordable or suboptimal. What touching condition is optimal?"),
            ],
        ),
        item(
            "mp_4RLEf70CDnw_3",
            r"At the optimal bundle, the marginal rate of substitution equals what?",
            r"Tangency means the slopes of the two curves match.",
            [
                C(r"The ratio of the prices", r"Yes. At tangency the marginal rate of substitution equals the price ratio."),
                W(r"The income", r"Income sets the position of the budget line, not its slope. What does the slope equal?"),
                W(r"Zero", r"A zero rate would mean a flat indifference curve, not the general optimum. What does the rate equal?"),
                W(r"The total utility", r"Utility level is not the slope. What price quantity does the marginal rate of substitution match?"),
            ],
        ),
        item(
            "mp_4RLEf70CDnw_4",
            r"The slope of the budget line $p_1 x_1 + p_2 x_2 = m$ is what?",
            r"Solve for $x_2$ in terms of $x_1$ and read the coefficient.",
            [
                C(r"$-\frac{p_1}{p_2}$", r"Correct. Solving for $x_2$ gives slope $-\frac{p_1}{p_2}$."),
                W(r"$-\frac{p_2}{p_1}$", r"The ratio is inverted. When you solve for $x_2$, which price ends up on top?"),
                W(r"$\frac{m}{p_1}$", r"That is an intercept, not the slope. What is the coefficient of $x_1$ after solving for $x_2$?"),
                W(r"$p_1 p_2$", r"The slope is a ratio with a sign, not a product. What is it?"),
            ],
        ),
        item(
            "mp_4RLEf70CDnw_5",
            r"Indifference curve analysis is an application of which calculus concept?",
            r"The curves are level sets, and their slopes come from gradients.",
            [
                C(r"Level curves and gradients of a function of two variables", r"Yes. Indifference curves are level curves of utility, with slopes set by its gradient."),
                W(r"Line integrals", r"Line integrals are not what indifference analysis uses. Which level set concept applies?"),
                W(r"Euler's method", r"That is a numerical ODE method, unrelated here. Which multivariable concept underlies indifference curves?"),
                W(r"Partial fraction decomposition", r"That is an algebraic integration tool. Which geometry of two variable functions applies?"),
            ],
        ),
    ],
)

# === 6.9 video 1 ============================================================
add_micro(
    "Id-EziWyZMQ",
    'Unit 6, Module 6.9, video 1\n           "Level Curves and Contour Maps (Calculus 3)"',
    [
        item(
            "mp_Id-EziWyZMQ_1",
            r"A contour map of $f(x, y)$ is a plot of what?",
            r"It stacks many level curves onto one diagram.",
            [
                C(r"Many level curves at different values of $c$", r"Yes. A contour map shows a family of level curves at several values."),
                W(r"A single tangent plane", r"A tangent plane touches at one point, not a map of curves. What collection forms a contour map?"),
                W(r"The gradient field only", r"The gradient field is a separate picture. What set of curves makes a contour map?"),
                W(r"The boundary of the domain", r"The domain boundary is not the map. What family of curves does a contour map draw?"),
            ],
        ),
        item(
            "mp_Id-EziWyZMQ_2",
            r"On a topographic contour map, each contour line connects points of equal what?",
            r"Topographic maps display the shape of terrain.",
            [
                C(r"Elevation", r"Yes. Each contour line links points at the same elevation."),
                W(r"Slope", r"Slope is read from spacing, not along a single contour. What is constant along a contour line?"),
                W(r"Temperature", r"Temperature maps use isotherms, a different application. What does a topographic contour hold constant?"),
                W(r"Distance", r"Distance is not what a contour line fixes. What height quantity stays equal along it?"),
            ],
        ),
        item(
            "mp_Id-EziWyZMQ_3",
            r"Closely spaced contour lines on a map indicate terrain that is what?",
            r"Tight spacing means a large change in height over a small ground distance.",
            [
                C(r"Steep", r"Yes. Closely packed contours mark steep terrain."),
                W(r"Flat", r"Flat ground shows widely spaced contours. What does tight spacing indicate?"),
                W(r"Underwater", r"Depth is unrelated to contour spacing here. What steepness does crowding show?"),
                W(r"At constant height", r"Constant height is a single contour, not crowding. What does dense spacing mean?"),
            ],
        ),
        item(
            "mp_Id-EziWyZMQ_4",
            r"Concentric circular contours with values increasing toward the center represent what feature?",
            r"Rising values as you move inward mean the surface climbs to a central high point.",
            [
                C(r"A hill or peak", r"Yes. Values increasing inward indicate a summit at the center."),
                W(r"A valley floor only", r"A valley would show values decreasing inward. What does increasing inward indicate?"),
                W(r"A flat plain", r"A plain has few contours, not rising rings. What feature do inward rising values mark?"),
                W(r"A cliff edge with no peak", r"Nested rising rings indicate a high point, not just a cliff. What feature is at the center?"),
            ],
        ),
        item(
            "mp_Id-EziWyZMQ_5",
            r"A saddle point on a contour map appears as contours that do what?",
            r"Near a saddle, the surface rises in one direction and falls in the perpendicular one.",
            [
                C(r"Form an X or hourglass crossing pattern of opposing curves", r"Yes. Saddle contours cross in an X like pattern reflecting up and down directions."),
                W(r"Are perfectly circular", r"Circles indicate peaks or pits, not saddles. What crossing pattern marks a saddle?"),
                W(r"Are evenly spaced parallel lines", r"Parallel lines suggest a tilted plane. What pattern signals a saddle?"),
                W(r"Vanish entirely", r"Contours do not disappear at a saddle. What characteristic crossing shape appears?"),
            ],
        ),
    ],
)

# === 6.9 video 2 ============================================================
add_micro(
    "hdtKiH51J9Y",
    'Unit 6, Module 6.9, video 2\n           "Level Curves and Traces of Multivariable Functions"',
    [
        item(
            "mp_hdtKiH51J9Y_1",
            r"A trace of a surface is its intersection with what?",
            r"A trace fixes one input variable and looks at the resulting curve.",
            [
                C(r"A coordinate plane such as $x = k$ or $y = k$", r"Yes. A trace is the curve where the surface meets a plane holding one variable fixed."),
                W(r"The gradient", r"The gradient is a direction, not a plane. Which plane does a trace use?"),
                W(r"A level curve in the $xy$ plane only", r"A level curve fixes the output, while a trace fixes an input. Which plane defines a trace?"),
                W(r"The tangent line", r"A trace is a full curve from a plane cut, not a tangent. Which plane creates it?"),
            ],
        ),
        item(
            "mp_hdtKiH51J9Y_2",
            r"How does a vertical trace differ from a level curve?",
            r"One holds an input variable fixed, the other holds the output value fixed.",
            [
                C(r"A trace fixes one input variable, while a level curve fixes the output value", r"Yes. Traces fix an input like $x$ or $y$, level curves fix the output $z$."),
                W(r"They are identical", r"They come from different kinds of slices. What does each one hold fixed?"),
                W(r"A trace fixes the output", r"Fixing the output is the level curve idea. What does a trace fix instead?"),
                W(r"A level curve fixes time", r"There is no time variable here. What value does a level curve hold fixed?"),
            ],
        ),
        item(
            "mp_hdtKiH51J9Y_3",
            r"The trace of $z = x^2 + y^2$ in the plane $x = 1$ is which curve?",
            r"Substitute $x = 1$ and see how $z$ depends on $y$.",
            [
                C(r"The parabola $z = 1 + y^2$", r"Correct. Setting $x = 1$ gives $z = 1 + y^2$, a parabola in the $y z$ plane."),
                W(r"A circle", r"Fixing $x$ leaves a relation between $z$ and $y$, not a circle. What is $z$ when $x = 1$?"),
                W(r"A straight line", r"The $y^2$ term curves the trace. What shape is $z = 1 + y^2$?"),
                W(r"An ellipse", r"An ellipse is closed, but this trace is an open parabola. What is the equation after $x = 1$?"),
            ],
        ),
        item(
            "mp_hdtKiH51J9Y_4",
            r"Combining several traces in different planes helps you do what?",
            r"Each trace is one slice, and many slices reveal the whole shape.",
            [
                C(r"Build up a picture of the full surface", r"Yes. Stacking traces from different planes reconstructs the surface."),
                W(r"Compute a line integral", r"Traces are for visualization, not line integrals. What do many traces help build?"),
                W(r"Find the potential function", r"Potentials come from integrating a field, not slicing a surface. What do traces help you see?"),
                W(r"Solve an ODE", r"Traces are not an ODE method. What understanding do combined traces give?"),
            ],
        ),
        item(
            "mp_hdtKiH51J9Y_5",
            r"The level curve of $z = x^2 + y^2$ at height $z = 9$ is which curve?",
            r"Set $x^2 + y^2 = 9$ and identify the circle's radius.",
            [
                C(r"A circle of radius $3$", r"Correct. $x^2 + y^2 = 9$ is a circle of radius $\sqrt{9} = 3$."),
                W(r"A circle of radius $9$", r"The radius is the square root of the level value. What is $\sqrt{9}$?"),
                W(r"A parabola", r"At a fixed height both variables are squared equally, giving a closed curve. What is it?"),
                W(r"A line", r"A line has no squared terms. What shape is $x^2 + y^2 = 9$?"),
            ],
        ),
    ],
)

# === 6.10 video 1 ===========================================================
add_micro(
    "vTVCQos6Mj4",
    'Unit 6, Module 6.10, video 1\n           "Exact and Inexact Differentials"',
    [
        item(
            "mp_vTVCQos6Mj4_1",
            r"A differential $M\,dx + N\,dy$ is called exact when it equals what?",
            r"Exactness means the expression is the total differential of some single function.",
            [
                C(r"The total differential $df$ of some function $f$", r"Yes. An exact differential is $df = f_x\,dx + f_y\,dy$ for some potential $f$."),
                W(r"Zero", r"Exactness does not mean the differential vanishes. What object must it equal?"),
                W(r"A constant", r"A differential is not a constant. What total differential structure defines exactness?"),
                W(r"A line integral", r"A line integral is a number from integrating, not the differential itself. What does an exact differential equal?"),
            ],
        ),
        item(
            "mp_vTVCQos6Mj4_2",
            r"The condition for $M\,dx + N\,dy$ to be exact is which equation?",
            r"Compare the cross partials of $M$ and $N$.",
            [
                C(r"$\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}$", r"Yes. Matching these cross partials is exactly the exactness test."),
                W(r"$M = N$", r"The components need not be equal. Which of their partials must match?"),
                W(r"$M_x = N_y$", r"Those are the wrong partials. Which cross partials must agree for exactness?"),
                W(r"$M + N = 0$", r"That is not the exactness condition. Which derivatives must be equal?"),
            ],
        ),
        item(
            "mp_vTVCQos6Mj4_3",
            r"Is $y\,dx + x\,dy$ an exact differential?",
            r"Here $M = y$ and $N = x$. Compare $M_y$ and $N_x$.",
            [
                C(r"Yes, since $M_y = 1 = N_x$", r"Correct. Both cross partials equal $1$, and indeed this is $d(xy)$."),
                W(r"No, since $M_y \neq N_x$", r"Recompute. $M_y = 1$ and $N_x = 1$. Do they match?"),
                W(r"Yes, since $M = N$", r"The components are not equal, but that is not the test. What are $M_y$ and $N_x$?"),
                W(r"Cannot tell", r"The cross partials decide it and are easy to compute. What are they?"),
            ],
        ),
        item(
            "mp_vTVCQos6Mj4_4",
            r"For an inexact differential, the integral between two points depends on what?",
            r"Without a potential, the value is tied to the route, not just the ends.",
            [
                C(r"The path taken", r"Yes. An inexact differential gives a path dependent integral."),
                W(r"Only the endpoints", r"Endpoint dependence is the exact case. What does the inexact integral depend on?"),
                W(r"Nothing, it is always zero", r"Inexact integrals are generally nonzero and route dependent. What do they depend on?"),
                W(r"The arc length only", r"It is the specific route, not merely the length, that matters. What does the integral depend on?"),
            ],
        ),
        item(
            "mp_vTVCQos6Mj4_5",
            r"The integral of an exact differential between two points depends only on what?",
            r"An exact differential has a potential, so the Fundamental Theorem of Line Integrals applies.",
            [
                C(r"The endpoints", r"Yes. With a potential available, the integral depends only on the endpoints."),
                W(r"The path", r"Path dependence is the inexact case. What does the exact integral depend on?"),
                W(r"The length", r"Length does not enter the potential difference. What fixes the exact integral?"),
                W(r"The orientation only", r"Orientation sets the sign but not the path independence. What determines the value?"),
            ],
        ),
    ],
)

# === 6.10 video 2 ===========================================================
add_micro(
    "IYlzo-bxrqs",
    'Unit 6, Module 6.10, video 2\n           "Conservative fields and exact differentials | MIT 18.02SC Multivariable Calculus, Fall 2010"',
    [
        item(
            "mp_IYlzo-bxrqs_1",
            r"An exact differential $M\,dx + N\,dy$ corresponds to which kind of vector field $(M, N)$?",
            r"If the differential is $df$, then $(M, N)$ is the gradient of $f$.",
            [
                C(r"A conservative field with potential $f$", r"Yes. An exact differential matches a conservative field whose potential is $f$."),
                W(r"A rotational field", r"Rotation suggests nonzero curl, the opposite case. What kind of field matches an exact differential?"),
                W(r"A field with nonzero curl", r"Nonzero curl signals inexactness. What field corresponds to an exact differential?"),
                W(r"A constant field only", r"Many nonconstant fields are conservative. What general field type matches exactness?"),
            ],
        ),
        item(
            "mp_IYlzo-bxrqs_2",
            r"The exactness condition $M_y = N_x$ is the same test used for what?",
            r"It is the identical cross partial check seen for vector fields.",
            [
                C(r"Whether the field $(M, N)$ is conservative", r"Yes. The exactness test is exactly the conservative field test."),
                W(r"Whether $f$ is continuous", r"Continuity is a separate property. What field property does $M_y = N_x$ test?"),
                W(r"Whether the curve is closed", r"The test concerns the field, not the curve. What does it detect?"),
                W(r"Whether the domain is bounded", r"Boundedness is unrelated. What conservativeness question does the test answer?"),
            ],
        ),
        item(
            "mp_IYlzo-bxrqs_3",
            r"Is $y\,dx + 2x\,dy$ exact?",
            r"Here $M = y$ and $N = 2x$. Compute $M_y$ and $N_x$.",
            [
                C(r"No, since $M_y = 1$ but $N_x = 2$", r"Correct. The cross partials differ, so the differential is inexact."),
                W(r"Yes, since both are linear", r"Linearity does not ensure exactness. What do $M_y$ and $N_x$ equal?"),
                W(r"Yes, since $M_y = N_x$", r"Recompute. $M_y = 1$ and $N_x = 2$. Are they equal?"),
                W(r"Cannot tell", r"The cross partials settle it. What are their values?"),
            ],
        ),
        item(
            "mp_IYlzo-bxrqs_4",
            r"In thermodynamics, an exact differential corresponds to a quantity that is what?",
            r"State quantities depend only on the current state, not how you got there.",
            [
                C(r"A state function, independent of the process path", r"Yes. Exact differentials describe state functions, which are path independent."),
                W(r"A path function like heat", r"Heat is the inexact, path dependent case. What kind of quantity is exact?"),
                W(r"Always zero", r"State functions are generally nonzero. What path property defines them?"),
                W(r"Undefined", r"State functions are well defined. What independence property do exact differentials carry?"),
            ],
        ),
        item(
            "mp_IYlzo-bxrqs_5",
            r"An inexact differential can sometimes be made exact by multiplying by what?",
            r"This previews the repair technique used for non exact differential equations.",
            [
                C(r"An integrating factor", r"Yes. A suitable integrating factor can turn an inexact differential into an exact one."),
                W(r"A constant only", r"A mere constant rarely fixes inexactness. What special multiplier can?"),
                W(r"Its own derivative", r"Multiplying by a derivative is not the standard repair. What factor restores exactness?"),
                W(r"The path length", r"Length is not a multiplier here. What function can make the differential exact?"),
            ],
        ),
    ],
)


# ============================================================================
# UNIT 5 MASTERY, 30 items
# ============================================================================

MASTERY_5 = [
    # --- Euler's method (5.1) ---
    item(
        "um_5_1",
        r"Euler's method advances the solution using which update?",
        r"You step forward from the current point along the slope the equation gives, scaled by $h$.",
        [
            C(r"$y_{n+1} = y_n + h\,f(t_n, y_n)$", r"Yes. The slope at the current point times $h$ gives the increment."),
            W(r"$y_{n+1} = y_n + f(t_n, y_n)$", r"The step size is missing. What scales the slope to one step?"),
            W(r"$y_{n+1} = y_n + h\,f(t_{n+1}, y_{n+1})$", r"That evaluates the slope at the unknown next point. Which point does explicit Euler use?"),
            W(r"$y_{n+1} = y_n - h\,f(t_n, y_n)$", r"Check the sign of a forward step. Which direction does the increment go?"),
        ],
    ),
    item(
        "um_5_2",
        r"For $\frac{dy}{dt} = y$ with $y(0) = 1$ and $h = 0.1$, what is $y_1$ by Euler's method?",
        r"Apply $y_1 = 1 + 0.1 \cdot f(0, 1)$ with $f = y$.",
        [
            C(r"$1.1$", r"Correct. $1 + 0.1 \cdot 1 = 1.1$."),
            W(r"$1.0$", r"You added nothing. What is $1 + 0.1 \cdot 1$?"),
            W(r"$1.11$", r"That resembles a second step. What is the first step value?"),
            W(r"$0.9$", r"The slope is positive, so the value grows. What is the result?"),
        ],
    ),
    item(
        "um_5_3",
        r"Geometrically, each Euler step follows which line?",
        r"The equation supplies a slope at the current point.",
        [
            C(r"The tangent line with slope $f(t_n, y_n)$", r"Yes. Euler walks along the tangent line at the current point."),
            W(r"A horizontal line", r"The slope is set by $f$, not zero. Which line carries that slope?"),
            W(r"A secant between two solution points", r"Only one point is known. Which line uses just that point's slope?"),
            W(r"A vertical line", r"A vertical line cannot represent advancing $y$. Which line has slope $f(t_n, y_n)$?"),
        ],
    ),
    item(
        "um_5_4",
        r"Euler's method is first order, so its global error scales like what?",
        r"Local errors of order $h^2$ accumulate over about $1/h$ steps.",
        [
            C(r"$O(h)$", r"Yes. The global error of Euler's method is proportional to $h$."),
            W(r"$O(h^2)$", r"That is the per step local error. What is the order after accumulation?"),
            W(r"$O(h^4)$", r"That belongs to RK4. What order is plain Euler?"),
            W(r"$O(1)$", r"A constant error would not shrink with $h$. What order does Euler have?"),
        ],
    ),
    item(
        "um_5_5",
        r"If you halve the step size in Euler's method, the global error is approximately changed how?",
        r"First order error is roughly proportional to $h$.",
        [
            C(r"Roughly halved", r"Yes. With error proportional to $h$, halving $h$ halves the error."),
            W(r"Roughly quartered", r"Quartering would be second order behavior. What power of $h$ does Euler carry?"),
            W(r"Unchanged", r"The error does depend on $h$. How does halving $h$ affect a first order error?"),
            W(r"Roughly doubled", r"Smaller steps reduce error. Which way does it move?"),
        ],
    ),
    # --- Improved and modified Euler (5.2) ---
    item(
        "um_5_6",
        r"The improved Euler method updates $y$ with which combination, where $k_1$ and $k_2$ are the start and predicted endpoint slopes?",
        r"It averages the two slopes over the step.",
        [
            C(r"$y_{n+1} = y_n + \frac{h}{2}(k_1 + k_2)$", r"Yes. It averages the starting and predicted endpoint slopes."),
            W(r"$y_{n+1} = y_n + h k_1$", r"That is plain Euler with one slope. What second slope is averaged in?"),
            W(r"$y_{n+1} = y_n + h k_2$", r"Using only the endpoint slope drops the start. How are they combined?"),
            W(r"$y_{n+1} = y_n + \frac{h}{2}(k_1 - k_2)$", r"A difference, not a sum, would be wrong. Which combination averages the slopes?"),
        ],
    ),
    item(
        "um_5_7",
        r"For $\frac{dy}{dt} = y$ with $y(0) = 1$ and $h = 0.1$, what is the improved Euler estimate $y_1$?",
        r"Here $k_1 = 1$, predicted endpoint $1.1$ so $k_2 = 1.1$, then average.",
        [
            C(r"$1.105$", r"Correct. $1 + 0.05(1 + 1.1) = 1.105$."),
            W(r"$1.1$", r"That is plain Euler using only $k_1$. What does averaging $k_2 = 1.1$ add?"),
            W(r"$1.11$", r"Recheck the factor $\frac{h}{2} = 0.05$. What does that give?"),
            W(r"$1.21$", r"That doubles the increment. What is $1 + 0.05(1 + 1.1)$?"),
        ],
    ),
    item(
        "um_5_8",
        r"The modified Euler, or midpoint, method evaluates the slope where?",
        r"It takes a half step and reads the slope at the center.",
        [
            C(r"At the midpoint $t_n + \frac{h}{2}$, via a half step prediction", r"Yes. It predicts the midpoint and uses the slope there."),
            W(r"At the left endpoint only", r"That is plain Euler. Where does the midpoint method sample?"),
            W(r"At the right endpoint only", r"The endpoint slope drives a different method. Which interior point is used?"),
            W(r"Averaged over both endpoints", r"That is the improved Euler idea. Which single point does the midpoint method use?"),
        ],
    ),
    item(
        "um_5_9",
        r"The improved Euler and midpoint methods are both of which order?",
        r"Each captures the leading curvature with two slope evaluations.",
        [
            C(r"Second order", r"Yes. Both are second order, with global error proportional to $h^2$."),
            W(r"First order", r"First order is plain Euler. What order do two slope methods reach?"),
            W(r"Third order", r"Third order needs more samples. What order do these two stage methods have?"),
            W(r"Fourth order", r"Fourth order is RK4. What order are improved and midpoint Euler?"),
        ],
    ),
    item(
        "um_5_10",
        r"Why does averaging or centering the slope improve on plain Euler?",
        r"Plain Euler uses one starting slope, but the slope changes across the interval.",
        [
            C(r"It better approximates the average slope across the step", r"Yes. A two slope estimate tracks the interval's mean slope more closely."),
            W(r"It secretly uses a smaller step", r"The step size is unchanged. What about the slope estimate improves?"),
            W(r"It removes the need to evaluate $f$", r"It evaluates $f$ more, not less. What does the extra evaluation capture?"),
            W(r"It makes the method implicit", r"These methods stay explicit. What property of the slope estimate reduces error?"),
        ],
    ),
    # --- Heun's method (5.3) ---
    item(
        "um_5_11",
        r"Heun's method is another name for which method, and it mirrors which integration rule?",
        r"It averages the two endpoint slopes, a classic two point quadrature.",
        [
            C(r"The improved Euler method, mirroring the trapezoidal rule", r"Yes. Heun is improved Euler, and averaging endpoint slopes is the trapezoidal rule."),
            W(r"The midpoint method, mirroring the midpoint rule", r"Heun uses the two ends, not the center. Which method and rule match it?"),
            W(r"RK4, mirroring Simpson's rule", r"RK4 uses four slopes. Which two slope method is Heun?"),
            W(r"Backward Euler, mirroring the left endpoint rule", r"Backward Euler is implicit and one sided. Which averaging method is Heun?"),
        ],
    ),
    item(
        "um_5_12",
        r"In Heun's method, the predicted endpoint $\tilde{y}_{n+1}$ is computed by which step?",
        r"The prediction is an ordinary forward Euler step.",
        [
            C(r"$\tilde{y}_{n+1} = y_n + h\,f(t_n, y_n)$", r"Yes. The predictor is a plain Euler step."),
            W(r"$\tilde{y}_{n+1} = y_n + \frac{h}{2}f(t_n, y_n)$", r"A half step is the midpoint idea. What full step predicts the endpoint?"),
            W(r"$\tilde{y}_{n+1} = y_n + h\,f(t_{n+1}, \tilde{y}_{n+1})$", r"That is implicit. Which explicit step gives the prediction?"),
            W(r"$\tilde{y}_{n+1} = y_n$", r"That makes no step at all. What forward step predicts the endpoint?"),
        ],
    ),
    item(
        "um_5_13",
        r"For $\frac{dy}{dt} = t + y$ with $y(0) = 1$ and $h = 0.2$, what is the Heun estimate $y_1$?",
        r"$k_1 = 1$, predictor $1.2$, $k_2 = f(0.2, 1.2) = 1.4$, then average.",
        [
            C(r"$1.24$", r"Correct. $1 + 0.1(1 + 1.4) = 1.24$."),
            W(r"$1.2$", r"That is the predictor alone. What does averaging $k_2 = 1.4$ give?"),
            W(r"$1.4$", r"That is the endpoint slope, not the new value. What is $1 + 0.1(1 + 1.4)$?"),
            W(r"$1.28$", r"Recheck $\frac{h}{2} = 0.1$. What is $0.1 \cdot 2.4$?"),
        ],
    ),
    item(
        "um_5_14",
        r"Heun's method belongs to which family, and what is its order?",
        r"It predicts then corrects, capturing curvature with two slopes.",
        [
            C(r"Predictor corrector, second order", r"Yes. Heun predicts then corrects and is second order accurate."),
            W(r"Multistep, first order", r"Heun uses a single previous point and reaches second order. Which family and order fit?"),
            W(r"Implicit, fourth order", r"Heun is explicit and second order. What family and order describe it?"),
            W(r"Spectral, third order", r"Heun is a stepwise two slope method. Which family and order are correct?"),
        ],
    ),
    # --- RK4 (5.4) ---
    item(
        "um_5_15",
        r"RK4 combines its four slopes using which weighted average?",
        r"The two midpoint slopes get double weight, all over six.",
        [
            C(r"$y_{n+1} = y_n + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$", r"Yes. The middle slopes carry double weight, scaled by $\frac{h}{6}$."),
            W(r"$y_{n+1} = y_n + \frac{h}{4}(k_1 + k_2 + k_3 + k_4)$", r"Equal weights miss the emphasis. Which slopes get doubled?"),
            W(r"$y_{n+1} = y_n + \frac{h}{6}(k_1 + 3k_2 + 3k_3 + k_4)$", r"Check the middle weights. Are they two or three?"),
            W(r"$y_{n+1} = y_n + h k_1$", r"That is plain Euler. How many slopes does RK4 blend?"),
        ],
    ),
    item(
        "um_5_16",
        r"In RK4, the first slope $k_1$ is evaluated where?",
        r"It is the very first sample, before any trial step.",
        [
            C(r"At the current point $(t_n, y_n)$", r"Yes. $k_1$ is the starting slope."),
            W(r"At the midpoint", r"That is $k_2$. Where is the first slope taken?"),
            W(r"At the endpoint", r"That is $k_4$. Which slope comes first?"),
            W(r"At $(t_n + h, y_n)$", r"RK4 does not sample there for $k_1$. Where is it taken?"),
        ],
    ),
    item(
        "um_5_17",
        r"RK4 is a fourth order method, so its global error scales like what?",
        r"Four weighted slopes match the Taylor series through fourth order.",
        [
            C(r"$O(h^4)$", r"Yes. The global error of RK4 is proportional to $h^4$."),
            W(r"$O(h^2)$", r"Second order is Heun's level. What order is RK4?"),
            W(r"$O(h)$", r"First order is plain Euler. What order does RK4 reach?"),
            W(r"$O(h^6)$", r"Sixth order needs more stages. What order is classical RK4?"),
        ],
    ),
    item(
        "um_5_18",
        r"If you halve the step size in RK4, the global error decreases by approximately what factor?",
        r"For fourth order error scaling like $h^4$, consider $2^4$.",
        [
            C(r"About $16$", r"Yes. $2^4 = 16$."),
            W(r"About $4$", r"That is second order behavior. What is $2^4$?"),
            W(r"About $2$", r"That is first order behavior. What factor matches $h^4$?"),
            W(r"About $8$", r"That is $2^3$. What is the fourth power of two?"),
        ],
    ),
    item(
        "um_5_19",
        r"How many evaluations of $f$ does RK4 use per step?",
        r"Count the slopes $k_1$ through $k_4$.",
        [
            C(r"Four", r"Yes. RK4 evaluates $f$ four times per step."),
            W(r"One", r"One is plain Euler. How many slopes does RK4 use?"),
            W(r"Two", r"Two is Heun or midpoint. How many does RK4 use?"),
            W(r"Six", r"Classical RK4 uses fewer than six. How many?"),
        ],
    ),
    item(
        "um_5_20",
        r"For $\frac{dy}{dt} = 2t$ with $y(0) = 0$ and $h = 1$, what is the RK4 estimate $y_1$?",
        r"With $f$ depending only on $t$: $k_1 = 0$, $k_2 = k_3 = 1$, $k_4 = 2$. Apply the weighted average.",
        [
            C(r"$1$", r"Correct. $\frac{1}{6}(0 + 2 + 2 + 2) = 1$, matching the exact $t^2$ at $t = 1$."),
            W(r"$0.5$", r"Recompute the weighted sum. What is $\frac{1}{6}(0 + 2 + 2 + 2)$?"),
            W(r"$2$", r"That is $k_4$ alone. How does the weighted average reduce it?"),
            W(r"$0.75$", r"Check each weight. What does $\frac{1}{6}(0 + 2 + 2 + 2)$ give?"),
        ],
    ),
    # --- Runge-Kutta family (5.5) ---
    item(
        "um_5_21",
        r"All Runge-Kutta methods share which strategy?",
        r"Each probes the slope at several places inside the step.",
        [
            C(r"A weighted combination of slope evaluations within each step", r"Yes. They blend several sampled slopes with chosen weights."),
            W(r"Requiring the exact solution", r"No exact solution is used. What do they do with sampled slopes?"),
            W(r"Using only the left endpoint slope", r"One slope is plain Euler. What do higher members add?"),
            W(r"Storing many past steps", r"That is the multistep idea. What single step strategy do they share?"),
        ],
    ),
    item(
        "um_5_22",
        r"The one stage, first order member of the Runge-Kutta family is which method?",
        r"A single slope at the start of the step is the simplest scheme.",
        [
            C(r"Euler's method", r"Yes. Plain Euler is the one stage Runge-Kutta method."),
            W(r"RK4", r"RK4 uses four stages. Which uses one?"),
            W(r"Heun's method", r"Heun uses two stages. Which uses one?"),
            W(r"The midpoint method", r"That uses two stages. Which single stage method is simplest?"),
        ],
    ),
    item(
        "um_5_23",
        r"The coefficients of a Runge-Kutta method are organized in what?",
        r"A standard tableau named after a numerical analyst stores the nodes and weights.",
        [
            C(r"A Butcher tableau", r"Yes. The Butcher tableau holds the nodes, weights, and stage coefficients."),
            W(r"A Jacobian matrix", r"The Jacobian holds partial derivatives. What tableau holds method coefficients?"),
            W(r"A Wronskian", r"The Wronskian tests independence of solutions. What array stores the coefficients?"),
            W(r"A phase portrait", r"A phase portrait pictures trajectories. What tableau organizes the weights?"),
        ],
    ),
    item(
        "um_5_24",
        r"Higher order Runge-Kutta methods generally require what?",
        r"More accuracy comes from probing more places per step.",
        [
            C(r"More function evaluations per step", r"Yes. Each added stage is another slope evaluation."),
            W(r"Fewer function evaluations per step", r"Higher accuracy is not free. Which way does the evaluation count move?"),
            W(r"A larger step size automatically", r"Step size is independent of order. What grows with order?"),
            W(r"An implicit solver always", r"Many high order methods are explicit. What per step cost rises?"),
        ],
    ),
    item(
        "um_5_25",
        r"For a Runge-Kutta method to be consistent, its weights $b_i$ must satisfy what?",
        r"Consistency requires reproducing the simplest case over one step.",
        [
            C(r"They sum to one", r"Yes. The weights must sum to one for consistency."),
            W(r"They sum to zero", r"A zero sum gives no net step. What must the weights total?"),
            W(r"They equal the step size", r"The weights are dimensionless numbers. What is their required sum?"),
            W(r"They sum to the order", r"The sum is fixed regardless of order. What value is it?"),
        ],
    ),
    # --- Adaptive stepping (5.6) ---
    item(
        "um_5_26",
        r"Adaptive step size methods choose $h$ based on what?",
        r"They react to how much error each tentative step makes.",
        [
            C(r"An estimate of the local error at each step", r"Yes. The step size is tuned using an on the fly error estimate."),
            W(r"A fixed schedule set in advance", r"A preset schedule cannot react. What measured quantity drives the choice?"),
            W(r"The total number of steps", r"A step budget does not set each size. What local quantity guides $h$?"),
            W(r"The initial condition alone", r"The start cannot dictate every step. What ongoing estimate controls $h$?"),
        ],
    ),
    item(
        "um_5_27",
        r"When the estimated local error exceeds the tolerance, an adaptive method does what?",
        r"Too much error means the step was too ambitious.",
        [
            C(r"Reduces the step size and retries", r"Yes. It shrinks $h$ and repeats the step."),
            W(r"Increases the step size", r"Growing the step worsens the error. Which way should $h$ go?"),
            W(r"Stops the computation", r"The situation is recoverable. What adjustment continues accurately?"),
            W(r"Ignores the error", r"Ignoring the tolerance defeats adaptation. What does the method do?"),
        ],
    ),
    item(
        "um_5_28",
        r"The RKF45 method estimates error by pairing methods of which orders?",
        r"The digits 45 encode the two orders.",
        [
            C(r"Orders four and five", r"Yes. RKF45 pairs a fourth and fifth order estimate."),
            W(r"Orders one and two", r"Those are too low for the name. Which orders does 45 mean?"),
            W(r"Orders two and three", r"The digits point higher. Which orders does RKF45 use?"),
            W(r"Orders five and six", r"That is one too high. Which two orders are paired?"),
        ],
    ),
    item(
        "um_5_29",
        r"The efficiency benefit of adaptive stepping is that small steps are used where?",
        r"Effort should concentrate where the solution is hardest to follow.",
        [
            C(r"Only where the solution changes rapidly, with larger steps elsewhere", r"Yes. Fine steps go to fast changing regions and coarse steps to smooth ones."),
            W(r"Everywhere uniformly", r"Uniform small steps waste effort. Where does adaptation focus them?"),
            W(r"Only at the start", r"Hard regions can be anywhere. Where are small steps needed?"),
            W(r"Only at the end", r"There is no reason to favor the end. Where do fine steps go?"),
        ],
    ),
    item(
        "um_5_30",
        r"In a long orbital simulation, plain Euler typically causes the orbit to do what, and a good check is conservation of which quantity?",
        r"Accumulated error makes the orbit drift, and one scalar should stay nearly fixed.",
        [
            C(r"Spiral as energy drifts, so conservation of total energy is the check", r"Yes. Euler's accumulated error drifts the energy, so energy conservation tests the method."),
            W(r"Stay perfectly periodic, so conservation of step count is the check", r"Step count is not a physical invariant, and Euler does drift. What conserved quantity tests the orbit?"),
            W(r"Stop immediately, so conservation of the initial time is the check", r"The simulation keeps running, and time is fixed input. What physical quantity should hold steady?"),
            W(r"Become exact, so no conservation check is needed", r"Euler accumulates error rather than becoming exact. Which conserved quantity provides a check?"),
        ],
    ),
]


# ============================================================================
# UNIT 6 MASTERY, 30 items
# ============================================================================

MASTERY_6 = [
    # --- Partial derivatives (6.1) ---
    item(
        "um_6_1",
        r"To compute $f_x$ for $f(x, y)$, you differentiate in $x$ while doing what?",
        r"A partial derivative isolates one variable by freezing the rest.",
        [
            C(r"Holding $y$ constant", r"Yes. Treat $y$ as a constant and differentiate in $x$."),
            W(r"Holding $x$ constant", r"You are differentiating in $x$, so $x$ varies. Which variable is frozen?"),
            W(r"Setting $y = 0$", r"Fixing $y$ at a value differs from treating it as a constant symbol. What happens to $y$?"),
            W(r"Differentiating in both at once", r"A partial changes one variable. Which one stays fixed while $x$ moves?"),
        ],
    ),
    item(
        "um_6_2",
        r"For $f = x^2 y + y^3$, what is $f_x$?",
        r"Treat $y$ as a constant and differentiate each term in $x$.",
        [
            C(r"$2xy$", r"Correct. The first term gives $2xy$, and $y^3$ vanishes under $\partial_x$."),
            W(r"$2xy + 3y^2$", r"The $3y^2$ is the $y$ derivative of $y^3$. What is $\partial_x(y^3)$?"),
            W(r"$x^2$", r"That is the coefficient of $y$. What is $\partial_x(x^2 y)$?"),
            W(r"$2x$", r"Do not drop the factor $y$. What multiplies $2x$?"),
        ],
    ),
    item(
        "um_6_3",
        r"How many second order partial derivatives does $f(x, y)$ have in total?",
        r"Each first partial can be differentiated again in either variable.",
        [
            C(r"Four", r"Yes. They are $f_{xx}$, $f_{xy}$, $f_{yx}$, and $f_{yy}$."),
            W(r"Two", r"You may be counting only the pure ones. What about the mixed partials?"),
            W(r"Three", r"Count both pure and both mixed. How many is that?"),
            W(r"One", r"There is more than one. How many combinations of two differentiations exist?"),
        ],
    ),
    # --- Clairaut's theorem (6.2) ---
    item(
        "um_6_4",
        r"Clairaut's theorem states that for a function with continuous second partials, what holds?",
        r"It concerns the two mixed partials taken in opposite orders.",
        [
            C(r"$f_{xy} = f_{yx}$", r"Yes. The mixed partials are equal when the second partials are continuous."),
            W(r"$f_{xx} = f_{yy}$", r"The pure second partials need not be equal. Which pair does Clairaut equate?"),
            W(r"$f_x = f_y$", r"The first partials generally differ. Which second order pair is equated?"),
            W(r"$f_{xy} = 0$", r"The mixed partial need not vanish. What does Clairaut equate it to?"),
        ],
    ),
    item(
        "um_6_5",
        r"Which condition does Clairaut's theorem require?",
        r"The hypothesis is about smoothness of the relevant derivatives.",
        [
            C(r"The second partials are continuous near the point", r"Yes. Continuity of the second partials guarantees the mixed partials agree."),
            W(r"The function is zero at the point", r"The value is irrelevant. What smoothness condition is needed?"),
            W(r"The first partials vanish", r"That describes a critical point, not Clairaut. What must be continuous?"),
            W(r"The function is linear", r"Clairaut applies far beyond linear functions. What continuity is required?"),
        ],
    ),
    item(
        "um_6_6",
        r"For $f = x^2 y^3$, compute the mixed partial $f_{xy}$.",
        r"Find $f_x$ first, then differentiate in $y$.",
        [
            C(r"$6x y^2$", r"Correct. $f_x = 2x y^3$, and differentiating in $y$ gives $6x y^2$."),
            W(r"$2x y^3$", r"That is $f_x$. What is $\partial_y(2x y^3)$?"),
            W(r"$3x^2 y^2$", r"That is $f_y$. What is the mixed partial $f_{xy}$?"),
            W(r"$6x^2 y$", r"Check the powers after differentiating $2x y^3$ in $y$. What remains?"),
        ],
    ),
    # --- Multivariable chain rule (6.3) ---
    item(
        "um_6_7",
        r"If $z = f(x, y)$ with $x = x(t)$ and $y = y(t)$, then $\frac{dz}{dt}$ equals what?",
        r"Each intermediate variable contributes a product term.",
        [
            C(r"$\frac{\partial f}{\partial x}\frac{dx}{dt} + \frac{\partial f}{\partial y}\frac{dy}{dt}$", r"Yes. Sum the contributions through $x$ and through $y$."),
            W(r"$\frac{\partial f}{\partial x} + \frac{\partial f}{\partial y}$", r"Each partial needs its variable's rate. What multiplies each?"),
            W(r"$\frac{\partial f}{\partial x}\frac{dy}{dt} + \frac{\partial f}{\partial y}\frac{dx}{dt}$", r"The factors are mismatched. Which rate pairs with $\frac{\partial f}{\partial x}$?"),
            W(r"$\frac{df}{dx}\frac{dx}{dt}$", r"That drops the $y$ path. What term accounts for $y$?"),
        ],
    ),
    item(
        "um_6_8",
        r"For $z = x^2 + y^2$ with $x = t$ and $y = t^2$, what is $\frac{dz}{dt}$?",
        r"Use $2x \cdot x' + 2y \cdot y'$ with $x' = 1$ and $y' = 2t$.",
        [
            C(r"$2t + 4t^3$", r"Correct. $2t \cdot 1 + 2t^2 \cdot 2t = 2t + 4t^3$."),
            W(r"$2t + 2t^2$", r"The second term needs $y' = 2t$. What is $2y \cdot y'$?"),
            W(r"$2x + 2y$", r"Substitute the paths and their rates. What are $x$, $y$, $x'$, $y'$?"),
            W(r"$4t^3$", r"You dropped the $x$ contribution. What does $2x \cdot x'$ add?"),
        ],
    ),
    item(
        "um_6_9",
        r"The chain rule $\frac{dz}{dt} = f_x x' + f_y y'$ can be written as which dot product?",
        r"Group the partials into a gradient and the rates into a velocity.",
        [
            C(r"The gradient of $f$ dotted with the velocity $(x', y')$", r"Yes. It is $\nabla f \cdot (x', y')$."),
            W(r"The gradient dotted with itself", r"That squares the gradient. Which vector pairs with $\nabla f$?"),
            W(r"$f$ times the velocity", r"The value $f$ does not multiply the velocity. Which derivative vector does?"),
            W(r"The Hessian times the velocity", r"The Hessian is second order. Which first order vector dots with velocity?"),
        ],
    ),
    # --- Line integrals (6.4) ---
    item(
        "um_6_10",
        r"The Fundamental Theorem of Line Integrals states $\int_C \nabla f \cdot d\mathbf{r}$ equals what?",
        r"Like the single variable theorem, the answer is the antiderivative at the endpoints.",
        [
            C(r"$f(\text{end}) - f(\text{start})$", r"Yes. The integral of a gradient is the potential difference between the endpoints."),
            W(r"Zero always", r"It is zero only for closed loops. What is the general value?"),
            W(r"The arc length of $C$", r"Length ignores the potential. What endpoint expression applies?"),
            W(r"$f(\text{end}) + f(\text{start})$", r"It uses a difference, not a sum. Which combination is correct?"),
        ],
    ),
    item(
        "um_6_11",
        r"For a gradient field, the line integral around any closed loop is what?",
        r"On a closed loop the start and end coincide.",
        [
            C(r"Zero", r"Yes. With start equal to end, the potential difference is zero."),
            W(r"The area enclosed", r"Area is a different result. What does the potential difference give when the points coincide?"),
            W(r"Nonzero in general", r"For a true gradient field it always vanishes. Why must it be zero?"),
            W(r"The circumference", r"Length does not enter. What is the value when start equals end?"),
        ],
    ),
    item(
        "um_6_12",
        r"If $f = x^2 + y^2$, then $\int_C \nabla f \cdot d\mathbf{r}$ from $(0, 0)$ to $(1, 2)$ equals what?",
        r"Apply $f(\text{end}) - f(\text{start})$.",
        [
            C(r"$5$", r"Correct. $f(1, 2) - f(0, 0) = 5 - 0 = 5$."),
            W(r"$0$", r"The endpoints differ. What is $f(1, 2) - f(0, 0)$?"),
            W(r"$3$", r"Recompute $f(1, 2) = 1 + 4$. What is that?"),
            W(r"$\sqrt{5}$", r"The potential is $x^2 + y^2$, not its square root. What is the difference?"),
        ],
    ),
    # --- Conservative fields (6.5) ---
    item(
        "um_6_13",
        r"A vector field $\mathbf{F}$ is conservative if it can be written as what?",
        r"The defining feature is being the gradient of a scalar function.",
        [
            C(r"$\mathbf{F} = \nabla f$, the gradient of a scalar potential", r"Yes. A conservative field is the gradient of some potential."),
            W(r"The curl of another field", r"That is a different structure. What gradient form defines conservativeness?"),
            W(r"A constant vector", r"Constant fields are a special case. What general form is the definition?"),
            W(r"A function of time only", r"Time dependence is not the point. What gradient structure defines it?"),
        ],
    ),
    item(
        "um_6_14",
        r"For $\mathbf{F} = (P, Q)$ on a simply connected domain, the conservative test is which equation?",
        r"Compare the cross partials of the two components.",
        [
            C(r"$\frac{\partial P}{\partial y} = \frac{\partial Q}{\partial x}$", r"Yes. Matching these cross partials signals a conservative field."),
            W(r"$\frac{\partial P}{\partial x} = \frac{\partial Q}{\partial y}$", r"Those are the wrong partials. Which cross partials must match?"),
            W(r"$P = Q$", r"The components need not be equal. Which derivatives must agree?"),
            W(r"$P_x + Q_y = 0$", r"That is a divergence free condition. Which partials must be equal?"),
        ],
    ),
    item(
        "um_6_15",
        r"Is $\mathbf{F} = (2xy, x^2)$ conservative?",
        r"Compare $P_y$ with $Q_x$ for $P = 2xy$, $Q = x^2$.",
        [
            C(r"Yes, since $P_y = 2x = Q_x$", r"Correct. Both cross partials equal $2x$."),
            W(r"No, since $P_y \neq Q_x$", r"Recompute. $P_y = 2x$ and $Q_x = 2x$. Do they match?"),
            W(r"Yes, since $P = Q$", r"The components are not equal, but that is not the test. Which partials did you compare?"),
            W(r"Cannot tell", r"The cross partials decide it. What are $P_y$ and $Q_x$?"),
        ],
    ),
    # --- Potential functions (6.6) ---
    item(
        "um_6_16",
        r"To find a potential $f$ for $\mathbf{F} = (P, Q)$, a standard first step is what?",
        r"Recover $f$ from $f_x = P$ by reversing the differentiation.",
        [
            C(r"Integrate $P$ with respect to $x$", r"Yes. Integrating $P$ in $x$ recovers $f$ up to a function of $y$."),
            W(r"Differentiate $P$ with respect to $y$", r"That goes the wrong way. What recovers $f$ from $f_x = P$?"),
            W(r"Multiply $P$ and $Q$", r"That does not build a potential. What undoes $f_x = P$?"),
            W(r"Set $f = P + Q$", r"Adding components does not invert the gradient. What integration recovers $f$?"),
        ],
    ),
    item(
        "um_6_17",
        r"A potential for $\mathbf{F} = (2x, 2y)$ is which function?",
        r"Integrate $2x$ in $x$ and match the $y$ component.",
        [
            C(r"$f = x^2 + y^2 + C$", r"Correct. Its gradient is $(2x, 2y)$."),
            W(r"$f = 2x + 2y$", r"Its gradient is $(2, 2)$. What potential gives $(2x, 2y)$?"),
            W(r"$f = x^2 - y^2$", r"Its gradient is $(2x, -2y)$. What gives $(2x, 2y)$?"),
            W(r"$f = xy$", r"Its gradient is $(y, x)$. Which potential matches the field?"),
        ],
    ),
    item(
        "um_6_18",
        r"Two potential functions for the same conservative field can differ by what?",
        r"Anything with zero gradient can be added freely.",
        [
            C(r"An additive constant", r"Yes. Constants have zero gradient, so potentials are unique up to a constant."),
            W(r"A multiplicative constant", r"Scaling would scale the gradient. What can be added harmlessly?"),
            W(r"A function of $x$", r"A nonconstant function of $x$ has nonzero gradient. What term has zero gradient?"),
            W(r"Nothing, they must be identical", r"They need not be identical. What difference is allowed?"),
        ],
    ),
    # --- Level curves (6.7) ---
    item(
        "um_6_19",
        r"A level curve of $f(x, y)$ is the set of points where what holds?",
        r"On a level curve the output is pinned to a constant.",
        [
            C(r"$f(x, y) = c$ for a constant $c$", r"Yes. A level curve collects points where $f$ equals a chosen constant."),
            W(r"$f(x, y) = 0$ only", r"Zero is just one level. What general value defines a level curve?"),
            W(r"$f_x = 0$", r"That is a critical condition in $x$. What condition on $f$ defines the curve?"),
            W(r"$f$ is maximized", r"A maximum is a special point. What equation defines a level curve?"),
        ],
    ),
    item(
        "um_6_20",
        r"At any point, the gradient $\nabla f$ is oriented how relative to the level curve there?",
        r"The gradient points toward fastest increase, straight across the curve.",
        [
            C(r"Perpendicular to the level curve", r"Yes. The gradient is always perpendicular to the level curve."),
            W(r"Tangent to it", r"Along the curve $f$ is constant, but the gradient points where $f$ changes. What angle is that?"),
            W(r"At 45 degrees", r"The angle is fixed by geometry, not generically 45 degrees. What is it?"),
            W(r"Parallel to it", r"Parallel would mean no change across the curve. How is the gradient oriented?"),
        ],
    ),
    item(
        "um_6_21",
        r"The level curve $x^2 + y^2 = 9$ is which shape?",
        r"Recognize the circle and read its radius.",
        [
            C(r"A circle of radius $3$", r"Correct. The radius is $\sqrt{9} = 3$."),
            W(r"A circle of radius $9$", r"The radius is the square root of the right side. What is $\sqrt{9}$?"),
            W(r"A parabola", r"Both variables are squared equally. What closed shape is that?"),
            W(r"A line", r"A line has no squared terms. What shape is $x^2 + y^2 = 9$?"),
        ],
    ),
    # --- Indifference curves (6.8) ---
    item(
        "um_6_22",
        r"In economics, an indifference curve is a level curve of which function?",
        r"It connects equally desirable bundles.",
        [
            C(r"A utility function", r"Yes. An indifference curve is a level curve of utility."),
            W(r"A cost function", r"Equal cost is the budget line. Which function does the curve hold constant?"),
            W(r"The budget constraint", r"That is a separate line. Which function's level set is the curve?"),
            W(r"A production function only", r"Production is a different application. Which consumer function is held constant?"),
        ],
    ),
    item(
        "um_6_23",
        r"At the consumer's optimal bundle, the marginal rate of substitution equals what?",
        r"The optimum is a tangency of the budget line and an indifference curve, so their slopes match.",
        [
            C(r"The ratio of the prices", r"Yes. At tangency the marginal rate of substitution equals the price ratio."),
            W(r"The income", r"Income sets position, not slope. What does the slope equal?"),
            W(r"Zero", r"A zero rate is not the general optimum. What does the rate equal?"),
            W(r"The total utility", r"Utility level is not the slope. What price quantity does the rate match?"),
        ],
    ),
    item(
        "um_6_24",
        r"A budget line for two goods with prices $p_1, p_2$ and income $m$ is which equation?",
        r"Total spending equals income.",
        [
            C(r"$p_1 x_1 + p_2 x_2 = m$", r"Yes. Spending on both goods sums to the income."),
            W(r"$x_1 + x_2 = m$", r"That ignores prices. How do $p_1$ and $p_2$ enter?"),
            W(r"$p_1 x_1 = p_2 x_2$", r"That equates expenditures, not the total to income. What is the budget equation?"),
            W(r"$x_1 x_2 = m$", r"Spending is a sum, not a product. What is the correct form?"),
        ],
    ),
    # --- Contour maps and traces (6.9) ---
    item(
        "um_6_25",
        r"A contour map of $f(x, y)$ is a plot of what?",
        r"It stacks many level curves onto one diagram.",
        [
            C(r"Many level curves at different values of $c$", r"Yes. A contour map shows a family of level curves."),
            W(r"A single tangent plane", r"A tangent plane is one flat piece. What family forms a contour map?"),
            W(r"The gradient field only", r"That is a separate picture. What curves make a contour map?"),
            W(r"The boundary of the domain", r"The boundary is not the map. What family of curves does it draw?"),
        ],
    ),
    item(
        "um_6_26",
        r"Closely spaced contour lines indicate a surface that is doing what?",
        r"Tight spacing means a large change over a small horizontal distance.",
        [
            C(r"Changing steeply", r"Yes. Closely packed contours mark a steep region."),
            W(r"Staying flat", r"Flat regions have widely spaced contours. What does tight spacing mean?"),
            W(r"At a maximum", r"A maximum is a point, not implied by spacing alone. What does crowding indicate?"),
            W(r"Undefined", r"Close spacing is well defined behavior. What steepness does it show?"),
        ],
    ),
    item(
        "um_6_27",
        r"The trace of $z = x^2 + y^2$ in the plane $x = 1$ is which curve?",
        r"Substitute $x = 1$ and see how $z$ depends on $y$.",
        [
            C(r"The parabola $z = 1 + y^2$", r"Correct. Setting $x = 1$ gives $z = 1 + y^2$."),
            W(r"A circle", r"Fixing $x$ leaves a $z$ versus $y$ relation, not a circle. What is $z$ when $x = 1$?"),
            W(r"A straight line", r"The $y^2$ term curves it. What shape is $z = 1 + y^2$?"),
            W(r"An ellipse", r"This trace is an open parabola. What is the equation after $x = 1$?"),
        ],
    ),
    # --- Exact differentials (6.10) ---
    item(
        "um_6_28",
        r"The condition for $M\,dx + N\,dy$ to be exact is which equation?",
        r"Compare the cross partials of $M$ and $N$.",
        [
            C(r"$\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}$", r"Yes. Matching these cross partials is the exactness test."),
            W(r"$M = N$", r"The components need not be equal. Which partials must match?"),
            W(r"$M_x = N_y$", r"Those are the wrong partials. Which cross partials must agree?"),
            W(r"$M + N = 0$", r"That is not the condition. Which derivatives must be equal?"),
        ],
    ),
    item(
        "um_6_29",
        r"The integral of an exact differential between two points depends only on what?",
        r"An exact differential has a potential, so the line integral theorem applies.",
        [
            C(r"The endpoints", r"Yes. With a potential available, only the endpoints matter."),
            W(r"The path", r"Path dependence is the inexact case. What does the exact integral depend on?"),
            W(r"The length", r"Length does not enter the potential difference. What fixes the value?"),
            W(r"The orientation only", r"Orientation sets the sign, not path independence. What determines the value?"),
        ],
    ),
    item(
        "um_6_30",
        r"Is $y\,dx + 2x\,dy$ exact, and what does an exact differential correspond to physically?",
        r"Test $M_y$ against $N_x$ for $M = y$, $N = 2x$, and recall what exact means in thermodynamics.",
        [
            C(r"Not exact, since $M_y = 1 \neq 2 = N_x$; an exact differential is a path independent state function", r"Yes. The cross partials differ, so it is inexact, while exact differentials are state functions."),
            W(r"Exact, since $M_y = N_x$; it is a path dependent heat term", r"Recompute $M_y = 1$ and $N_x = 2$. Are they equal, and is an exact differential path dependent?"),
            W(r"Not exact, since $M_y \neq N_x$; but an exact differential is a path dependent quantity", r"The exactness conclusion is right, but reconsider what exact means. Are exact differentials path dependent or independent?"),
            W(r"Exact, since both are linear; it is a state function", r"Linearity does not ensure exactness. What do $M_y$ and $N_x$ equal here?"),
        ],
    ),
]


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
    unit_new = (emit_unit_block(UNIT5_TITLE, MASTERY_5) + ",\n\n"
                + emit_unit_block(UNIT6_TITLE, MASTERY_6))
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
    data["unit_mastery"][UNIT5_TITLE] = [strip_item(it) for it in MASTERY_5]
    data["unit_mastery"][UNIT6_TITLE] = [strip_item(it) for it in MASTERY_6]

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
    for it in MASTERY_5 + MASTERY_6:
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
    assert len(MICRO) == 32, "expected 32 micro videos, got %d" % len(MICRO)
    assert len(MASTERY_5) == 30, "Unit 5 mastery not 30 items"
    assert len(MASTERY_6) == 30, "Unit 6 mastery not 30 items"
    one_correct(MASTERY_5, "mastery5")
    one_correct(MASTERY_6, "mastery6")
    for it in MASTERY_5 + MASTERY_6:
        assert it["id"] not in seen_ids, "duplicate id %s" % it["id"]
        seen_ids.add(it["id"])

    if bad:
        for where, s in bad:
            print("[!] FORBIDDEN CHAR in", where, "->", s)
        raise SystemExit("Validation failed: forbidden characters present")
    print("[+] validation passed: %d micro videos, %d + %d mastery items, copy rules OK"
          % (len(MICRO), len(MASTERY_5), len(MASTERY_6)))


if __name__ == "__main__":
    validate()
    update_js()
    update_json()
    print("[+] Unit 5 and Unit 6 quiz generation complete")
