#!/usr/bin/env python3
"""
Generate Unit 11 (Mechanical Vibrations and Oscillators) and Unit 12 (The
Laplace Transform) interactive quizzes in a single batch.

Authors the 37 video micro-practice quizzes (five items each) and the two 30
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

UNIT11_TITLE = "Unit 11: Mechanical Vibrations and Oscillators"
UNIT12_TITLE = "Unit 12: The Laplace Transform"


def C(text, rationale):
    return {"text": text, "correct": True, "rationale": rationale}


def W(text, rationale):
    return {"text": text, "rationale": rationale}


def item(qid, prompt, hint, options):
    return {"id": qid, "prompt": prompt, "hint": hint, "answerOptions": options}


MICRO = []  # list of (video_id, comment_line, [items])


def add_micro(video_id, comment, items):
    MICRO.append((video_id, comment, items))


MASTERY_11 = []
MASTERY_12 = []


def m11(qid, prompt, hint, options):
    MASTERY_11.append(item(qid, prompt, hint, options))


def m12(qid, prompt, hint, options):
    MASTERY_12.append(item(qid, prompt, hint, options))


# ============================================================================
# CONTENT  (inserted above the machinery marker)
# ============================================================================

# ============================================================================
# UNIT 11 MICRO PRACTICE
# ============================================================================

# === 11.1 video 1 ===========================================================
add_micro(
    "gZ_KnZHCn4M",
    'Unit 11, Module 11.1, video 1\n           "Simple Harmonic Motion: Hooke\'s Law"',
    [
        item(
            "mp_gZ_KnZHCn4M_1",
            r"Hooke's law models the force a spring exerts when stretched a displacement $x$ from equilibrium. Which expression states it?",
            r"The spring pulls back toward equilibrium, so the force opposes the displacement.",
            [
                C(r"$F = -kx$", r"Yes. The restoring force is proportional to displacement and directed opposite to it, hence the minus sign."),
                W(r"$F = kx$", r"This points the force the same way as the displacement. Which direction must a restoring force act relative to $x$?"),
                W(r"$F = -kx^2$", r"Hooke's law is linear in displacement. What power of $x$ appears in the spring force?"),
                W(r"$F = -k/x$", r"An inverse dependence would blow up at equilibrium. How does the spring force scale with $x$ for a Hookean spring?"),
            ],
        ),
        item(
            "mp_gZ_KnZHCn4M_2",
            r"A mass-spring system obeys $2x'' + 18x = 0$. What is its natural angular frequency $\omega_0$?",
            r"Divide to the form $x'' + \omega_0^2 x = 0$, then read off $\omega_0$.",
            [
                C(r"$\omega_0 = 3$", r"Correct. Dividing gives $x'' + 9x = 0$, so $\omega_0^2 = 9$ and $\omega_0 = 3$."),
                W(r"$\omega_0 = 9$", r"You may have read $\omega_0^2$ as $\omega_0$. After dividing by $2$, what is $\sqrt{9}$?"),
                W(r"$\omega_0 = 18$", r"That is the original coefficient before dividing by the mass. What is $\sqrt{k/m}$ here?"),
                W(r"$\omega_0 = 6$", r"Check the division by the mass $2$. What is $18/2$, and then its square root?"),
            ],
        ),
        item(
            "mp_gZ_KnZHCn4M_3",
            r"For simple harmonic motion with angular frequency $\omega_0 = 3$, what is the period $T$?",
            r"Use $T = \frac{2\pi}{\omega_0}$.",
            [
                C(r"$T = \frac{2\pi}{3}$", r"Correct. The period is $2\pi$ divided by the angular frequency."),
                W(r"$T = \frac{3}{2\pi}$", r"That is the reciprocal arrangement. Which quantity goes on top in $T = 2\pi/\omega_0$?"),
                W(r"$T = 6\pi$", r"This multiplies rather than divides by $\omega_0$. How does $T$ depend on $\omega_0$?"),
                W(r"$T = 3$", r"The period is not the angular frequency itself. What formula connects $T$ and $\omega_0$?"),
            ],
        ),
        item(
            "mp_gZ_KnZHCn4M_4",
            r"What is the physical meaning of the minus sign in $F = -kx$?",
            r"Consider which way the force points when the mass is displaced to the right.",
            [
                C(r"The force is restoring, always pointing back toward equilibrium", r"Yes. When $x > 0$ the force is negative, pulling the mass back, which produces oscillation."),
                W(r"The force grows without bound", r"The magnitude stays proportional to $x$. What does the sign say about direction, not size?"),
                W(r"The spring constant is negative", r"The constant $k$ is positive; the sign is separate. What does the explicit minus encode about direction?"),
                W(r"The motion is damped", r"No damping term is present here. What does the sign tell you about where the force points?"),
            ],
        ),
        item(
            "mp_gZ_KnZHCn4M_5",
            r"What is the general solution of $x'' + \omega_0^2 x = 0$?",
            r"This is the constant-coefficient equation with purely imaginary characteristic roots $\pm i\omega_0$.",
            [
                C(r"$x = c_1 \cos(\omega_0 t) + c_2 \sin(\omega_0 t)$", r"Yes. Imaginary roots $\pm i\omega_0$ give an undamped oscillation at frequency $\omega_0$."),
                W(r"$x = c_1 e^{\omega_0 t} + c_2 e^{-\omega_0 t}$", r"Real exponentials solve $x'' - \omega_0^2 x = 0$. What roots does $x'' + \omega_0^2 x = 0$ give?"),
                W(r"$x = (c_1 + c_2 t)\cos(\omega_0 t)$", r"A repeated-root factor of $t$ is not needed for distinct imaginary roots. What is the plain oscillatory form?"),
                W(r"$x = c_1 \cos(\omega_0 t)$", r"One constant is too few for a second-order equation. What second independent solution is missing?"),
            ],
        ),
    ],
)

# === 11.1 video 2 ===========================================================
add_micro(
    "Z52emur7Rko",
    'Unit 11, Module 11.1, video 2\n           "Undamped Mechanical Vibrations and Hooke\'s Law, Simple Harmonic Motion"',
    [
        item(
            "mp_Z52emur7Rko_1",
            r"A hanging mass stretches a spring to a new equilibrium where gravity balances the spring force, so $mg = kL$. If $mg = 10$ N stretches the spring by $L = 0.2$ m, what is $k$?",
            r"Solve $k = mg/L$.",
            [
                C(r"$k = 50$ N/m", r"Correct. $k = mg/L = 10/0.2 = 50$ N/m."),
                W(r"$k = 2$ N/m", r"That is $mg \cdot L$, a product. The relation $mg = kL$ asks you to divide. What is $10/0.2$?"),
                W(r"$k = 10$ N/m", r"That is just the weight, ignoring the stretch $L$. What is $mg/L$?"),
                W(r"$k = 0.02$ N/m", r"Check which quantity divides which. Is it $L/mg$ or $mg/L$?"),
            ],
        ),
        item(
            "mp_Z52emur7Rko_2",
            r"The equation $m x'' + k x = 0$ has no first-derivative term. What does the absence of an $x'$ term mean physically?",
            r"A term proportional to velocity would represent friction or a dashpot.",
            [
                C(r"There is no damping, so the motion is undamped", r"Yes. A velocity-proportional term would be damping; without it the oscillation never decays."),
                W(r"There is no restoring force", r"The restoring force is the $kx$ term, which is present. What does a missing $x'$ term remove?"),
                W(r"The mass is zero", r"The mass multiplies $x''$ and is present. What physical effect does the $x'$ term represent when it appears?"),
                W(r"The system is forced", r"Forcing would appear on the right-hand side, not as an $x'$ term. What does the velocity term model?"),
            ],
        ),
        item(
            "mp_Z52emur7Rko_3",
            r"Write $x(t) = 3\cos(2t) + 4\sin(2t)$ in amplitude-phase form $x = C\cos(2t - \phi)$. What is the amplitude $C$?",
            r"The amplitude is $C = \sqrt{c_1^2 + c_2^2}$.",
            [
                C(r"$C = 5$", r"Correct. $C = \sqrt{3^2 + 4^2} = \sqrt{25} = 5$."),
                W(r"$C = 7$", r"You added the coefficients directly. The amplitude combines them as $\sqrt{c_1^2 + c_2^2}$, not $c_1 + c_2$."),
                W(r"$C = 12$", r"That is the product $3 \cdot 4$. How do the two coefficients combine into one amplitude?"),
                W(r"$C = 25$", r"That is $c_1^2 + c_2^2$ before the square root. What is $\sqrt{25}$?"),
            ],
        ),
        item(
            "mp_Z52emur7Rko_4",
            r"If the angular frequency of an oscillation is $\omega_0$, what is the frequency $f$ in cycles per second?",
            r"Angular frequency in radians per second relates to ordinary frequency by a factor of $2\pi$.",
            [
                C(r"$f = \frac{\omega_0}{2\pi}$", r"Yes. There are $2\pi$ radians per cycle, so $f = \omega_0/(2\pi)$."),
                W(r"$f = 2\pi\,\omega_0$", r"This multiplies instead of dividing by $2\pi$. How many radians are in one full cycle?"),
                W(r"$f = \omega_0$", r"Angular frequency and ordinary frequency differ by a factor. What converts radians per second to cycles per second?"),
                W(r"$f = \frac{2\pi}{\omega_0}$", r"That expression is the period $T$, not the frequency. What is the relationship between $f$ and $\omega_0$?"),
            ],
        ),
        item(
            "mp_Z52emur7Rko_5",
            r"In an undamped spring-mass system, what happens to the total mechanical energy over time?",
            r"With no damping there is no mechanism to dissipate energy.",
            [
                C(r"It stays constant, trading between kinetic and potential", r"Yes. Energy is conserved in the undamped case, oscillating between kinetic and spring potential."),
                W(r"It decreases steadily to zero", r"Decay requires a dissipative term. Is there any damping in an undamped system?"),
                W(r"It grows without bound", r"No energy source is present without forcing. What does conservation imply for the total?"),
                W(r"It is zero at all times", r"The mass is moving, so kinetic energy is generally nonzero. What is true of the total instead?"),
            ],
        ),
    ],
)

# === 11.2 video 1 ===========================================================
add_micro(
    "f2wGE_n5xtA",
    'Unit 11, Module 11.2, video 1\n           "Introduction to Free Undamped Motion, Spring System"',
    [
        item(
            "mp_f2wGE_n5xtA_1",
            r"Which equation describes free undamped motion of a spring-mass system?",
            r"Free means no external forcing; undamped means no velocity term.",
            [
                C(r"$m x'' + k x = 0$", r"Yes. No forcing on the right and no $x'$ term means free and undamped."),
                W(r"$m x'' + c x' + k x = 0$", r"The $c x'$ term is damping, so this is not undamped. Which term must be absent?"),
                W(r"$m x'' + k x = F_0 \cos(\omega t)$", r"A nonzero right-hand side is external forcing, so this is not free. What should the right side equal?"),
                W(r"$m x'' = 0$", r"With no restoring term there is no oscillation. Which term provides the spring restoring force?"),
            ],
        ),
        item(
            "mp_f2wGE_n5xtA_2",
            r"Solve the IVP $x'' + 4x = 0$, $x(0) = 1$, $x'(0) = 0$.",
            r"The general solution is $c_1 \cos 2t + c_2 \sin 2t$; apply the conditions.",
            [
                C(r"$x = \cos 2t$", r"Correct. $x(0) = 1$ gives $c_1 = 1$, and $x'(0) = 0$ gives $c_2 = 0$."),
                W(r"$x = \sin 2t$", r"This has $x(0) = 0$, violating $x(0) = 1$. Which function equals one at $t = 0$?"),
                W(r"$x = \cos 4t$", r"The angular frequency is $\sqrt{4} = 2$, not $4$. What frequency does $x'' + 4x = 0$ give?"),
                W(r"$x = \cos 2t + \sin 2t$", r"This has $x'(0) = 2 \neq 0$. What must $c_2$ be so that the initial velocity is zero?"),
            ],
        ),
        item(
            "mp_f2wGE_n5xtA_3",
            r"In the form $x = C\cos(\omega_0 t - \phi)$, what does the constant $C$ represent?",
            r"It is the single coefficient multiplying the cosine of the combined oscillation.",
            [
                C(r"The amplitude, the maximum displacement from equilibrium", r"Yes. $C$ is the amplitude, the largest value $|x|$ attains."),
                W(r"The angular frequency", r"The frequency is $\omega_0$ inside the cosine. What does the leading multiplier measure?"),
                W(r"The phase shift", r"The phase shift is $\phi$. What does the factor in front of the cosine represent?"),
                W(r"The period", r"The period is $2\pi/\omega_0$. What physical quantity is the front coefficient?"),
            ],
        ),
        item(
            "mp_f2wGE_n5xtA_4",
            r"A spring-mass system has $m = 1$ and $k = 16$ in $m x'' + k x = 0$. What is the period of oscillation?",
            r"Find $\omega_0 = \sqrt{k/m}$, then $T = 2\pi/\omega_0$.",
            [
                C(r"$T = \frac{\pi}{2}$", r"Correct. $\omega_0 = \sqrt{16} = 4$, so $T = 2\pi/4 = \pi/2$."),
                W(r"$T = 2\pi$", r"This uses $\omega_0 = 1$. What is $\sqrt{k/m}$ when $k = 16$ and $m = 1$?"),
                W(r"$T = 8\pi$", r"This divides by a frequency less than one. What is $2\pi$ divided by $\omega_0 = 4$?"),
                W(r"$T = 4$", r"That is the angular frequency $\omega_0$, not the period. What is $2\pi/\omega_0$?"),
            ],
        ),
        item(
            "mp_f2wGE_n5xtA_5",
            r"If the spring constant $k$ increases while the mass $m$ stays fixed, what happens to the natural frequency?",
            r"Recall $\omega_0 = \sqrt{k/m}$ and how it responds to a larger $k$.",
            [
                C(r"It increases, so the mass oscillates faster", r"Yes. A stiffer spring raises $\omega_0 = \sqrt{k/m}$, speeding up the oscillation."),
                W(r"It decreases", r"A larger $k$ increases $\sqrt{k/m}$. Does the frequency rise or fall with stiffness?"),
                W(r"It stays the same", r"The frequency depends on $k$ through $\sqrt{k/m}$. How does raising $k$ change it?"),
                W(r"It becomes zero", r"A nonzero stiffer spring keeps the system oscillating. What is the effect of larger $k$ on $\omega_0$?"),
            ],
        ),
    ],
)

# === 11.2 video 2 ===========================================================
add_micro(
    "3F6NlCP4CWU",
    'Unit 11, Module 11.2, video 2\n           "Free Mechanical Vibrations, Differential Equations"',
    [
        item(
            "mp_3F6NlCP4CWU_1",
            r"Solve the IVP $x'' + 9x = 0$, $x(0) = 0$, $x'(0) = 6$.",
            r"Use $x = c_1\cos 3t + c_2\sin 3t$ and match the conditions; recall $x'(0)$ involves the sine coefficient.",
            [
                C(r"$x = 2\sin 3t$", r"Correct. $x(0) = 0$ kills the cosine, and $x'(0) = 3c_2 = 6$ gives $c_2 = 2$."),
                W(r"$x = 6\sin 3t$", r"The derivative brings down a factor of $3$, so $3c_2 = 6$. What is $c_2$?"),
                W(r"$x = 2\cos 3t$", r"Cosine has $x(0) = 2 \neq 0$. Which function vanishes at $t = 0$ to match $x(0) = 0$?"),
                W(r"$x = 6\sin 9t$", r"The frequency is $\sqrt{9} = 3$, not $9$, and the coefficient must satisfy $3c_2 = 6$. Recheck both."),
            ],
        ),
        item(
            "mp_3F6NlCP4CWU_2",
            r"How many initial conditions are needed to determine the motion of a free undamped oscillator uniquely?",
            r"The count matches the number of arbitrary constants in a second-order solution.",
            [
                C(r"Two, typically initial position and initial velocity", r"Yes. The second-order equation has two constants, fixed by $x(0)$ and $x'(0)$."),
                W(r"One, just initial position", r"One condition leaves the initial velocity free. How many constants must be pinned down?"),
                W(r"Three", r"Three would over-determine a two-constant family. How many free constants does a second-order solution have?"),
                W(r"None", r"Without conditions the motion is a whole family. How many does it take to select one?"),
            ],
        ),
        item(
            "mp_3F6NlCP4CWU_3",
            r"What is the amplitude of the motion $x(t) = 2\sin 3t$?",
            r"For a single sinusoid, the amplitude is the absolute value of its coefficient.",
            [
                C(r"$2$", r"Correct. The coefficient $2$ is the maximum displacement."),
                W(r"$3$", r"That is the angular frequency inside the sine, not the amplitude. What multiplies the sine?"),
                W(r"$6$", r"That is the product of the coefficient and frequency. What is the leading coefficient alone?"),
                W(r"$2\pi/3$", r"That is the period of the motion. What is the maximum value of $|x|$?"),
            ],
        ),
        item(
            "mp_3F6NlCP4CWU_4",
            r"Two identical systems start with different initial conditions. What does the angular frequency $\omega_0$ depend on?",
            r"Think about which quantities set $\omega_0 = \sqrt{k/m}$.",
            [
                C(r"Only the mass and spring constant, not the initial conditions", r"Yes. $\omega_0 = \sqrt{k/m}$ is fixed by the physical system, independent of how the motion starts."),
                W(r"The initial position", r"The starting position sets the amplitude and phase, not the frequency. What determines $\omega_0$?"),
                W(r"The initial velocity", r"Initial velocity affects amplitude and phase, not how fast it oscillates. What sets $\omega_0$?"),
                W(r"The amplitude of motion", r"Amplitude does not change the frequency in a linear oscillator. What physical constants set $\omega_0$?"),
            ],
        ),
        item(
            "mp_3F6NlCP4CWU_5",
            r"Write $x(t) = 5\cos 2t + 12\sin 2t$ as a single sinusoid. What is its amplitude?",
            r"Combine the coefficients as $\sqrt{c_1^2 + c_2^2}$.",
            [
                C(r"$13$", r"Correct. $\sqrt{5^2 + 12^2} = \sqrt{169} = 13$."),
                W(r"$17$", r"That is $5 + 12$, a direct sum. The amplitude combines them as $\sqrt{c_1^2 + c_2^2}$."),
                W(r"$60$", r"That is the product $5 \cdot 12$. How do the coefficients combine into one amplitude?"),
                W(r"$169$", r"That is $5^2 + 12^2$ before the square root. What is $\sqrt{169}$?"),
            ],
        ),
    ],
)

# === 11.3 video 1 ===========================================================
add_micro(
    "CTd1uVq5-l8",
    'Unit 11, Module 11.3, video 1\n           "Mechanical Vibrations: Underdamped vs Overdamped vs Critically Damped"',
    [
        item(
            "mp_CTd1uVq5-l8_1",
            r"In the damped equation $m x'' + c x' + k x = 0$, which term represents the damping?",
            r"Damping resists motion and is proportional to velocity.",
            [
                C(r"$c x'$, proportional to velocity", r"Yes. The damping force opposes motion and scales with the velocity $x'$."),
                W(r"$k x$, proportional to displacement", r"That is the spring restoring force. Which term involves the velocity?"),
                W(r"$m x''$, proportional to acceleration", r"That is the inertial term. Which term is proportional to velocity?"),
                W(r"There is no damping term", r"One term involves $x'$. Which derivative does damping multiply?"),
            ],
        ),
        item(
            "mp_CTd1uVq5-l8_2",
            r"The damping case is classified by the discriminant $c^2 - 4mk$. Which sign corresponds to overdamping?",
            r"Overdamping means two distinct real characteristic roots, which requires a positive discriminant.",
            [
                C(r"$c^2 - 4mk > 0$", r"Yes. A positive discriminant gives two distinct real roots and no oscillation, which is overdamped."),
                W(r"$c^2 - 4mk = 0$", r"A zero discriminant is the critically damped boundary, not overdamped. What sign gives two distinct real roots?"),
                W(r"$c^2 - 4mk < 0$", r"A negative discriminant gives complex roots and oscillation, which is underdamped. What sign gives overdamping?"),
                W(r"$c^2 - 4mk = 1$", r"The specific value does not matter, only its sign relative to zero. Which sign produces two real roots?"),
            ],
        ),
        item(
            "mp_CTd1uVq5-l8_3",
            r"For $m = 1$ and $k = 9$, what damping coefficient $c$ makes the system critically damped?",
            r"Critical damping occurs when $c^2 - 4mk = 0$, so $c = 2\sqrt{mk}$.",
            [
                C(r"$c = 6$", r"Correct. $c = 2\sqrt{mk} = 2\sqrt{9} = 6$."),
                W(r"$c = 3$", r"That is $\sqrt{k}$, missing the factor of $2$. What is $2\sqrt{mk}$?"),
                W(r"$c = 9$", r"That is $k$ itself. Critical damping needs $c^2 = 4mk$. What is $\sqrt{4 \cdot 9}$?"),
                W(r"$c = 18$", r"That is $2k$, not $2\sqrt{mk}$. With $m = 1$, what is $2\sqrt{9}$?"),
            ],
        ),
        item(
            "mp_CTd1uVq5-l8_4",
            r"What is the characteristic motion of an underdamped system?",
            r"Underdamped corresponds to complex roots with a negative real part.",
            [
                C(r"Oscillation with an amplitude that decays over time", r"Yes. Complex roots give oscillation, and the negative real part makes the amplitude shrink."),
                W(r"A smooth return to equilibrium with no oscillation", r"That describes overdamped or critically damped motion. What do complex roots add?"),
                W(r"Sustained oscillation with constant amplitude", r"Constant amplitude needs zero damping. What does a negative real part do to the amplitude?"),
                W(r"Unbounded growth", r"Damping removes energy, so the motion decays. What kind of decaying behavior do complex roots give?"),
            ],
        ),
        item(
            "mp_CTd1uVq5-l8_5",
            r"Which damping case returns the system to equilibrium fastest without oscillating?",
            r"It is the boundary case sitting exactly between oscillation and sluggish decay.",
            [
                C(r"Critically damped", r"Yes. Critical damping gives the quickest non-oscillatory return to equilibrium."),
                W(r"Overdamped", r"Overdamping returns slowly because of the strong resistance. Which case is the fast boundary?"),
                W(r"Underdamped", r"Underdamping oscillates on the way back, so it does overshoot. Which case avoids oscillation yet is fastest?"),
                W(r"Undamped", r"Undamped motion never settles; it oscillates forever. Which damped case settles fastest without oscillating?"),
            ],
        ),
    ],
)

# === 11.3 video 2 ===========================================================
add_micro(
    "dQ6_aaFlVTo",
    'Unit 11, Module 11.3, video 2\n           "Mechanical Vibrations, Ordinary Differential Equations, Lecture 18"',
    [
        item(
            "mp_dQ6_aaFlVTo_1",
            r"Solve $x'' + 5x' + 6x = 0$. What is the general solution, and which damping case is it?",
            r"Factor $r^2 + 5r + 6 = (r+2)(r+3)$ to find the roots.",
            [
                C(r"$x = c_1 e^{-2t} + c_2 e^{-3t}$, overdamped", r"Correct. Distinct real roots $-2, -3$ give pure decay with no oscillation, the overdamped case."),
                W(r"$x = (c_1 + c_2 t)e^{-2t}$, critically damped", r"A repeated-root form needs equal roots, but $-2$ and $-3$ differ. Which case has two distinct real roots?"),
                W(r"$x = e^{-t}(c_1\cos t + c_2\sin t)$, underdamped", r"Oscillatory forms come from complex roots, but here the discriminant is positive. What real roots does $(r+2)(r+3)$ give?"),
                W(r"$x = c_1 e^{2t} + c_2 e^{3t}$, unstable", r"Check the signs of the roots of $(r+2)(r+3) = 0$. Are they positive or negative?"),
            ],
        ),
        item(
            "mp_dQ6_aaFlVTo_2",
            r"Solve $x'' + 2x' + x = 0$. What is the general solution?",
            r"The characteristic equation $r^2 + 2r + 1 = (r+1)^2$ is a perfect square.",
            [
                C(r"$x = (c_1 + c_2 t)e^{-t}$", r"Correct. The repeated root $-1$ gives the factor $t$ on the second solution, the critically damped form."),
                W(r"$x = c_1 e^{-t} + c_2 e^{t}$", r"The roots are not $\pm 1$; the equation factors as $(r+1)^2$. What repeated root appears?"),
                W(r"$x = c_1 e^{-t} + c_2 e^{-2t}$", r"These are distinct roots, but $(r+1)^2$ has a single repeated root. What form handles a double root?"),
                W(r"$x = e^{-t}(c_1\cos t + c_2\sin t)$", r"Complex roots are not present here; the discriminant is zero. What repeated-root form applies?"),
            ],
        ),
        item(
            "mp_dQ6_aaFlVTo_3",
            r"Solve $x'' + 2x' + 5x = 0$. What is the general solution?",
            r"Use the quadratic formula on $r^2 + 2r + 5 = 0$ to get $r = -1 \pm 2i$.",
            [
                C(r"$x = e^{-t}(c_1\cos 2t + c_2\sin 2t)$", r"Correct. The roots $-1 \pm 2i$ give a decaying envelope $e^{-t}$ times oscillation at frequency $2$."),
                W(r"$x = e^{t}(c_1\cos 2t + c_2\sin 2t)$", r"Check the real part of the roots. Is it $+1$ or $-1$?"),
                W(r"$x = e^{-t}(c_1\cos t + c_2\sin t)$", r"The oscillation frequency is the imaginary part of the roots. Is it $1$ or $2$?"),
                W(r"$x = c_1 e^{-t} + c_2 e^{-5t}$", r"The discriminant $4 - 20$ is negative, so the roots are complex. What oscillatory form results?"),
            ],
        ),
        item(
            "mp_dQ6_aaFlVTo_4",
            r"In an underdamped solution $e^{-bt}(c_1\cos\mu t + c_2\sin\mu t)$, what role does the factor $e^{-bt}$ play?",
            r"This factor multiplies an oscillation that itself stays bounded.",
            [
                C(r"It is the decaying envelope that shrinks the oscillation amplitude over time", r"Yes. The exponential envelope steadily reduces the amplitude of the bounded oscillation."),
                W(r"It sets the oscillation frequency", r"Frequency comes from $\mu$ inside the trig functions. What does the exponential do to the amplitude?"),
                W(r"It makes the motion grow", r"With $b > 0$ the factor decays, not grows. What happens to the envelope as $t$ increases?"),
                W(r"It shifts the phase", r"Phase comes from the combination of cosine and sine. What does the exponential factor control?"),
            ],
        ),
        item(
            "mp_dQ6_aaFlVTo_5",
            r"How does the quasi-frequency of an underdamped oscillator compare to the undamped natural frequency $\omega_0$?",
            r"Damping modifies the oscillation rate through the imaginary part of the complex roots.",
            [
                C(r"The quasi-frequency is lower than $\omega_0$", r"Yes. Damping reduces the oscillation rate, so the quasi-frequency is below the undamped natural frequency."),
                W(r"It is higher than $\omega_0$", r"Damping slows oscillation rather than speeding it. Is the damped rate above or below $\omega_0$?"),
                W(r"It equals $\omega_0$ exactly", r"Only the undamped case oscillates at $\omega_0$. How does damping shift the rate?"),
                W(r"It is always zero", r"An underdamped system does oscillate, so its frequency is nonzero. How does it compare to $\omega_0$?"),
            ],
        ),
    ],
)

# === 11.4 video 1 ===========================================================
add_micro(
    "PzuhMbZYVLA",
    'Unit 11, Module 11.4, video 1\n           "Undamped Forced Motion and Resonance"',
    [
        item(
            "mp_PzuhMbZYVLA_1",
            r"For undamped forced motion $m x'' + k x = F_0\cos(\omega t)$, pure resonance occurs under which condition?",
            r"Resonance happens when the driving frequency matches the system's natural frequency.",
            [
                C(r"The forcing frequency $\omega$ equals the natural frequency $\omega_0$", r"Yes. Driving at the natural frequency causes resonance in the undamped system."),
                W(r"The forcing amplitude $F_0$ is very large", r"A large amplitude alone is not resonance. Which frequencies must coincide?"),
                W(r"The mass $m$ is zero", r"A zero mass is unphysical here. What frequency condition defines resonance?"),
                W(r"The forcing frequency is zero", r"Zero forcing frequency is a constant push, not resonance. What must $\omega$ equal?"),
            ],
        ),
        item(
            "mp_PzuhMbZYVLA_2",
            r"At pure resonance in an undamped system, how does the amplitude of the response behave over time?",
            r"With no damping to absorb energy, the driving keeps pumping energy in at the natural frequency.",
            [
                C(r"It grows without bound, increasing linearly in $t$", r"Yes. The resonant particular solution has a factor of $t$, so the amplitude grows without limit."),
                W(r"It stays constant", r"Constant amplitude occurs off resonance. What does matching frequencies do with no damping?"),
                W(r"It decays to zero", r"Decay requires damping, which is absent here. What happens when energy keeps being added?"),
                W(r"It oscillates between fixed bounds", r"Bounded oscillation is the off-resonance case. What does the resonant $t$ factor cause?"),
            ],
        ),
        item(
            "mp_PzuhMbZYVLA_3",
            r"When the forcing frequency equals the natural frequency, the particular-solution trial must be modified how?",
            r"The plain trial already solves the homogeneous equation, so it must be multiplied by $t$.",
            [
                C(r"Multiply the trial by $t$, giving $x_p = t(A\cos\omega_0 t + B\sin\omega_0 t)$", r"Yes. Because the forcing matches a homogeneous solution, the trial gains a factor of $t$."),
                W(r"Use $x_p = A\cos\omega_0 t + B\sin\omega_0 t$ unchanged", r"That plain trial already solves the homogeneous equation, so it fails. What factor must be inserted?"),
                W(r"Use $x_p = A e^{\omega_0 t}$", r"An exponential trial does not match cosine forcing. What modification handles the resonance overlap?"),
                W(r"Multiply the trial by $t^2$", r"A single overlap with the homogeneous solution needs only one factor of $t$. How many powers of $t$ are required?"),
            ],
        ),
        item(
            "mp_PzuhMbZYVLA_4",
            r"For $x'' + 25x = \cos(\omega t)$, at which forcing frequency does resonance occur?",
            r"Find $\omega_0$ from $x'' + \omega_0^2 x = 0$, then set $\omega = \omega_0$.",
            [
                C(r"$\omega = 5$", r"Correct. The natural frequency is $\sqrt{25} = 5$, so resonance occurs at $\omega = 5$."),
                W(r"$\omega = 25$", r"That is $\omega_0^2$, not $\omega_0$. What is $\sqrt{25}$?"),
                W(r"$\omega = 0$", r"Zero forcing frequency is a constant push, not resonance. What is the natural frequency here?"),
                W(r"$\omega = \frac{1}{5}$", r"That is the reciprocal of the natural frequency. What value of $\omega$ matches $\omega_0 = 5$?"),
            ],
        ),
        item(
            "mp_PzuhMbZYVLA_5",
            r"Why is resonance a practical engineering concern for structures?",
            r"Consider what unbounded amplitude growth does to a physical structure.",
            [
                C(r"The growing amplitude can produce destructive oscillations", r"Yes. Resonant growth can drive displacements large enough to damage or destroy a structure."),
                W(r"It makes the structure perfectly rigid", r"Resonance increases motion, not rigidity. What does the amplitude do at resonance?"),
                W(r"It eliminates all vibration", r"Resonance amplifies vibration rather than removing it. What is the danger of large amplitude?"),
                W(r"It lowers the natural frequency permanently", r"Resonance is about matching frequencies, not changing them. What physical risk does growing amplitude pose?"),
            ],
        ),
    ],
)

# === 11.4 video 2 ===========================================================
add_micro(
    "7bYgGelMC-E",
    'Unit 11, Module 11.4, video 2\n           "Forced Motion: Beats, Resonance, and an Example"',
    [
        item(
            "mp_7bYgGelMC-E_1",
            r"Beats arise in an undamped forced system under which condition on the forcing frequency $\omega$?",
            r"Beats are distinct from resonance; the frequencies are close but not identical.",
            [
                C(r"$\omega$ is close to but not equal to $\omega_0$", r"Yes. Two nearby frequencies interfere to produce the slow amplitude modulation called beats."),
                W(r"$\omega$ equals $\omega_0$ exactly", r"Exact equality gives resonance, not beats. What relationship between the frequencies produces beats?"),
                W(r"$\omega$ is zero", r"Zero forcing frequency is a constant push. What near-match condition produces beats?"),
                W(r"$\omega$ is much larger than $\omega_0$", r"Beats need the two frequencies to be close. How close must $\omega$ be to $\omega_0$?"),
            ],
        ),
        item(
            "mp_7bYgGelMC-E_2",
            r"What is the hallmark of a beat pattern?",
            r"Picture a fast oscillation whose loudness rises and falls slowly.",
            [
                C(r"A slow periodic rise and fall of the oscillation amplitude", r"Yes. The amplitude is modulated by a slow envelope while the fast oscillation continues underneath."),
                W(r"A steadily growing amplitude", r"Unbounded growth is resonance, not beats. What does the amplitude do in a beat pattern?"),
                W(r"A constant amplitude with no variation", r"Beats specifically vary the amplitude. What slow behavior of the amplitude defines them?"),
                W(r"A sudden jump in frequency", r"Beats keep the frequencies fixed and modulate amplitude. What happens to the amplitude over time?"),
            ],
        ),
        item(
            "mp_7bYgGelMC-E_3",
            r"The beat envelope comes from a product-to-sum identity. Which identity converts the difference of two cosines into a product?",
            r"The relevant identity writes $\cos A - \cos B$ as a product of two sines.",
            [
                C(r"$\cos A - \cos B = -2\sin\!\frac{A+B}{2}\,\sin\!\frac{A-B}{2}$", r"Yes. This product form exposes a fast oscillation times a slow envelope, producing beats."),
                W(r"$\cos A - \cos B = \cos(A - B)$", r"A difference of cosines is not the cosine of the difference. Which identity yields a product of sines?"),
                W(r"$\cos A - \cos B = 2\cos\!\frac{A+B}{2}\cos\!\frac{A-B}{2}$", r"That product form is for the sum $\cos A + \cos B$, not the difference. What does the difference give?"),
                W(r"$\cos A - \cos B = \sin A - \sin B$", r"Cosines do not convert directly into sines this way. Which product-to-sum identity applies to the difference?"),
            ],
        ),
        item(
            "mp_7bYgGelMC-E_4",
            r"As the forcing frequency $\omega$ approaches the natural frequency $\omega_0$, what happens to the beat period?",
            r"The beat envelope frequency is proportional to the difference $\omega_0 - \omega$.",
            [
                C(r"The beat period grows longer, approaching the resonance limit", r"Yes. As the frequencies converge, the slow envelope stretches out, blending into resonant growth."),
                W(r"The beat period shrinks to zero", r"A smaller frequency difference makes the envelope slower, not faster. What happens to the period?"),
                W(r"The beat period stays fixed", r"The envelope depends on $\omega_0 - \omega$, which is changing. How does the period respond as the gap closes?"),
                W(r"The beats disappear immediately", r"The transition to resonance is gradual. What does the beat period do as $\omega \to \omega_0$?"),
            ],
        ),
        item(
            "mp_7bYgGelMC-E_5",
            r"Off resonance, the steady particular solution of $m x'' + k x = F_0\cos(\omega t)$ has amplitude proportional to $\frac{1}{m(\omega_0^2 - \omega^2)}$. What happens as $\omega \to \omega_0$?",
            r"Look at the denominator and what it approaches.",
            [
                C(r"The amplitude grows without bound because the denominator approaches zero", r"Yes. As $\omega \to \omega_0$ the factor $\omega_0^2 - \omega^2$ vanishes, driving the amplitude up, which signals resonance."),
                W(r"The amplitude approaches zero", r"A vanishing denominator makes a fraction large, not small. What happens to $\frac{1}{m(\omega_0^2-\omega^2)}$?"),
                W(r"The amplitude stays constant", r"The denominator is changing as $\omega \to \omega_0$. What does it approach, and what does that do to the fraction?"),
                W(r"The amplitude becomes negative", r"The magnitude is what blows up here. What does the denominator approaching zero do to the size of the amplitude?"),
            ],
        ),
    ],
)

# === 11.5 video 1 ===========================================================
add_micro(
    "-pXnfzQfupE",
    'Unit 11, Module 11.5, video 1\n           "Coupled Oscillators, Lecture 46, Differential Equations for Engineers"',
    [
        item(
            "mp_-pXnfzQfupE_1",
            r"What characterizes a system of coupled oscillators?",
            r"Coupling means the equation for one mass involves the position of another.",
            [
                C(r"The equations of motion are linked, so each mass's acceleration depends on the others' positions", r"Yes. Coupling springs make the equations interdependent rather than separate."),
                W(r"Each mass moves completely independently", r"Independent motion is the uncoupled case. What does coupling do to the equations?"),
                W(r"There is only one mass in the system", r"Coupled oscillators involve multiple masses. What links their equations?"),
                W(r"The masses never move", r"Coupled oscillators do move and exchange energy. How are their equations related?"),
            ],
        ),
        item(
            "mp_-pXnfzQfupE_2",
            r"What is a normal mode of a coupled oscillator system?",
            r"In a normal mode every part of the system shares one common rhythm.",
            [
                C(r"A motion in which all masses oscillate at a single common frequency", r"Yes. In a normal mode the whole system moves sinusoidally at one shared frequency."),
                W(r"A motion in which each mass has a different frequency", r"Differing frequencies describe general motion, not a single mode. What frequency structure defines a normal mode?"),
                W(r"A state in which the masses are at rest", r"A normal mode is an active oscillation, not rest. What do all masses share in a mode?"),
                W(r"The decay of the system to equilibrium", r"Normal modes are sustained oscillations, not decay. What common feature do the masses have?"),
            ],
        ),
        item(
            "mp_-pXnfzQfupE_3",
            r"How many normal modes does a system of two coupled masses (two degrees of freedom) have?",
            r"The number of normal modes equals the number of degrees of freedom.",
            [
                C(r"Two", r"Yes. Two degrees of freedom yield two independent normal modes."),
                W(r"One", r"A single mode cannot span a two-degree-of-freedom system. How many modes match two degrees of freedom?"),
                W(r"Three", r"Three exceeds the number of degrees of freedom here. How many independent modes does a two-mass system have?"),
                W(r"Infinitely many", r"A finite system has a finite number of modes. How many degrees of freedom are there?"),
            ],
        ),
        item(
            "mp_-pXnfzQfupE_4",
            r"In a single normal mode, what is true about the ratio of the masses' amplitudes?",
            r"A normal mode has a fixed shape that the masses keep as they oscillate together.",
            [
                C(r"The amplitude ratio is fixed and characteristic of that mode", r"Yes. Each mode has a definite shape, so the amplitude ratio between masses is constant."),
                W(r"The ratio changes randomly over time", r"A normal mode keeps a fixed shape. What stays constant about the amplitudes?"),
                W(r"The amplitudes are always equal", r"Equal amplitudes occur only for special symmetric modes, not in general. What is generally true of the ratio?"),
                W(r"One amplitude is always zero", r"In a mode both masses generally move. What property of the amplitude ratio defines a mode?"),
            ],
        ),
        item(
            "mp_-pXnfzQfupE_5",
            r"How is the general motion of a coupled oscillator system related to its normal modes?",
            r"Linearity allows solutions to be combined.",
            [
                C(r"It is a superposition (linear combination) of the normal modes", r"Yes. Any motion can be written as a sum of the normal modes with appropriate amplitudes and phases."),
                W(r"It must be exactly one normal mode", r"General motion can mix modes. How do the modes combine to give arbitrary motion?"),
                W(r"It is unrelated to the normal modes", r"The modes form a basis for all motion. How does linearity let them build the general solution?"),
                W(r"It is the product of the normal modes", r"Linear systems combine solutions by addition, not multiplication. What combination gives the general motion?"),
            ],
        ),
    ],
)

# === 11.5 video 2 ===========================================================
add_micro(
    "Ye92jN6FrlU",
    'Unit 11, Module 11.5, video 2\n           "Coupled Oscillators, Resonance Frequencies, Superposition of Modes"',
    [
        item(
            "mp_Ye92jN6FrlU_1",
            r"Writing a coupled system as $\mathbf{x}'' = A\mathbf{x}$, the normal-mode frequencies are found from which quantities of $A$?",
            r"The mode frequencies come from the eigenvalues of the coefficient matrix.",
            [
                C(r"Its eigenvalues, which give $\omega^2$ for each mode", r"Yes. Each eigenvalue determines a normal-mode frequency through $\omega^2$."),
                W(r"Its trace alone", r"The trace is only the sum of eigenvalues, not the individual frequencies. What set of values gives each mode?"),
                W(r"Its determinant alone", r"The determinant is the product of eigenvalues, not each frequency. What quantities give the modes?"),
                W(r"Its diagonal entries directly", r"For a coupled matrix the diagonal entries are not the frequencies. What must you compute from $A$?"),
            ],
        ),
        item(
            "mp_Ye92jN6FrlU_2",
            r"For two identical coupled masses, how do the in-phase and out-of-phase modes compare in frequency?",
            r"Stretching the coupling spring (out of phase) adds restoring force; moving together (in phase) does not.",
            [
                C(r"The in-phase mode has the lower frequency, the out-of-phase mode the higher", r"Yes. Out-of-phase motion stretches the coupling spring more, raising its frequency above the in-phase mode."),
                W(r"Both modes have the same frequency", r"Coupling splits the frequencies. Which mode stretches the coupling spring and raises its frequency?"),
                W(r"The out-of-phase mode has the lower frequency", r"Out-of-phase motion engages the coupling spring more strongly. Which mode is therefore faster?"),
                W(r"The frequencies depend only on initial conditions", r"Mode frequencies are set by the physical system. Which mode stiffens the coupling and raises the frequency?"),
            ],
        ),
        item(
            "mp_Ye92jN6FrlU_3",
            r"Consider the coupled system $x_1'' = -2x_1 + x_2$ and $x_2'' = x_1 - 2x_2$. The matrix has eigenvalues $-1$ and $-3$. What are the normal-mode angular frequencies?",
            r"Each eigenvalue equals $-\omega^2$, so $\omega = \sqrt{-\lambda}$.",
            [
                C(r"$\omega = 1$ and $\omega = \sqrt{3}$", r"Correct. From $-\omega^2 = -1$ and $-\omega^2 = -3$ we get $\omega = 1$ and $\omega = \sqrt{3}$."),
                W(r"$\omega = -1$ and $\omega = -3$", r"Frequencies are positive and come from $\omega = \sqrt{-\lambda}$. What are $\sqrt{1}$ and $\sqrt{3}$?"),
                W(r"$\omega = 1$ and $\omega = 3$", r"The second eigenvalue is $-3$, so $\omega = \sqrt{3}$, not $3$. Recompute the square root."),
                W(r"$\omega = 2$ and $\omega = 2$", r"The diagonal entry $-2$ is not an eigenvalue of the coupled matrix. Use the given eigenvalues $-1$ and $-3$."),
            ],
        ),
        item(
            "mp_Ye92jN6FrlU_4",
            r"Once the normal modes are known, how is the full solution of the coupled system expressed?",
            r"Combine the modes the way linear solutions are always combined.",
            [
                C(r"As a superposition of the modes, each with its own amplitude and phase", r"Yes. The general solution is a linear combination of the normal-mode oscillations."),
                W(r"As the single fastest mode only", r"Discarding modes loses generality. How are all modes combined?"),
                W(r"As the product of the modes", r"Linear systems superpose by addition, not multiplication. How do the modes combine?"),
                W(r"As an exponential of the mode matrix", r"The modes are oscillatory and add linearly. What combination gives the general solution?"),
            ],
        ),
        item(
            "mp_Ye92jN6FrlU_5",
            r"For two identical pendulums joined by a very weak coupling spring, the in-phase mode frequency is approximately what?",
            r"In the in-phase mode the coupling spring is never stretched, so it contributes no force.",
            [
                C(r"Approximately the frequency of a single uncoupled pendulum", r"Yes. Moving together leaves the coupling spring relaxed, so each pendulum swings at its natural frequency."),
                W(r"Much higher than a single pendulum", r"The coupling spring is unstretched in this mode, adding no stiffness. What frequency remains?"),
                W(r"Zero", r"The pendulums still swing under gravity. What is the natural pendulum frequency when the spring is relaxed?"),
                W(r"Twice the single-pendulum frequency", r"No extra restoring force acts in the in-phase mode. What frequency does an uncoupled pendulum have?"),
            ],
        ),
    ],
)

# === 11.6 video 1 ===========================================================
add_micro(
    "8ePqqZXSMQs",
    'Unit 11, Module 11.6, video 1\n           "Second-Order ODEs: Solving the Harmonic Oscillator Four Ways"',
    [
        item(
            "mp_8ePqqZXSMQs_1",
            r"Which differential equation is the harmonic oscillator?",
            r"It is the undamped, unforced second-order equation with a linear restoring term.",
            [
                C(r"$x'' + \omega_0^2 x = 0$", r"Yes. This is the canonical harmonic oscillator with natural frequency $\omega_0$."),
                W(r"$x'' - \omega_0^2 x = 0$", r"The minus sign gives growing and decaying exponentials, not oscillation. What sign produces oscillation?"),
                W(r"$x' + \omega_0^2 x = 0$", r"That is first order and gives exponential decay, not oscillation. What order is the harmonic oscillator?"),
                W(r"$x'' + \omega_0^2 x = F_0\cos(\omega t)$", r"A nonzero right-hand side is forced motion, not the plain oscillator. What should the right side be?"),
            ],
        ),
        item(
            "mp_8ePqqZXSMQs_2",
            r"One of the four approaches uses the characteristic equation. What characteristic equation does $x'' + \omega_0^2 x = 0$ produce?",
            r"Substitute $x = e^{rt}$ and cancel the exponential.",
            [
                C(r"$r^2 + \omega_0^2 = 0$", r"Yes. The trial $e^{rt}$ gives $r^2 + \omega_0^2 = 0$, with roots $\pm i\omega_0$."),
                W(r"$r^2 - \omega_0^2 = 0$", r"That would come from $x'' - \omega_0^2 x = 0$. What sign does the $+\omega_0^2 x$ term contribute?"),
                W(r"$r + \omega_0^2 = 0$", r"The second derivative contributes $r^2$, not $r$. What power of $r$ should appear?"),
                W(r"$r^2 + \omega_0 = 0$", r"The constant term should be $\omega_0^2$, matching the coefficient of $x$. What is it?"),
            ],
        ),
        item(
            "mp_8ePqqZXSMQs_3",
            r"The characteristic roots of $r^2 + \omega_0^2 = 0$ are which values, and what solution do they give?",
            r"Solve for $r$ and translate complex roots into real oscillatory solutions.",
            [
                C(r"$r = \pm i\omega_0$, giving $c_1\cos\omega_0 t + c_2\sin\omega_0 t$", r"Correct. Purely imaginary roots produce undamped sinusoidal motion at frequency $\omega_0$."),
                W(r"$r = \pm\omega_0$, giving $c_1 e^{\omega_0 t} + c_2 e^{-\omega_0 t}$", r"Those real roots come from a minus sign in the equation. What roots does $r^2 = -\omega_0^2$ give?"),
                W(r"$r = 0$ (double), giving $c_1 + c_2 t$", r"A double zero root needs $r^2 = 0$. What does $r^2 + \omega_0^2 = 0$ give instead?"),
                W(r"$r = \omega_0 i$ only, giving $c_1\cos\omega_0 t$", r"There are two roots and two independent solutions. What is the second root and solution?"),
            ],
        ),
        item(
            "mp_8ePqqZXSMQs_4",
            r"Another approach multiplies $x'' + \omega_0^2 x = 0$ by $x'$ and integrates. What does this energy method produce?",
            r"Integrating $x'' x' + \omega_0^2 x x'$ gives a sum of squares that stays constant.",
            [
                C(r"A conserved quantity, $\tfrac{1}{2}(x')^2 + \tfrac{1}{2}\omega_0^2 x^2 = \text{const}$", r"Yes. This is the conserved energy, a first integral of the oscillator equation."),
                W(r"A first-order linear equation in $x$", r"The result is a conservation law, not a linear ODE. What combination of squares stays constant?"),
                W(r"The characteristic equation", r"That comes from the exponential trial, not from integrating. What conserved expression results here?"),
                W(r"A forcing term", r"No forcing is introduced; the equation is homogeneous. What invariant does integration reveal?"),
            ],
        ),
        item(
            "mp_8ePqqZXSMQs_5",
            r"What is the key takeaway from solving the harmonic oscillator four different ways?",
            r"Different valid methods applied to the same equation must agree.",
            [
                C(r"All the methods yield the same oscillatory solution", r"Yes. The approaches differ in technique but converge on the same sinusoidal motion."),
                W(r"Each method gives a different physical answer", r"Correct methods cannot disagree on the solution. What must be true of their results?"),
                W(r"Only one method actually works", r"All four are valid routes to the solution. What do they have in common in their output?"),
                W(r"The solution depends on which method you choose", r"The solution is a property of the equation, not the method. What is true across all four?"),
            ],
        ),
    ],
)

# === 11.6 video 2 ===========================================================
add_micro(
    "obXbCCWEKfY",
    'Unit 11, Module 11.6, video 2\n           "Why Oscillators are Key to Differential Equations"',
    [
        item(
            "mp_obXbCCWEKfY_1",
            r"Why does the harmonic oscillator appear so widely across physics and engineering?",
            r"Think about what most smooth systems look like very close to a stable equilibrium.",
            [
                C(r"It is the linear approximation of almost any system near a stable equilibrium", r"Yes. Near a stable equilibrium the restoring force is approximately linear, so the dynamics reduce to a harmonic oscillator."),
                W(r"It is the only equation that can be solved exactly", r"Many equations are solvable; that is not the reason. What makes the oscillator a universal approximation?"),
                W(r"It only applies to literal springs", r"Its reach extends far beyond springs. Why does it model so many systems near equilibrium?"),
                W(r"It requires no initial conditions", r"Like any second-order equation it needs two conditions. What property makes it broadly applicable?"),
            ],
        ),
        item(
            "mp_obXbCCWEKfY_2",
            r"Expanding a potential energy $U(x)$ about a stable minimum, the leading nonconstant term is quadratic. What dynamics does that quadratic term produce?",
            r"A quadratic potential gives a linear restoring force, since force is the negative derivative of $U$.",
            [
                C(r"Simple harmonic motion", r"Yes. A quadratic potential yields a linear restoring force, hence harmonic oscillation."),
                W(r"Exponential growth", r"A stable minimum gives a restoring, not a repelling, force. What motion does a linear restoring force produce?"),
                W(r"Constant velocity drift", r"A restoring force accelerates the system back, not at constant velocity. What oscillatory motion results?"),
                W(r"Purely random motion", r"The dynamics are deterministic near a minimum. What regular motion does a quadratic potential give?"),
            ],
        ),
        item(
            "mp_obXbCCWEKfY_3",
            r"Near a stable equilibrium, how does the restoring force behave as a function of small displacement?",
            r"This is the content of linearizing the force about the equilibrium point.",
            [
                C(r"Approximately linear in the displacement, like $-kx$", r"Yes. To leading order the restoring force is proportional to displacement, the Hooke's-law form."),
                W(r"Approximately constant", r"A constant force would not restore the system to equilibrium. How does the force scale with small $x$?"),
                W(r"Proportional to the square of the displacement", r"The leading restoring term is linear, not quadratic. What is the lowest-order dependence on $x$?"),
                W(r"Independent of displacement", r"A restoring force must depend on how far the system is displaced. What is its leading dependence?"),
            ],
        ),
        item(
            "mp_obXbCCWEKfY_4",
            r"Which of the following is an example of harmonic-oscillator behavior outside of mechanical springs?",
            r"Look for another system governed by $x'' + \omega_0^2 x = 0$ in some variable.",
            [
                C(r"Charge in an LC electrical circuit", r"Yes. An ideal LC circuit obeys the same oscillator equation, with charge playing the role of displacement."),
                W(r"Steady heat flow through a wall", r"Steady conduction is not oscillatory. Which listed system swings back and forth like an oscillator?"),
                W(r"Exponential radioactive decay", r"Decay is monotonic, not oscillatory. Which example shows oscillation governed by the same equation?"),
                W(r"A ball rolling down a constant slope", r"Constant acceleration is not oscillation. Which system has a linear restoring effect?"),
            ],
        ),
        item(
            "mp_obXbCCWEKfY_5",
            r"An ideal LC circuit satisfies $L q'' + \frac{1}{C} q = 0$. What is its oscillation angular frequency?",
            r"Match the equation to $q'' + \omega_0^2 q = 0$ after dividing by $L$.",
            [
                C(r"$\omega_0 = \frac{1}{\sqrt{LC}}$", r"Correct. Dividing by $L$ gives $\omega_0^2 = 1/(LC)$, so $\omega_0 = 1/\sqrt{LC}$."),
                W(r"$\omega_0 = \sqrt{LC}$", r"That is the reciprocal of the correct value. What is $\sqrt{1/(LC)}$?"),
                W(r"$\omega_0 = LC$", r"The frequency involves a square root of a reciprocal, not the product. What is $\sqrt{1/(LC)}$?"),
                W(r"$\omega_0 = \frac{1}{LC}$", r"That is $\omega_0^2$, missing the square root. What is $\sqrt{1/(LC)}$?"),
            ],
        ),
    ],
)

# ============================================================================
# UNIT 12 MICRO PRACTICE
# ============================================================================

# === 12.1 video 1 ===========================================================
add_micro(
    "j0wJBEZdwLs",
    'Unit 12, Module 12.1, video 1\n           "But what is a Laplace Transform?"',
    [
        item(
            "mp_j0wJBEZdwLs_1",
            r"The Laplace transform of $f(t)$ is defined by which integral?",
            r"It weights $f(t)$ by a decaying exponential and integrates over all positive time.",
            [
                C(r"$F(s) = \int_0^{\infty} e^{-st} f(t)\,dt$", r"Yes. The Laplace transform integrates $f(t)$ against the kernel $e^{-st}$ from $0$ to infinity."),
                W(r"$F(s) = \int_0^{\infty} e^{st} f(t)\,dt$", r"A positive exponent generally diverges. What sign does the kernel $e^{-st}$ carry?"),
                W(r"$F(s) = \int_{-\infty}^{\infty} e^{-st} f(t)\,dt$", r"The one-sided transform starts at $0$, not $-\infty$. What is the lower limit?"),
                W(r"$F(s) = \int_0^{\infty} e^{-st} f'(t)\,dt$", r"The definition transforms $f$ itself, not its derivative. What function sits in the integrand?"),
            ],
        ),
        item(
            "mp_j0wJBEZdwLs_2",
            r"The Laplace transform converts a function of $t$ into a function of which variable?",
            r"The output lives in a new domain indexed by the transform variable.",
            [
                C(r"$s$, the complex frequency variable", r"Yes. The transform maps a time function $f(t)$ into a function $F(s)$ of the variable $s$."),
                W(r"$t$, the same time variable", r"The whole point is to leave the time domain. What variable indexes the output?"),
                W(r"$x$, a spatial variable", r"No spatial variable is introduced. What variable does the transform produce?"),
                W(r"$n$, a discrete index", r"The Laplace transform is continuous, not indexed by integers. What continuous variable does it use?"),
            ],
        ),
        item(
            "mp_j0wJBEZdwLs_3",
            r"What kind of mathematical object is the Laplace transform?",
            r"It takes one function in and returns another function.",
            [
                C(r"An integral transform that maps functions to functions", r"Yes. It is an integral transform, sending a function of $t$ to a function of $s$."),
                W(r"A single number computed from $f$", r"The output is a whole function $F(s)$, not one number. What does the transform return?"),
                W(r"A derivative operator", r"It integrates rather than differentiates. What sort of operator maps $f(t)$ to $F(s)$?"),
                W(r"A change of units", r"It is far more than rescaling units. What operation produces $F(s)$ from $f(t)$?"),
            ],
        ),
        item(
            "mp_j0wJBEZdwLs_4",
            r"What is the central reason the Laplace transform is useful for differential equations?",
            r"Consider what it does to the operation of differentiation.",
            [
                C(r"It turns differentiation into multiplication by $s$, converting ODEs into algebra", r"Yes. Derivatives become powers of $s$, so a differential equation becomes an algebraic one."),
                W(r"It makes every function periodic", r"It does not impose periodicity. What does it do to the derivative operation?"),
                W(r"It eliminates the need for initial conditions", r"Initial conditions actually enter the transform of derivatives. What operational simplification does it provide?"),
                W(r"It converts integrals into derivatives", r"Integration becomes division by $s$, not differentiation. What happens to differentiation under the transform?"),
            ],
        ),
        item(
            "mp_j0wJBEZdwLs_5",
            r"Why does the kernel use a decaying exponential $e^{-st}$ rather than a growing one?",
            r"Think about whether the defining integral can converge.",
            [
                C(r"The decay helps the improper integral converge for a wide class of functions", r"Yes. The decaying factor tames growth in $f(t)$ so the integral to infinity can converge."),
                W(r"It makes the transform always zero", r"The transform is generally nonzero. What does the decay accomplish for the integral?"),
                W(r"It is an arbitrary choice with no effect", r"The sign of the exponent is essential. What would a growing exponential do to convergence?"),
                W(r"It removes the dependence on $s$", r"The output still depends on $s$. Why is a decaying kernel needed for the integral?"),
            ],
        ),
    ],
)

# === 12.1 video 2 ===========================================================
add_micro(
    "-j8PzkZ70Lg",
    'Unit 12, Module 12.1, video 2\n           "The Physics of Euler\'s Formula, Laplace Transform Prelude"',
    [
        item(
            "mp_-j8PzkZ70Lg_1",
            r"Euler's formula expresses $e^{i\theta}$ as which combination?",
            r"It links the complex exponential to the basic trigonometric functions.",
            [
                C(r"$\cos\theta + i\sin\theta$", r"Yes. Euler's formula is $e^{i\theta} = \cos\theta + i\sin\theta$."),
                W(r"$\cos\theta - i\sin\theta$", r"That is $e^{-i\theta}$, the conjugate. What sign does $e^{i\theta}$ carry on the sine term?"),
                W(r"$\sin\theta + i\cos\theta$", r"The real part is the cosine, not the sine. Which function is real in $e^{i\theta}$?"),
                W(r"$\cos\theta + \sin\theta$", r"The imaginary unit $i$ multiplies the sine. Where does $i$ appear in Euler's formula?"),
            ],
        ),
        item(
            "mp_-j8PzkZ70Lg_2",
            r"In the complex exponential $e^{st}$ with $s = \sigma + i\omega$, what does the imaginary part $\omega$ control?",
            r"Split $e^{st} = e^{\sigma t}e^{i\omega t}$ and recall what each factor does.",
            [
                C(r"The oscillation frequency", r"Yes. The factor $e^{i\omega t}$ oscillates, so $\omega$ sets the frequency."),
                W(r"The growth or decay rate", r"That is governed by the real part $\sigma$. What does the imaginary part drive?"),
                W(r"The amplitude", r"Amplitude is a separate constant multiplier. What does $\omega$ in $e^{i\omega t}$ control?"),
                W(r"The phase shift only", r"The imaginary part sets the rate of oscillation, not just a fixed phase. What does $\omega$ determine?"),
            ],
        ),
        item(
            "mp_-j8PzkZ70Lg_3",
            r"In $e^{st}$ with $s = \sigma + i\omega$, what does the real part $\sigma$ control?",
            r"Consider the factor $e^{\sigma t}$ on its own.",
            [
                C(r"The exponential growth (if positive) or decay (if negative)", r"Yes. The factor $e^{\sigma t}$ grows when $\sigma > 0$ and decays when $\sigma < 0$."),
                W(r"The oscillation frequency", r"Frequency comes from the imaginary part $\omega$. What does $\sigma$ govern in $e^{\sigma t}$?"),
                W(r"The period of oscillation", r"The period is tied to $\omega$, not $\sigma$. What does the real exponential factor do?"),
                W(r"Nothing; it is ignored", r"The real part is essential to convergence and growth. What behavior does $e^{\sigma t}$ produce?"),
            ],
        ),
        item(
            "mp_-j8PzkZ70Lg_4",
            r"Why is the complex exponential $e^{st}$ a natural building block for linear differential equations?",
            r"Think about what differentiating $e^{st}$ returns.",
            [
                C(r"Differentiating it just multiplies by $s$, so it is an eigenfunction of differentiation", r"Yes. Since $\frac{d}{dt}e^{st} = s e^{st}$, the exponential reproduces itself under differentiation."),
                W(r"It is always equal to one", r"Its value varies with $t$. What special property does it have under differentiation?"),
                W(r"It cannot be differentiated", r"It is smooth and easily differentiated. What does differentiating it produce?"),
                W(r"Its derivative is zero", r"Its derivative is $s e^{st}$, not zero. What does differentiation do to it?"),
            ],
        ),
        item(
            "mp_-j8PzkZ70Lg_5",
            r"How does the Laplace kernel $e^{-st}$ relate to the complex exponentials of Euler's formula?",
            r"Allow $s$ to be complex and split the exponential into real and imaginary parts.",
            [
                C(r"With complex $s$, the kernel combines a decaying factor and an oscillating factor", r"Yes. Writing $s = \sigma + i\omega$ splits $e^{-st}$ into decay $e^{-\sigma t}$ times oscillation $e^{-i\omega t}$."),
                W(r"The kernel is purely real for all $s$", r"For complex $s$ the kernel has an oscillating part. What two behaviors does it combine?"),
                W(r"The kernel never oscillates", r"The imaginary part of $s$ introduces oscillation. What does the complex kernel encode?"),
                W(r"Euler's formula does not apply to $e^{-st}$", r"Euler's formula applies to any complex exponent. What does it reveal about $e^{-st}$?"),
            ],
        ),
    ],
)

# === 12.1 video 3 ===========================================================
add_micro(
    "n2y7n6jw5d0",
    'Unit 12, Module 12.1, video 3\n           "What does the Laplace Transform really tell us? A visual explanation"',
    [
        item(
            "mp_n2y7n6jw5d0_1",
            r"Conceptually, the Laplace transform decomposes a signal into a combination of which building blocks?",
            r"The kernel is an exponential, possibly complex.",
            [
                C(r"Complex exponentials $e^{st}$", r"Yes. The transform expresses how strongly each complex exponential is present in the signal."),
                W(r"Polynomials in $t$", r"The kernel is exponential, not polynomial. What building blocks does $e^{st}$ represent?"),
                W(r"Step functions", r"Steps are inputs you can transform, not the decomposition basis. What exponential blocks underlie the transform?"),
                W(r"Random noise", r"The decomposition is into structured exponentials. What are those building blocks?"),
            ],
        ),
        item(
            "mp_n2y7n6jw5d0_2",
            r"In the $s$-domain, what do the pole locations of a system's transform tell you?",
            r"Poles encode the natural exponential behaviors of the system.",
            [
                C(r"The system's natural frequencies and growth or decay rates", r"Yes. Pole positions reveal how the system naturally oscillates and whether it grows or decays."),
                W(r"The exact initial conditions", r"Initial conditions affect numerators, not pole locations. What natural behavior do poles encode?"),
                W(r"The total energy of the input", r"Energy is not read directly from poles. What dynamic behavior do poles reveal?"),
                W(r"The units of measurement", r"Poles are not about units. What do their positions tell you about the dynamics?"),
            ],
        ),
        item(
            "mp_n2y7n6jw5d0_3",
            r"The set of $s$ values for which the defining integral converges is called what?",
            r"It is the region in the complex $s$-plane where the transform exists.",
            [
                C(r"The region of convergence", r"Yes. The transform is defined on the region of convergence in the $s$-plane."),
                W(r"The phase margin", r"That is a control-theory stability measure, not where the integral converges. What is the convergence set called?"),
                W(r"The Nyquist band", r"That term is unrelated to the convergence set. What names the region where the integral exists?"),
                W(r"The null space", r"That is a linear-algebra concept. What is the region where the Laplace integral converges called?"),
            ],
        ),
        item(
            "mp_n2y7n6jw5d0_4",
            r"Why is the $s$-domain view useful for understanding system behavior?",
            r"Complicated time-domain operations often become simple in the $s$-domain.",
            [
                C(r"It turns differential equations and convolutions into algebra", r"Yes. In the $s$-domain, calculus operations become algebraic, exposing system structure clearly."),
                W(r"It removes all information about the signal", r"The transform is invertible, so no information is lost. What does the $s$-domain simplify?"),
                W(r"It only works for constant signals", r"It applies broadly, not just to constants. What operations does it simplify?"),
                W(r"It makes every system unstable", r"Stability is read off, not imposed. What computational advantage does the $s$-domain give?"),
            ],
        ),
        item(
            "mp_n2y7n6jw5d0_5",
            r"In which fields is the Laplace transform most heavily applied?",
            r"Think of disciplines built around dynamic systems and their responses.",
            [
                C(r"Control systems and circuit analysis", r"Yes. Engineers use it constantly to analyze control systems and electrical circuits."),
                W(r"Static geometry", r"Geometry is not its domain. Which dynamic-systems fields rely on it?"),
                W(r"Counting discrete arrangements", r"Combinatorics is unrelated. Which engineering areas use the Laplace transform?"),
                W(r"Pure number theory", r"Number theory is not a primary application. What applied fields use it most?"),
            ],
        ),
    ],
)

# === 12.2 video 1 ===========================================================
add_micro(
    "KqokoYr_h1A",
    'Unit 12, Module 12.2, video 1\n           "Intro to the Laplace Transform and Three Examples"',
    [
        item(
            "mp_KqokoYr_h1A_1",
            r"Compute the Laplace transform of $f(t) = 1$.",
            r"Evaluate $\int_0^{\infty} e^{-st}\,dt$ for $s > 0$.",
            [
                C(r"$\frac{1}{s}$", r"Correct. $\int_0^{\infty} e^{-st}\,dt = 1/s$ for $s > 0$."),
                W(r"$1$", r"The integral of the kernel is not just one. What is $\int_0^{\infty} e^{-st}\,dt$?"),
                W(r"$s$", r"The transform of a constant is a reciprocal, not $s$ itself. What is $1/s$ derived from?"),
                W(r"$\frac{1}{s^2}$", r"That is the transform of $t$, not of the constant $1$. What does integrating $e^{-st}$ once give?"),
            ],
        ),
        item(
            "mp_KqokoYr_h1A_2",
            r"Compute the Laplace transform of $f(t) = e^{at}$.",
            r"The integrand becomes $e^{-(s-a)t}$; integrate for $s > a$.",
            [
                C(r"$\frac{1}{s - a}$", r"Correct. $\int_0^{\infty} e^{-(s-a)t}\,dt = 1/(s-a)$ for $s > a$."),
                W(r"$\frac{1}{s + a}$", r"Check the sign: the exponent combines to $-(s-a)t$. What denominator results?"),
                W(r"$\frac{1}{s}$", r"That is the transform of the constant $1$. How does the exponent $at$ shift the denominator?"),
                W(r"$\frac{a}{s}$", r"The transform of $e^{at}$ is not a simple multiple of $1/s$. What is $\int_0^{\infty} e^{-(s-a)t}\,dt$?"),
            ],
        ),
        item(
            "mp_KqokoYr_h1A_3",
            r"The transform of $e^{at}$ converges only for which values of $s$?",
            r"The exponent $-(s-a)t$ must be negative as $t \to \infty$.",
            [
                C(r"$s > a$", r"Yes. Convergence requires $s - a > 0$, that is $s > a$."),
                W(r"$s > 0$", r"The threshold shifts with $a$. For what $s$ is the exponent $-(s-a)t$ decaying?"),
                W(r"$s < a$", r"That makes the exponent grow and the integral diverge. Which inequality gives decay?"),
                W(r"all real $s$", r"Convergence fails when $s \le a$. What condition on $s$ keeps the integral finite?"),
            ],
        ),
        item(
            "mp_KqokoYr_h1A_4",
            r"Compute the Laplace transform of $f(t) = t$.",
            r"Use integration by parts, or the rule $\mathcal{L}\{t^n\} = n!/s^{n+1}$ with $n = 1$.",
            [
                C(r"$\frac{1}{s^2}$", r"Correct. With $n = 1$, $\mathcal{L}\{t\} = 1!/s^{2} = 1/s^2$."),
                W(r"$\frac{1}{s}$", r"That is the transform of the constant $1$. What extra power of $s$ does the factor of $t$ add?"),
                W(r"$\frac{2}{s^3}$", r"That is the transform of $t^2$. What is $\mathcal{L}\{t^n\}$ for $n = 1$?"),
                W(r"$s^2$", r"The transform is a reciprocal power, not $s^2$. What is $1!/s^{1+1}$?"),
            ],
        ),
        item(
            "mp_KqokoYr_h1A_5",
            r"The Laplace transform is computed from which kind of integral?",
            r"The upper limit extends to infinity, making it improper.",
            [
                C(r"An improper integral, a limit of $\int_0^{R}$ as $R \to \infty$", r"Yes. The transform is an improper integral evaluated as the upper limit goes to infinity."),
                W(r"A finite definite integral over $[0,1]$", r"The upper limit is infinity, not $1$. What kind of integral has an infinite limit?"),
                W(r"A contour integral in the complex plane", r"The defining integral is along the real time axis. What makes it improper?"),
                W(r"A discrete sum", r"The transform integrates rather than sums. What sort of integral defines it?"),
            ],
        ),
    ],
)

# === 12.2 video 2 ===========================================================
add_micro(
    "hfKycVR4kSw",
    'Unit 12, Module 12.2, video 2\n           "The Laplace Transform, Basic Properties, Definitions and Derivatives"',
    [
        item(
            "mp_hfKycVR4kSw_1",
            r"What is the general formula for the Laplace transform of $t^n$?",
            r"Each extra power of $t$ raises the power of $s$ in the denominator and brings a factorial.",
            [
                C(r"$\frac{n!}{s^{n+1}}$", r"Yes. $\mathcal{L}\{t^n\} = n!/s^{n+1}$ for nonnegative integers $n$."),
                W(r"$\frac{n}{s^n}$", r"The numerator is a factorial and the power is $n+1$. What is the correct form?"),
                W(r"$\frac{n!}{s^n}$", r"The denominator power is $n+1$, not $n$. What exponent appears on $s$?"),
                W(r"$\frac{1}{s^{n+1}}$", r"The numerator should be $n!$, not $1$. What factor does $t^n$ contribute?"),
            ],
        ),
        item(
            "mp_hfKycVR4kSw_2",
            r"Compute the Laplace transform of $t^3$.",
            r"Use $\mathcal{L}\{t^n\} = n!/s^{n+1}$ with $n = 3$.",
            [
                C(r"$\frac{6}{s^4}$", r"Correct. $3! = 6$ and $s^{3+1} = s^4$, so $\mathcal{L}\{t^3\} = 6/s^4$."),
                W(r"$\frac{3}{s^4}$", r"The numerator is $3! = 6$, not $3$. What is $3$ factorial?"),
                W(r"$\frac{6}{s^3}$", r"The denominator power is $n+1 = 4$, not $3$. What exponent on $s$ is correct?"),
                W(r"$\frac{1}{s^4}$", r"The numerator must include the factorial $3!$. What is $3!$?"),
            ],
        ),
        item(
            "mp_hfKycVR4kSw_3",
            r"What is the Laplace transform of $\sin(bt)$?",
            r"The sine transform has the frequency in the numerator and $s^2 + b^2$ below.",
            [
                C(r"$\frac{b}{s^2 + b^2}$", r"Yes. $\mathcal{L}\{\sin bt\} = b/(s^2 + b^2)$."),
                W(r"$\frac{s}{s^2 + b^2}$", r"That is the transform of $\cos(bt)$. What sits in the numerator for sine?"),
                W(r"$\frac{b}{s^2 - b^2}$", r"The denominator is a sum $s^2 + b^2$, not a difference. What sign joins the terms?"),
                W(r"$\frac{1}{s^2 + b^2}$", r"The numerator is the frequency $b$, not $1$. What belongs on top for sine?"),
            ],
        ),
        item(
            "mp_hfKycVR4kSw_4",
            r"What is the Laplace transform of $\cos(bt)$?",
            r"The cosine transform has $s$ in the numerator.",
            [
                C(r"$\frac{s}{s^2 + b^2}$", r"Yes. $\mathcal{L}\{\cos bt\} = s/(s^2 + b^2)$."),
                W(r"$\frac{b}{s^2 + b^2}$", r"That is the transform of $\sin(bt)$. What sits in the numerator for cosine?"),
                W(r"$\frac{s}{s^2 - b^2}$", r"The denominator should be $s^2 + b^2$. What sign joins the two terms?"),
                W(r"$\frac{s^2}{s^2 + b^2}$", r"The numerator is $s$, not $s^2$. What is the correct numerator for cosine?"),
            ],
        ),
        item(
            "mp_hfKycVR4kSw_5",
            r"A function $f$ has a Laplace transform if it is piecewise continuous and of exponential order. What does exponential order mean?",
            r"It bounds how fast $f$ may grow as $t \to \infty$.",
            [
                C(r"$|f(t)| \le M e^{ct}$ for some constants $M$ and $c$ and large $t$", r"Yes. Exponential order means the function grows no faster than some exponential, which the kernel can overcome."),
                W(r"$f(t)$ is bounded by a constant for all $t$", r"Exponential order permits growth, just not faster than an exponential. What bound is allowed?"),
                W(r"$f(t)$ is periodic", r"Periodicity is not required. What growth bound defines exponential order?"),
                W(r"$f(t) \to 0$ as $t \to \infty$", r"Decay is not required, only controlled growth. What exponential bound is the condition?"),
            ],
        ),
    ],
)

# === 12.3 video 1 ===========================================================
add_micro(
    "zModDQ-ST30",
    'Unit 12, Module 12.3, video 1\n           "3 Properties of Laplace Transforms: Linearity, Existence, and Inverses"',
    [
        item(
            "mp_zModDQ-ST30_1",
            r"The linearity of the Laplace transform states that $\mathcal{L}\{a f(t) + b g(t)\}$ equals what?",
            r"A linear operator distributes over sums and pulls out constants.",
            [
                C(r"$a\,\mathcal{L}\{f\} + b\,\mathcal{L}\{g\}$", r"Yes. The transform distributes across the sum and factors out the constants $a$ and $b$."),
                W(r"$\mathcal{L}\{f\}\cdot\mathcal{L}\{g\}$", r"Linearity gives a sum, not a product. How does the transform act on a sum of scaled functions?"),
                W(r"$ab\,\mathcal{L}\{f + g\}$", r"The constants attach to each term separately. Where do $a$ and $b$ go?"),
                W(r"$\mathcal{L}\{f\} + \mathcal{L}\{g\}$", r"The constants $a$ and $b$ must be kept. What multiplies each transform?"),
            ],
        ),
        item(
            "mp_zModDQ-ST30_2",
            r"Which conditions guarantee that the Laplace transform of $f$ exists?",
            r"There is a continuity condition and a growth condition.",
            [
                C(r"$f$ is piecewise continuous and of exponential order", r"Yes. Piecewise continuity plus exponential order is the standard sufficient condition for existence."),
                W(r"$f$ is differentiable everywhere", r"Differentiability is stronger than needed; jumps are allowed. What two conditions suffice?"),
                W(r"$f$ is bounded for all $t$", r"Exponential growth is permitted, so boundedness is not required. What is the actual condition?"),
                W(r"$f$ is a polynomial", r"Many non-polynomials have transforms. What general conditions guarantee existence?"),
            ],
        ),
        item(
            "mp_zModDQ-ST30_3",
            r"What does it mean that the Laplace transform has a well-defined inverse?",
            r"Recovering $f$ from $F$ requires the correspondence to be unique.",
            [
                C(r"Each transform $F(s)$ corresponds to essentially one time function $f(t)$", r"Yes. The transform is essentially one-to-one, so $f$ can be recovered uniquely from $F$."),
                W(r"Every $F(s)$ comes from infinitely many different $f(t)$", r"That would make inversion impossible. What uniqueness does an inverse require?"),
                W(r"The inverse is the same as the forward transform", r"Forward and inverse are different operations. What property makes the inverse well defined?"),
                W(r"Only constant functions can be inverted", r"Inversion applies broadly. What correspondence between $F$ and $f$ makes it work?"),
            ],
        ),
        item(
            "mp_zModDQ-ST30_4",
            r"Using linearity, compute $\mathcal{L}\{3 + 2t\}$.",
            r"Transform each term: $\mathcal{L}\{1\} = 1/s$ and $\mathcal{L}\{t\} = 1/s^2$.",
            [
                C(r"$\frac{3}{s} + \frac{2}{s^2}$", r"Correct. Linearity gives $3 \cdot \frac{1}{s} + 2 \cdot \frac{1}{s^2}$."),
                W(r"$\frac{5}{s}$", r"The two terms have different powers of $s$ and cannot merge that way. What is each transform separately?"),
                W(r"$\frac{3}{s} + \frac{2}{s}$", r"The transform of $t$ is $1/s^2$, not $1/s$. What power of $s$ does the $t$ term give?"),
                W(r"$\frac{6}{s^2}$", r"You cannot multiply the constants together. How does linearity treat each term?"),
            ],
        ),
        item(
            "mp_zModDQ-ST30_5",
            r"Find the inverse Laplace transform of $\frac{1}{s - 2}$.",
            r"Recall $\mathcal{L}\{e^{at}\} = 1/(s - a)$ and read off $a$.",
            [
                C(r"$e^{2t}$", r"Correct. Since $\mathcal{L}\{e^{at}\} = 1/(s-a)$, here $a = 2$ gives $e^{2t}$."),
                W(r"$e^{-2t}$", r"The denominator $s - 2$ corresponds to $a = +2$. What sign does the exponent carry?"),
                W(r"$2e^{t}$", r"The $2$ sits in the denominator as the shift, not as a coefficient. What function has transform $1/(s-2)$?"),
                W(r"$\frac{1}{2}e^{2t}$", r"No extra factor is needed; $1/(s-2)$ inverts directly. What is $\mathcal{L}^{-1}\{1/(s-a)\}$?"),
            ],
        ),
    ],
)

# === 12.3 video 2 ===========================================================
add_micro(
    "D7CP4WTQpBo",
    'Unit 12, Module 12.3, video 2\n           "Laplace Transform is a Linear Operator, Proof"',
    [
        item(
            "mp_D7CP4WTQpBo_1",
            r"The proof that the Laplace transform is linear rests on which underlying property?",
            r"The transform is an integral, and integrals have a known structural property.",
            [
                C(r"The linearity of integration", r"Yes. Because integration is linear, the transform inherits linearity directly."),
                W(r"The product rule for derivatives", r"The transform is built on an integral, not the product rule. What property of integration drives the proof?"),
                W(r"The chain rule", r"The chain rule is not what is used. What linear property of the defining integral is invoked?"),
                W(r"The mean value theorem", r"That theorem is not the basis here. What feature of integrals gives linearity?"),
            ],
        ),
        item(
            "mp_D7CP4WTQpBo_2",
            r"For a constant $c$, what does $\mathcal{L}\{c f(t)\}$ equal?",
            r"A constant multiplier can be pulled outside the integral.",
            [
                C(r"$c\,\mathcal{L}\{f\}$", r"Yes. The constant factors straight out of the transform."),
                W(r"$\mathcal{L}\{f\}$", r"The constant $c$ does not vanish. Where does it go?"),
                W(r"$c^2\,\mathcal{L}\{f\}$", r"The constant appears to the first power, not squared. What is the correct factor?"),
                W(r"$\frac{1}{c}\,\mathcal{L}\{f\}$", r"The constant comes out as itself, not its reciprocal. What multiplies the transform?"),
            ],
        ),
        item(
            "mp_D7CP4WTQpBo_3",
            r"Use linearity to compute $\mathcal{L}\{4\sin 3t\}$.",
            r"Pull out the $4$ and use $\mathcal{L}\{\sin bt\} = b/(s^2 + b^2)$ with $b = 3$.",
            [
                C(r"$\frac{12}{s^2 + 9}$", r"Correct. $4 \cdot \frac{3}{s^2 + 9} = \frac{12}{s^2 + 9}$."),
                W(r"$\frac{4}{s^2 + 9}$", r"The numerator from $\sin 3t$ is $3$, and the $4$ multiplies it. What is $4 \cdot 3$?"),
                W(r"$\frac{12}{s^2 + 3}$", r"The denominator is $s^2 + b^2 = s^2 + 9$. What is $3^2$?"),
                W(r"$\frac{12}{s^2 - 9}$", r"The sine transform has a plus sign in the denominator. What is $s^2 + 9$?"),
            ],
        ),
        item(
            "mp_D7CP4WTQpBo_4",
            r"Linearity lets you transform a sum term by term. Which expression is handled by splitting into separate transforms?",
            r"Look for a genuine sum of functions rather than a product or composition.",
            [
                C(r"$\mathcal{L}\{2e^{t} + 5t\}$", r"Yes. A sum of scaled functions splits into $2\mathcal{L}\{e^t\} + 5\mathcal{L}\{t\}$ by linearity."),
                W(r"$\mathcal{L}\{e^{t}\cdot t\}$", r"A product of functions does not split by linearity. Which expression is a sum?"),
                W(r"$\mathcal{L}\{\sin(t^2)\}$", r"A composition like this is not a linear combination. Which option is a simple sum?"),
                W(r"$\mathcal{L}\{e^{t/ t}\}$", r"That is not a sum of standard terms. Which expression is an additive combination?"),
            ],
        ),
        item(
            "mp_D7CP4WTQpBo_5",
            r"Why does linearity fail for a nonlinear operation such as squaring, $f \mapsto f^2$?",
            r"Test whether $(f + g)^2$ equals $f^2 + g^2$.",
            [
                C(r"Because $(f+g)^2 \neq f^2 + g^2$ in general, due to the cross term", r"Yes. Squaring introduces a cross term $2fg$, so it does not distribute over sums."),
                W(r"Because squaring is undefined for functions", r"Squaring a function is perfectly defined. Why does it break additivity?"),
                W(r"Because constants cannot be squared", r"Constants square fine; the issue is additivity. What term spoils $(f+g)^2$?"),
                W(r"Because integration is nonlinear", r"Integration is linear; squaring is the nonlinear step. What cross term appears in $(f+g)^2$?"),
            ],
        ),
    ],
)

# === 12.4 video 1 ===========================================================
add_micro(
    "zfhyeXbb0d4",
    'Unit 12, Module 12.4, video 1\n           "The Laplace Transform of Derivatives and Integrals"',
    [
        item(
            "mp_zfhyeXbb0d4_1",
            r"With $Y(s) = \mathcal{L}\{y(t)\}$, what is $\mathcal{L}\{y'(t)\}$?",
            r"The derivative rule multiplies by $s$ and subtracts the initial value.",
            [
                C(r"$sY(s) - y(0)$", r"Yes. The first-derivative rule is $\mathcal{L}\{y'\} = sY - y(0)$."),
                W(r"$sY(s)$", r"An initial-value term is missing. What is subtracted from $sY$?"),
                W(r"$sY(s) + y(0)$", r"The initial value is subtracted, not added. What sign does $y(0)$ carry?"),
                W(r"$Y(s)/s$", r"Dividing by $s$ corresponds to integration, not differentiation. What does the derivative rule give?"),
            ],
        ),
        item(
            "mp_zfhyeXbb0d4_2",
            r"What is the Laplace transform $\mathcal{L}\{y''(t)\}$ in terms of $Y(s)$?",
            r"Apply the derivative rule twice, picking up both $y(0)$ and $y'(0)$.",
            [
                C(r"$s^2 Y(s) - s\,y(0) - y'(0)$", r"Yes. The second-derivative rule brings two powers of $s$ and the two initial values."),
                W(r"$s^2 Y(s) - y'(0)$", r"The term $s\,y(0)$ is also present. What two initial-value terms appear?"),
                W(r"$s^2 Y(s) + s\,y(0) + y'(0)$", r"Both initial terms are subtracted, not added. What signs are correct?"),
                W(r"$s^2 Y(s)$", r"Two initial-condition terms are missing. What does applying the first-derivative rule twice produce?"),
            ],
        ),
        item(
            "mp_zfhyeXbb0d4_3",
            r"What is the Laplace transform of $\int_0^t f(\tau)\,d\tau$ in terms of $F(s)$?",
            r"Integration in time corresponds to division by $s$.",
            [
                C(r"$\frac{F(s)}{s}$", r"Yes. Integrating from $0$ to $t$ divides the transform by $s$."),
                W(r"$s\,F(s)$", r"Multiplying by $s$ corresponds to differentiation, not integration. What operation matches integration?"),
                W(r"$F(s) - f(0)$", r"That resembles a derivative rule, not the integral rule. What does dividing by $s$ represent?"),
                W(r"$\frac{F(s)}{s^2}$", r"A single integration divides by $s$ once, not twice. What is the correct factor?"),
            ],
        ),
        item(
            "mp_zfhyeXbb0d4_4",
            r"Why does the derivative theorem make the Laplace transform powerful for solving ODEs?",
            r"Consider what happens to a differential equation after transforming every derivative.",
            [
                C(r"It replaces derivatives with algebra in $s$, turning the ODE into an algebraic equation for $Y$", r"Yes. Each derivative becomes a power of $s$, so the differential equation becomes algebraic."),
                W(r"It removes the solution's dependence on $t$ permanently", r"You invert back to $t$ at the end. What does the theorem do to the derivatives meanwhile?"),
                W(r"It makes the equation nonlinear", r"It preserves linearity. What simplification does it bring to the derivatives?"),
                W(r"It eliminates the forcing function", r"Forcing is transformed too, not eliminated. What happens to the derivative terms?"),
            ],
        ),
        item(
            "mp_zfhyeXbb0d4_5",
            r"If $y(0) = 2$, what is $\mathcal{L}\{y'(t)\}$ in terms of $Y(s)$?",
            r"Substitute $y(0) = 2$ into $sY - y(0)$.",
            [
                C(r"$sY(s) - 2$", r"Correct. The rule $sY - y(0)$ becomes $sY - 2$."),
                W(r"$sY(s) + 2$", r"The initial value is subtracted. What sign precedes the $2$?"),
                W(r"$2sY(s)$", r"The initial value is subtracted as a separate term, not multiplied in. What is $sY - y(0)$?"),
                W(r"$sY(s) - 2s$", r"The subtracted term is $y(0) = 2$, with no extra factor of $s$. What is the correct expression?"),
            ],
        ),
    ],
)

# === 12.4 video 2 ===========================================================
add_micro(
    "F21roAB7Zy0",
    'Unit 12, Module 12.4, video 2\n           "Laplace Transform: The Derivative Theorem and One Example"',
    [
        item(
            "mp_F21roAB7Zy0_1",
            r"The derivative theorem $\mathcal{L}\{y''\} = s^2 Y - s\,y(0) - y'(0)$ requires which pieces of data?",
            r"Look at which initial values appear in the formula.",
            [
                C(r"The initial position $y(0)$ and initial velocity $y'(0)$", r"Yes. Both initial conditions enter directly through the transform of the second derivative."),
                W(r"Only $y(0)$", r"The formula also contains $y'(0)$. Which second initial value is needed?"),
                W(r"The value $y(\infty)$", r"The theorem uses values at $t = 0$, not at infinity. Which two initial values appear?"),
                W(r"No initial data at all", r"Both $y(0)$ and $y'(0)$ appear explicitly. What initial data does the formula require?"),
            ],
        ),
        item(
            "mp_F21roAB7Zy0_2",
            r"For $y(0) = 1$ and $y'(0) = 0$, what is $\mathcal{L}\{y''\}$ in terms of $Y(s)$?",
            r"Substitute the values into $s^2 Y - s\,y(0) - y'(0)$.",
            [
                C(r"$s^2 Y(s) - s$", r"Correct. With $y(0) = 1$ and $y'(0) = 0$, the formula becomes $s^2 Y - s$."),
                W(r"$s^2 Y(s) - 1$", r"The $y(0)$ term is multiplied by $s$, giving $s \cdot 1 = s$. What term results?"),
                W(r"$s^2 Y(s) - s - 1$", r"Here $y'(0) = 0$, so the last term vanishes. What remains?"),
                W(r"$s^2 Y(s)$", r"The term $s\,y(0) = s$ does not vanish since $y(0) = 1$. What is subtracted?"),
            ],
        ),
        item(
            "mp_F21roAB7Zy0_3",
            r"A major convenience of the derivative theorem is how it handles initial conditions. What does it do with them?",
            r"Compare this to classical methods, where constants are fixed only at the end.",
            [
                C(r"It builds the initial conditions into the algebra from the start", r"Yes. The initial values appear immediately in the transformed equation, not at a final step."),
                W(r"It postpones them until after solving", r"They enter at the transform step, not afterward. When do the conditions appear?"),
                W(r"It discards them entirely", r"The conditions are essential and retained. How does the theorem incorporate them?"),
                W(r"It requires guessing them", r"They are given data, not guessed. How are they used in the transform?"),
            ],
        ),
        item(
            "mp_F21roAB7Zy0_4",
            r"After transforming an ODE with the derivative theorem, what is the next step toward the solution?",
            r"You now have an algebraic equation in $Y(s)$.",
            [
                C(r"Solve algebraically for $Y(s)$, then invert to get $y(t)$", r"Yes. Isolate $Y(s)$, then apply the inverse transform to recover $y(t)$."),
                W(r"Differentiate $Y(s)$ with respect to $s$", r"Differentiating $Y$ is not the route to the solution. What do you solve for first?"),
                W(r"Integrate the original equation in $t$", r"You stay in the $s$-domain to solve. What algebraic step comes next?"),
                W(r"Apply the derivative theorem again", r"One application suffices to set up the algebra. What do you do with $Y(s)$ now?"),
            ],
        ),
        item(
            "mp_F21roAB7Zy0_5",
            r"Compared with classical methods, what does the Laplace approach let you avoid for nonhomogeneous problems?",
            r"Think about the usual two-part construction of a solution with arbitrary constants.",
            [
                C(r"Separately finding a complementary solution and fixing constants from conditions at the end", r"Yes. The transform produces the full solution with initial conditions already included, in one process."),
                W(r"Using any algebra at all", r"The method is built on algebra in $s$. What multi-step classical procedure does it streamline?"),
                W(r"Computing any transforms", r"Transforms are central to the method, not avoided. What classical bookkeeping does it remove?"),
                W(r"Knowing the forcing function", r"The forcing must still be transformed. What end-step constant fitting does it bypass?"),
            ],
        ),
    ],
)

# === 12.5 video 1 ===========================================================
add_micro(
    "yz-_EKIzz80",
    'Unit 12, Module 12.5, video 1\n           "Inverse Laplace Transform by Partial Fraction Decomposition"',
    [
        item(
            "mp_yz-_EKIzz80_1",
            r"Why are partial fractions used when inverting a rational function $F(s)$?",
            r"Each simple piece should match an entry in the transform table.",
            [
                C(r"They break $F(s)$ into simple terms whose inverse transforms are known", r"Yes. Decomposing into simple fractions lets you invert each piece from the table."),
                W(r"They multiply the fractions together", r"Decomposition splits into a sum, it does not multiply. What is the goal of the split?"),
                W(r"They eliminate the variable $s$", r"The variable $s$ remains until inversion. What do partial fractions accomplish?"),
                W(r"They convert $F(s)$ into a polynomial", r"The result is a sum of simple fractions, not a polynomial. Why split $F(s)$ up?"),
            ],
        ),
        item(
            "mp_yz-_EKIzz80_2",
            r"Find $\mathcal{L}^{-1}\!\left\{\frac{1}{s^2 + 4}\right\}$.",
            r"Match to $\mathcal{L}\{\sin bt\} = b/(s^2 + b^2)$ with $b = 2$, adjusting the constant.",
            [
                C(r"$\frac{1}{2}\sin 2t$", r"Correct. Since $\mathcal{L}\{\sin 2t\} = 2/(s^2+4)$, the inverse of $1/(s^2+4)$ is $\tfrac{1}{2}\sin 2t$."),
                W(r"$\sin 2t$", r"The table form has a $2$ in the numerator, so a factor of $1/2$ is needed. What constant corrects it?"),
                W(r"$\cos 2t$", r"Cosine corresponds to an $s$ in the numerator. What function matches a constant numerator?"),
                W(r"$\frac{1}{2}\sin 4t$", r"The frequency is $b = \sqrt{4} = 2$, not $4$. What frequency does $s^2 + 4$ give?"),
            ],
        ),
        item(
            "mp_yz-_EKIzz80_3",
            r"Find $\mathcal{L}^{-1}\!\left\{\frac{s}{s^2 + 9}\right\}$.",
            r"An $s$ in the numerator over $s^2 + b^2$ matches a cosine.",
            [
                C(r"$\cos 3t$", r"Correct. With $b = 3$, $s/(s^2 + 9)$ inverts to $\cos 3t$."),
                W(r"$\sin 3t$", r"Sine corresponds to a constant numerator, not an $s$. What does an $s$ on top give?"),
                W(r"$3\cos 3t$", r"No extra factor is needed; $s/(s^2+9)$ inverts directly. What is $\mathcal{L}^{-1}\{s/(s^2+b^2)\}$?"),
                W(r"$\cos 9t$", r"The frequency is $b = \sqrt{9} = 3$, not $9$. What frequency does $s^2 + 9$ give?"),
            ],
        ),
        item(
            "mp_yz-_EKIzz80_4",
            r"Decompose $\frac{1}{(s-1)(s-2)}$ into partial fractions.",
            r"Write $\frac{A}{s-1} + \frac{B}{s-2}$ and solve for $A$ and $B$ by covering up.",
            [
                C(r"$\frac{-1}{s-1} + \frac{1}{s-2}$", r"Correct. The cover-up method gives $A = -1$ at $s = 1$ and $B = 1$ at $s = 2$."),
                W(r"$\frac{1}{s-1} + \frac{1}{s-2}$", r"Check the sign of $A$. Evaluating at $s = 1$ gives $1/(1-2) = -1$. What is $A$?"),
                W(r"$\frac{1}{s-1} - \frac{1}{s-2}$", r"The signs are reversed. Cover up to find $A$ at $s = 1$ and $B$ at $s = 2$ correctly."),
                W(r"$\frac{-1}{s-1} - \frac{1}{s-2}$", r"The coefficient $B$ at $s = 2$ is $1/(2-1) = +1$. What sign should $B$ have?"),
            ],
        ),
        item(
            "mp_yz-_EKIzz80_5",
            r"After decomposing into partial fractions, what is the final step to recover $f(t)$?",
            r"Each simple fraction matches a known time function.",
            [
                C(r"Invert each simple fraction using the transform table", r"Yes. Apply the inverse transform term by term using standard table entries."),
                W(r"Multiply the fractions back together", r"Recombining undoes the decomposition. What do you do with each simple term?"),
                W(r"Differentiate the result with respect to $s$", r"No differentiation is needed. How do you turn each fraction back into a time function?"),
                W(r"Set $s = 0$", r"Evaluating at a point does not invert the transform. What table operation recovers $f(t)$?"),
            ],
        ),
    ],
)

# === 12.5 video 2 ===========================================================
add_micro(
    "c6YnYr8KsSo",
    'Unit 12, Module 12.5, video 2\n           "Inverse Laplace Transform Example using Partial Fractions"',
    [
        item(
            "mp_c6YnYr8KsSo_1",
            r"Find $\mathcal{L}^{-1}\!\left\{\frac{1}{s(s-2)}\right\}$ using partial fractions.",
            r"Decompose as $\frac{A}{s} + \frac{B}{s-2}$; cover-up gives $A = -1/2$ and $B = 1/2$.",
            [
                C(r"$-\frac{1}{2} + \frac{1}{2}e^{2t}$", r"Correct. The decomposition $-\tfrac{1}{2}\cdot\tfrac{1}{s} + \tfrac{1}{2}\cdot\tfrac{1}{s-2}$ inverts term by term."),
                W(r"$\frac{1}{2} + \frac{1}{2}e^{2t}$", r"Check the sign of the constant term. At $s = 0$, $A = 1/(0-2) = -1/2$. What is the constant?"),
                W(r"$1 - e^{2t}$", r"The coefficients are $\pm 1/2$, not $\pm 1$. What does the cover-up method give for $A$ and $B$?"),
                W(r"$-\frac{1}{2}e^{2t} + \frac{1}{2}$", r"The exponential pairs with the $1/(s-2)$ term, whose coefficient is $+1/2$. Which term is constant and which is exponential?"),
            ],
        ),
        item(
            "mp_c6YnYr8KsSo_2",
            r"Find $\mathcal{L}^{-1}\!\left\{\frac{1}{(s-1)^2}\right\}$.",
            r"A repeated linear factor in the denominator pairs with $t$ times an exponential.",
            [
                C(r"$t e^{t}$", r"Correct. $\mathcal{L}\{t e^{at}\} = 1/(s-a)^2$, so with $a = 1$ the inverse is $t e^t$."),
                W(r"$e^{t}$", r"A single power $1/(s-1)$ gives $e^t$, but the square calls for an extra factor. What factor of $t$ appears?"),
                W(r"$t e^{-t}$", r"The factor $(s-1)$ corresponds to $a = +1$, so the exponent is positive. What is the sign?"),
                W(r"$\frac{1}{2}t^2 e^{t}$", r"A squared denominator gives one factor of $t$, not a $t^2$. What is $\mathcal{L}^{-1}\{1/(s-a)^2\}$?"),
            ],
        ),
        item(
            "mp_c6YnYr8KsSo_3",
            r"When a partial-fraction denominator has an irreducible quadratic like $s^2 + b^2$, what time functions appear?",
            r"Such quadratics correspond to oscillatory transforms.",
            [
                C(r"Sines and cosines", r"Yes. An irreducible quadratic $s^2 + b^2$ inverts to sinusoidal terms."),
                W(r"Pure exponentials only", r"Real exponentials come from real linear factors. What do quadratic factors $s^2 + b^2$ give?"),
                W(r"Polynomials in $t$", r"Polynomials come from repeated factors at $s = 0$. What do oscillatory quadratics produce?"),
                W(r"Logarithms", r"Logarithms do not arise from rational transforms. What functions match $s^2 + b^2$?"),
            ],
        ),
        item(
            "mp_c6YnYr8KsSo_4",
            r"Find $\mathcal{L}^{-1}\!\left\{\frac{2}{s - 3}\right\}$.",
            r"Pull out the constant and use $\mathcal{L}^{-1}\{1/(s-a)\} = e^{at}$.",
            [
                C(r"$2e^{3t}$", r"Correct. The constant $2$ multiplies the inverse of $1/(s-3)$, which is $e^{3t}$."),
                W(r"$2e^{-3t}$", r"The denominator $s - 3$ has $a = +3$. What sign does the exponent take?"),
                W(r"$\frac{1}{2}e^{3t}$", r"The factor $2$ multiplies, it does not divide. What is $2 \cdot e^{3t}$?"),
                W(r"$e^{3t}$", r"The constant $2$ in the numerator must be kept. What multiplies $e^{3t}$?"),
            ],
        ),
        item(
            "mp_c6YnYr8KsSo_5",
            r"What is the overall strategy for inverting a complicated rational $F(s)$?",
            r"Reduce a hard expression to a sum of recognizable pieces.",
            [
                C(r"Decompose into simple fractions, then match each to a table entry", r"Yes. Partial fractions plus table matching is the standard inversion strategy."),
                W(r"Integrate $F(s)$ over $s$", r"Integrating in $s$ is not how inversion works here. What decomposition makes the pieces recognizable?"),
                W(r"Substitute $s = t$", r"The variables $s$ and $t$ are not interchangeable. What systematic method reduces $F(s)$ to known forms?"),
                W(r"Take the forward transform again", r"Applying the forward transform does not invert. What two-step approach is used?"),
            ],
        ),
    ],
)

# === 12.6 video 1 ===========================================================
add_micro(
    "fuxFrpaMLtw",
    'Unit 12, Module 12.6, video 1\n           "Using Laplace Transforms to Solve Differential Equations, Full Example"',
    [
        item(
            "mp_fuxFrpaMLtw_1",
            r"What are the three main stages of solving an IVP with Laplace transforms?",
            r"You move into the $s$-domain, do algebra, and come back.",
            [
                C(r"Transform the equation, solve algebraically for $Y(s)$, then invert", r"Yes. Transform, solve for $Y(s)$, and apply the inverse transform to recover $y(t)$."),
                W(r"Guess a solution, substitute, and adjust constants", r"That is the method of undetermined coefficients, not the transform method. What three transform stages are used?"),
                W(r"Separate variables, integrate, and apply conditions", r"Separation is a first-order technique. What is the transform-based sequence?"),
                W(r"Differentiate, factor, and integrate", r"This does not describe the transform method. What are its three stages?"),
            ],
        ),
        item(
            "mp_fuxFrpaMLtw_2",
            r"Transform the IVP $y' - y = 0$, $y(0) = 1$. What equation for $Y(s)$ results?",
            r"Use $\mathcal{L}\{y'\} = sY - y(0)$ with $y(0) = 1$.",
            [
                C(r"$(s - 1)Y = 1$", r"Correct. $sY - 1 - Y = 0$ rearranges to $(s-1)Y = 1$."),
                W(r"$sY = 1$", r"The $-y$ term contributes $-Y$ as well. What do you get after combining $sY - Y$?"),
                W(r"$(s + 1)Y = 1$", r"The equation is $y' - y$, giving $sY - Y = (s-1)Y$. What sign joins the terms?"),
                W(r"$(s - 1)Y = 0$", r"The initial value $y(0) = 1$ contributes a $1$ on the right. What is the right-hand side?"),
            ],
        ),
        item(
            "mp_fuxFrpaMLtw_3",
            r"Continuing, $(s-1)Y = 1$ gives $Y = 1/(s-1)$. What is $y(t)$?",
            r"Invert $1/(s-1)$ using the exponential rule.",
            [
                C(r"$y = e^{t}$", r"Correct. The inverse of $1/(s-1)$ is $e^{t}$, which indeed solves $y' = y$ with $y(0) = 1$."),
                W(r"$y = e^{-t}$", r"The denominator $s - 1$ has $a = +1$. What sign does the exponent carry?"),
                W(r"$y = t$", r"The transform $1/(s-1)$ is exponential, not the transform of $t$. What function gives $1/(s-1)$?"),
                W(r"$y = 1$", r"A constant has transform $1/s$, not $1/(s-1)$. What function matches $1/(s-1)$?"),
            ],
        ),
        item(
            "mp_fuxFrpaMLtw_4",
            r"A key advantage of the Laplace method for IVPs is how it treats the initial conditions. What is it?",
            r"Recall where $y(0)$ and $y'(0)$ enter the process.",
            [
                C(r"They are incorporated automatically when the derivatives are transformed", r"Yes. The derivative rules insert the initial values directly into the algebraic equation."),
                W(r"They are applied only after finding a general solution", r"That is the classical approach. When does the transform method use them?"),
                W(r"They are not needed at all", r"They are essential and appear in the transforms. How are they brought in?"),
                W(r"They must be converted to boundary conditions", r"No such conversion occurs. How does the transform handle initial data?"),
            ],
        ),
        item(
            "mp_fuxFrpaMLtw_5",
            r"For a second-order IVP, transforming $y''$ requires which initial data?",
            r"Recall the second-derivative rule and the values it contains.",
            [
                C(r"Both $y(0)$ and $y'(0)$", r"Yes. The rule $s^2 Y - s\,y(0) - y'(0)$ needs both initial values."),
                W(r"Only $y(0)$", r"The transform of $y''$ also includes $y'(0)$. What second value is required?"),
                W(r"Only $y'(0)$", r"The term $s\,y(0)$ also appears. What first value is also needed?"),
                W(r"Neither value", r"Both initial values appear explicitly in the second-derivative rule. Which two are they?"),
            ],
        ),
    ],
)

# === 12.6 video 2 ===========================================================
add_micro(
    "Kdli4yUyu94",
    'Unit 12, Module 12.6, video 2\n           "How to use Laplace Transform to Solve Differential Equations, Full Example"',
    [
        item(
            "mp_Kdli4yUyu94_1",
            r"Solve $y' + 2y = 0$ with $y(0) = 3$ by transforming. What is $Y(s)$?",
            r"Use $sY - 3 + 2Y = 0$ and solve for $Y$.",
            [
                C(r"$Y = \frac{3}{s + 2}$", r"Correct. $(s + 2)Y = 3$ gives $Y = 3/(s+2)$."),
                W(r"$Y = \frac{3}{s - 2}$", r"The equation $y' + 2y$ gives $sY + 2Y = (s+2)Y$. What sign appears in the denominator?"),
                W(r"$Y = \frac{1}{s + 2}$", r"The initial value $y(0) = 3$ puts a $3$ in the numerator. What is the numerator?"),
                W(r"$Y = \frac{3}{s}$", r"The $+2y$ term shifts the denominator to $s + 2$. What is the denominator?"),
            ],
        ),
        item(
            "mp_Kdli4yUyu94_2",
            r"Continuing, $Y = 3/(s+2)$. What is $y(t)$?",
            r"Invert using $\mathcal{L}^{-1}\{1/(s-a)\} = e^{at}$ with $a = -2$.",
            [
                C(r"$y = 3e^{-2t}$", r"Correct. The denominator $s + 2$ gives $a = -2$, so $y = 3e^{-2t}$."),
                W(r"$y = 3e^{2t}$", r"The denominator $s + 2$ corresponds to $a = -2$, not $+2$. What sign does the exponent take?"),
                W(r"$y = 3t$", r"The transform $3/(s+2)$ is exponential, not the transform of $3t$. What function matches it?"),
                W(r"$y = 3$", r"A constant transforms to $3/s$, not $3/(s+2)$. What function gives $3/(s+2)$?"),
            ],
        ),
        item(
            "mp_Kdli4yUyu94_3",
            r"After transforming, what kind of equation must you solve to find $Y(s)$?",
            r"The derivatives are gone, replaced by powers of $s$.",
            [
                C(r"An algebraic equation in $Y(s)$", r"Yes. The transformed equation is purely algebraic, solved for $Y(s)$."),
                W(r"Another differential equation", r"The transform removes the derivatives. What kind of equation remains?"),
                W(r"An integral equation", r"No integral equation appears in this step. What algebraic object do you solve for?"),
                W(r"A system of partial differential equations", r"The result is a single algebraic equation. What do you isolate?"),
            ],
        ),
        item(
            "mp_Kdli4yUyu94_4",
            r"Solve $y'' - y = 0$ with $y(0) = 0$, $y'(0) = 1$. What is $Y(s)$?",
            r"Transform to $s^2 Y - s\cdot 0 - 1 - Y = 0$ and solve.",
            [
                C(r"$Y = \frac{1}{s^2 - 1}$", r"Correct. $(s^2 - 1)Y = 1$, so $Y = 1/(s^2 - 1)$, which inverts to $\sinh t$."),
                W(r"$Y = \frac{1}{s^2 + 1}$", r"The equation is $y'' - y$, giving $s^2 Y - Y = (s^2 - 1)Y$. What sign appears?"),
                W(r"$Y = \frac{s}{s^2 - 1}$", r"With $y(0) = 0$, the $s\,y(0)$ term vanishes, leaving $1$ on top. What is the numerator?"),
                W(r"$Y = \frac{1}{s - 1}$", r"The second derivative gives $s^2 Y$, so the denominator is $s^2 - 1$. What is it?"),
            ],
        ),
        item(
            "mp_Kdli4yUyu94_5",
            r"What is the chief practical advantage of the Laplace method over classical techniques?",
            r"Think about discontinuous or impulsive forcing functions.",
            [
                C(r"It handles initial conditions and discontinuous or impulsive forcing cleanly", r"Yes. The transform builds in initial data and manages step and impulse inputs with ease."),
                W(r"It avoids all algebra", r"The method is algebra-heavy in the $s$-domain. What hard inputs does it handle well?"),
                W(r"It works only for homogeneous equations", r"It handles nonhomogeneous forcing especially well. What forcing types does it manage cleanly?"),
                W(r"It never requires inversion", r"Inversion is the final step. What modeling advantage does it offer instead?"),
            ],
        ),
    ],
)

# === 12.7 video 1 ===========================================================
add_micro(
    "zo4Stc-raQE",
    'Unit 12, Module 12.7, video 1\n           "Laplace Transform and Piecewise or Discontinuous Functions"',
    [
        item(
            "mp_zo4Stc-raQE_1",
            r"How is the Heaviside step function $u(t - a)$ defined?",
            r"It switches from off to on at $t = a$.",
            [
                C(r"$0$ for $t < a$ and $1$ for $t \ge a$", r"Yes. The step is zero before $t = a$ and one afterward, modeling a switch turning on."),
                W(r"$1$ for $t < a$ and $0$ for $t \ge a$", r"That is a switch turning off, the reverse. Which value does $u(t-a)$ take after $t = a$?"),
                W(r"$t$ for all $t$", r"The step is constant on each side, not equal to $t$. What two values does it take?"),
                W(r"$a$ for all $t$", r"It does not equal the shift $a$. What are its values before and after $t = a$?"),
            ],
        ),
        item(
            "mp_zo4Stc-raQE_2",
            r"What is the Laplace transform of the Heaviside step $u(t - a)$?",
            r"Integrate $e^{-st}$ from $a$ to infinity.",
            [
                C(r"$\frac{e^{-as}}{s}$", r"Correct. $\int_a^{\infty} e^{-st}\,dt = e^{-as}/s$."),
                W(r"$\frac{1}{s}$", r"That is the transform of $u(t)$ with $a = 0$. What factor does the delay $a$ introduce?"),
                W(r"$e^{-as}$", r"That is the transform of an impulse $\delta(t-a)$, not a step. What extra factor of $1/s$ appears?"),
                W(r"$\frac{e^{as}}{s}$", r"The delay produces a decaying factor $e^{-as}$, not $e^{as}$. What sign is in the exponent?"),
            ],
        ),
        item(
            "mp_zo4Stc-raQE_3",
            r"The second shifting theorem states that $\mathcal{L}\{u(t-a) f(t-a)\}$ equals what?",
            r"A time delay multiplies the transform by an exponential factor.",
            [
                C(r"$e^{-as} F(s)$", r"Yes. Delaying by $a$ and switching on at $a$ multiplies $F(s)$ by $e^{-as}$."),
                W(r"$e^{as} F(s)$", r"The shift introduces a decaying $e^{-as}$, not a growing factor. What sign appears?"),
                W(r"$F(s - a)$", r"Shifting in $s$ corresponds to multiplying by an exponential in $t$, the other shifting theorem. What does a time delay give?"),
                W(r"$F(s)/s$", r"Dividing by $s$ is integration, not a delay. What factor encodes the time shift?"),
            ],
        ),
        item(
            "mp_zo4Stc-raQE_4",
            r"Why is the Heaviside function useful for piecewise-defined forcing?",
            r"Think about combining steps to switch terms on and off.",
            [
                C(r"It lets you write piecewise functions as a single expression using steps", r"Yes. Sums of shifted steps switch pieces on and off, unifying a piecewise function into one formula."),
                W(r"It makes every function continuous", r"Steps introduce jumps rather than smoothing them. What does combining steps let you express?"),
                W(r"It removes the need for the transform", r"You still transform the result. What representational job do steps do?"),
                W(r"It forces the function to be periodic", r"Steps do not impose periodicity. What kind of functions do they help write?"),
            ],
        ),
        item(
            "mp_zo4Stc-raQE_5",
            r"In the transform $e^{-as} F(s)$, what does the factor $e^{-as}$ physically encode?",
            r"It corresponds to a shift along the time axis.",
            [
                C(r"A time delay of $a$ before the function turns on", r"Yes. The exponential factor represents postponing the signal by $a$ in time."),
                W(r"A change in amplitude", r"Amplitude is not affected by this factor. What time-domain effect does $e^{-as}$ represent?"),
                W(r"A frequency shift", r"Frequency shifting is the $s$-shift theorem instead. What does $e^{-as}$ encode in time?"),
                W(r"A scaling of the time variable", r"It is a shift, not a rescaling. What delay does $e^{-as}$ produce?"),
            ],
        ),
    ],
)

# === 12.7 video 2 ===========================================================
add_micro(
    "kRyOk1Ab90Q",
    'Unit 12, Module 12.7, video 2\n           "Laplace Transform Involving Heaviside Functions"',
    [
        item(
            "mp_kRyOk1Ab90Q_1",
            r"Compute $\mathcal{L}\{u(t - 2)\}$.",
            r"Use $\mathcal{L}\{u(t-a)\} = e^{-as}/s$ with $a = 2$.",
            [
                C(r"$\frac{e^{-2s}}{s}$", r"Correct. Setting $a = 2$ in $e^{-as}/s$ gives $e^{-2s}/s$."),
                W(r"$\frac{e^{2s}}{s}$", r"The delay gives a decaying $e^{-2s}$. What sign belongs in the exponent?"),
                W(r"$\frac{1}{s}$", r"That ignores the delay $a = 2$. What factor does the shift contribute?"),
                W(r"$e^{-2s}$", r"The step transform also divides by $s$. What is $e^{-2s}/s$?"),
            ],
        ),
        item(
            "mp_kRyOk1Ab90Q_2",
            r"Find $\mathcal{L}^{-1}\!\left\{\frac{e^{-3s}}{s}\right\}$.",
            r"Recognize $e^{-as}/s$ as the transform of a shifted step.",
            [
                C(r"$u(t - 3)$", r"Correct. The factor $e^{-3s}$ with $1/s$ inverts to the unit step turning on at $t = 3$."),
                W(r"$u(t + 3)$", r"The factor $e^{-3s}$ shifts the step to $t = +3$, not $-3$. Which direction is the delay?"),
                W(r"$e^{-3t}$", r"That would invert $1/(s+3)$, not $e^{-3s}/s$. What does the $e^{-3s}$ factor signal?"),
                W(r"$3u(t)$", r"The exponential encodes a delay, not a scaling. What shifted step matches $e^{-3s}/s$?"),
            ],
        ),
        item(
            "mp_kRyOk1Ab90Q_3",
            r"Compute $\mathcal{L}\{u(t-1)(t-1)^2\}$ using the second shifting theorem.",
            r"Here $f(t) = t^2$ with $\mathcal{L}\{t^2\} = 2/s^3$, shifted by $a = 1$.",
            [
                C(r"$e^{-s}\,\frac{2}{s^3}$", r"Correct. With $F(s) = 2/s^3$ and $a = 1$, the shifting theorem gives $e^{-s}\cdot 2/s^3$."),
                W(r"$\frac{2}{s^3}$", r"The shift by $a = 1$ contributes an $e^{-s}$ factor. What multiplies $2/s^3$?"),
                W(r"$e^{-s}\,\frac{1}{s^3}$", r"The transform of $t^2$ has numerator $2! = 2$. What is $\mathcal{L}\{t^2\}$?"),
                W(r"$e^{-s}\,\frac{2}{s^2}$", r"The transform of $t^2$ has denominator $s^3$. What power of $s$ is correct?"),
            ],
        ),
        item(
            "mp_kRyOk1Ab90Q_4",
            r"A forcing term that turns on at $t = 4$ is naturally modeled with which factor?",
            r"You need something that is zero until $t = 4$.",
            [
                C(r"A Heaviside step $u(t - 4)$", r"Yes. Multiplying by $u(t-4)$ keeps the forcing off until $t = 4$."),
                W(r"A Dirac delta $\delta(t - 4)$", r"A delta is an instantaneous spike, not a sustained switch-on. What models a lasting turn-on?"),
                W(r"A factor of $t - 4$", r"That term is negative before $t = 4$, not zero. What factor is exactly zero until $t = 4$?"),
                W(r"An exponential $e^{-4t}$", r"An exponential is nonzero for all $t$. What function stays zero until the switch time?"),
            ],
        ),
        item(
            "mp_kRyOk1Ab90Q_5",
            r"What is the difference between the time-shift theorem and the $s$-shift theorem?",
            r"One uses $e^{-as}$ as a factor on $F(s)$; the other replaces $s$ by $s - a$.",
            [
                C(r"Time shift multiplies $F(s)$ by $e^{-as}$; the $s$-shift replaces $s$ with $s - a$", r"Yes. A delay in $t$ gives a factor $e^{-as}$, while multiplying $f$ by $e^{at}$ shifts the argument of $F$ to $s - a$."),
                W(r"They are the same theorem", r"They handle different operations. What distinguishes a time delay from an $s$ shift?"),
                W(r"Both replace $s$ with $s - a$", r"Only the $s$-shift replaces the argument. What does the time shift do to $F(s)$ instead?"),
                W(r"Both multiply by $e^{-as}$", r"Only the time shift uses that factor. What does the $s$-shift theorem do to $s$?"),
            ],
        ),
    ],
)

# === 12.8 video 1 ===========================================================
add_micro(
    "SxNVcCVj-3c",
    'Unit 12, Module 12.8, video 1\n           "The Dirac Delta Function: How to Model an Impulse or Infinite Spike"',
    [
        item(
            "mp_SxNVcCVj-3c_1",
            r"What is the defining behavior of the Dirac delta $\delta(t)$?",
            r"It is concentrated entirely at one instant yet has unit total area.",
            [
                C(r"It is zero everywhere except at $t = 0$, with total integral equal to one", r"Yes. The delta is an idealized spike at the origin whose integral over all time is one."),
                W(r"It equals one for all $t$", r"That is a constant function, not a spike. Where is the delta nonzero?"),
                W(r"It is zero everywhere including its integral", r"Its integral is one, not zero. What is special about the total area?"),
                W(r"It grows linearly with $t$", r"The delta is concentrated at a point, not a ramp. What is its support and area?"),
            ],
        ),
        item(
            "mp_SxNVcCVj-3c_2",
            r"The sifting property says $\int_{-\infty}^{\infty} f(t)\,\delta(t - a)\,dt$ equals what?",
            r"The spike at $t = a$ samples $f$ there.",
            [
                C(r"$f(a)$", r"Yes. The delta picks out the value of $f$ at the spike location $t = a$."),
                W(r"$f(0)$", r"The spike sits at $t = a$, not at the origin. What value of $f$ is sampled?"),
                W(r"$\int f(t)\,dt$", r"The delta extracts a single value, not the full integral. What is that value?"),
                W(r"$a$", r"The result is the function value, not the location. What is $f(a)$?"),
            ],
        ),
        item(
            "mp_SxNVcCVj-3c_3",
            r"How is the Dirac delta related to the Heaviside step?",
            r"Consider the rate of change of a function that jumps from $0$ to $1$.",
            [
                C(r"The delta is the derivative of the step", r"Yes. The instantaneous jump of the step has the delta as its derivative."),
                W(r"The delta is the square of the step", r"Squaring is not the relationship. What calculus operation links them?"),
                W(r"The step is the derivative of the delta", r"The roles are reversed: the step integrates the delta. Which is the derivative of which?"),
                W(r"They are unrelated", r"They are closely connected through calculus. What derivative relationship holds?"),
            ],
        ),
        item(
            "mp_SxNVcCVj-3c_4",
            r"Strictly speaking, what kind of mathematical object is the Dirac delta?",
            r"No ordinary function can be zero everywhere yet integrate to one.",
            [
                C(r"A distribution (generalized function), not an ordinary function", r"Yes. The delta is defined as a distribution through how it acts inside integrals."),
                W(r"An ordinary continuous function", r"No continuous function behaves this way. What generalized object is it?"),
                W(r"A polynomial", r"It is not a polynomial. What kind of generalized function is the delta?"),
                W(r"A rational function", r"It is not rational either. How is the delta rigorously defined?"),
            ],
        ),
        item(
            "mp_SxNVcCVj-3c_5",
            r"What physical situation does the Dirac delta typically model?",
            r"Think of a very large force applied over a very short time.",
            [
                C(r"An instantaneous impulse, like a sudden hammer blow", r"Yes. The delta idealizes a force concentrated into a single instant, an impulse."),
                W(r"A slow steady push", r"A steady push is sustained, not instantaneous. What sudden input does the delta model?"),
                W(r"A constant background force", r"A constant force acts at all times. What momentary input is the delta?"),
                W(r"A gradual exponential decay", r"Decay is spread over time. What sharply concentrated input does the delta represent?"),
            ],
        ),
    ],
)

# === 12.8 video 2 ===========================================================
add_micro(
    "LOoM3qlpYuU",
    'Unit 12, Module 12.8, video 2\n           "Solving ODEs with Delta Functions using Laplace Transforms"',
    [
        item(
            "mp_LOoM3qlpYuU_1",
            r"What is the Laplace transform of $\delta(t - a)$?",
            r"Apply the sifting property to $\int_0^{\infty} e^{-st}\delta(t-a)\,dt$.",
            [
                C(r"$e^{-as}$", r"Correct. The sifting property samples the kernel at $t = a$, giving $e^{-as}$."),
                W(r"$\frac{e^{-as}}{s}$", r"That is the transform of a step $u(t-a)$, not an impulse. What does sifting the kernel give?"),
                W(r"$\frac{1}{s}$", r"That is the transform of the constant $1$. What does $\int e^{-st}\delta(t-a)\,dt$ evaluate to?"),
                W(r"$a e^{-as}$", r"No extra factor of $a$ appears. What is the value of $e^{-st}$ at $t = a$?"),
            ],
        ),
        item(
            "mp_LOoM3qlpYuU_2",
            r"What is $\mathcal{L}\{\delta(t)\}$, the transform of an impulse at the origin?",
            r"Set $a = 0$ in $\mathcal{L}\{\delta(t - a)\} = e^{-as}$.",
            [
                C(r"$1$", r"Correct. With $a = 0$, $e^{-as} = e^{0} = 1$."),
                W(r"$0$", r"The impulse has a nonzero transform. What is $e^{0}$?"),
                W(r"$\frac{1}{s}$", r"That is the transform of a step or constant, not the impulse at the origin. What is $e^{-as}$ at $a = 0$?"),
                W(r"$s$", r"The transform of $\delta(t)$ is a constant, not $s$. What is $e^{0}$?"),
            ],
        ),
        item(
            "mp_LOoM3qlpYuU_3",
            r"Solve $y'' + y = \delta(t)$ with $y(0) = 0$, $y'(0) = 0$. What is $y(t)$ for $t > 0$?",
            r"Transform to get $Y = 1/(s^2 + 1)$, then invert.",
            [
                C(r"$y = \sin t$", r"Correct. $(s^2 + 1)Y = 1$ gives $Y = 1/(s^2+1)$, which inverts to $\sin t$."),
                W(r"$y = \cos t$", r"Cosine corresponds to $s/(s^2+1)$, but here $Y = 1/(s^2+1)$. What inverts a constant numerator?"),
                W(r"$y = e^{-t}$", r"The denominator $s^2 + 1$ is oscillatory, not a real exponential. What function matches $1/(s^2+1)$?"),
                W(r"$y = t$", r"The transform $1/(s^2+1)$ is sinusoidal, not $1/s^2$. What does it invert to?"),
            ],
        ),
        item(
            "mp_LOoM3qlpYuU_4",
            r"Physically, what effect does a delta forcing have on a second-order mechanical system at rest?",
            r"An impulse delivers a sudden kick.",
            [
                C(r"It produces an instantaneous jump in the velocity", r"Yes. The impulse imparts a sudden change in momentum, jumping the velocity while the position stays continuous."),
                W(r"It produces an instantaneous jump in the position", r"Position stays continuous under an impulse. Which derivative jumps instead?"),
                W(r"It has no effect on the motion", r"An impulse certainly affects a system at rest. What quantity does it change suddenly?"),
                W(r"It makes the system oscillate forever with growing amplitude", r"A single impulse to a damped or neutral system does not cause unbounded growth. What immediate change does it cause?"),
            ],
        ),
        item(
            "mp_LOoM3qlpYuU_5",
            r"The response of a system to a unit impulse from rest is the inverse transform of which quantity?",
            r"With $\mathcal{L}\{\delta\} = 1$, the transformed output equals the system's transfer function.",
            [
                C(r"The transfer function $H(s)$", r"Yes. Since the impulse transforms to $1$, the output transform is $H(s)$ itself, so the impulse response is $\mathcal{L}^{-1}\{H(s)\}$."),
                W(r"The forcing transform alone", r"The impulse transform is just $1$; the output is shaped by the system. What system quantity is inverted?"),
                W(r"The initial-condition terms", r"From rest those terms vanish. What system function remains to invert?"),
                W(r"The characteristic polynomial itself", r"The transfer function is the reciprocal of that polynomial, not the polynomial. What is inverted to get the impulse response?"),
            ],
        ),
    ],
)

# === 12.9 video 1 ===========================================================
add_micro(
    "AgKQQtEc9dk",
    'Unit 12, Module 12.9, video 1\n           "The Convolution of Two Functions, Definition and Properties"',
    [
        item(
            "mp_AgKQQtEc9dk_1",
            r"How is the convolution $(f * g)(t)$ defined?",
            r"It integrates a product of $f$ and a shifted, reflected $g$ over the interval from $0$ to $t$.",
            [
                C(r"$\int_0^t f(\tau)\,g(t - \tau)\,d\tau$", r"Yes. Convolution integrates $f(\tau)g(t-\tau)$ over $\tau$ from $0$ to $t$."),
                W(r"$\int_0^t f(\tau)\,g(\tau)\,d\tau$", r"The second factor must be shifted to $t - \tau$, not left at $\tau$. What argument does $g$ take?"),
                W(r"$f(t)\,g(t)$", r"Convolution is an integral, not a pointwise product. What integral defines it?"),
                W(r"$\int_0^t f(t - \tau)\,g(t - \tau)\,d\tau$", r"Only one factor is shifted by $t - \tau$. What argument does $f$ keep?"),
            ],
        ),
        item(
            "mp_AgKQQtEc9dk_2",
            r"The convolution theorem states that $\mathcal{L}\{f * g\}$ equals what?",
            r"Convolution in time corresponds to a simple operation in the $s$-domain.",
            [
                C(r"$F(s)\,G(s)$", r"Yes. Convolution in time becomes multiplication of transforms in the $s$-domain."),
                W(r"$F(s) + G(s)$", r"Convolution maps to a product, not a sum. What operation on $F$ and $G$ results?"),
                W(r"$F(s)/G(s)$", r"It is a product, not a quotient. What do the transforms do together?"),
                W(r"$F(s - G(s))$", r"That expression is not meaningful here. What simple product does convolution become?"),
            ],
        ),
        item(
            "mp_AgKQQtEc9dk_3",
            r"Convolution is commutative. What does this mean?",
            r"The order of the two functions does not matter.",
            [
                C(r"$f * g = g * f$", r"Yes. Convolution gives the same result regardless of the order of the two functions."),
                W(r"$f * g = f \cdot g$", r"Convolution is not the same as pointwise multiplication. What symmetry does commutativity express?"),
                W(r"$f * g = -g * f$", r"There is no sign change. What equality does commutativity assert?"),
                W(r"$f * g = f + g$", r"Convolution is not addition. What does swapping the order give?"),
            ],
        ),
        item(
            "mp_AgKQQtEc9dk_4",
            r"When is the convolution theorem most useful for inverse transforms?",
            r"Think about inverting a transform that is already written as a product.",
            [
                C(r"When $\mathcal{L}^{-1}$ of a product $F(s)G(s)$ is needed, since it equals $f * g$", r"Yes. A product of transforms inverts to the convolution of the individual inverses."),
                W(r"When inverting a sum $F(s) + G(s)$", r"Sums invert term by term without convolution. What structure calls for convolution?"),
                W(r"When the transform is a single simple fraction", r"A simple fraction inverts directly from the table. What form needs the convolution theorem?"),
                W(r"When there is no $s$ dependence", r"That case is trivial. What product structure makes convolution the right tool?"),
            ],
        ),
        item(
            "mp_AgKQQtEc9dk_5",
            r"Compute the convolution $1 * 1$, that is $f = g = 1$.",
            r"Evaluate $\int_0^t 1\,d\tau$.",
            [
                C(r"$t$", r"Correct. $\int_0^t 1\,d\tau = t$."),
                W(r"$1$", r"The integral of $1$ from $0$ to $t$ is not constant. What is $\int_0^t 1\,d\tau$?"),
                W(r"$t^2$", r"Integrating the constant $1$ once gives $t$, not $t^2$. What is $\int_0^t 1\,d\tau$?"),
                W(r"$\frac{t^2}{2}$", r"That would be $\int_0^t \tau\,d\tau$, not $\int_0^t 1\,d\tau$. What is the integral of the constant $1$?"),
            ],
        ),
    ],
)

# === 12.9 video 2 ===========================================================
add_micro(
    "GqsYBeKGdgA",
    'Unit 12, Module 12.9, video 2\n           "Periodic Functions and the Laplace Transform"',
    [
        item(
            "mp_GqsYBeKGdgA_1",
            r"For a function periodic with period $T$, the Laplace transform is given by which formula?",
            r"You integrate over a single period and divide by a geometric factor.",
            [
                C(r"$\frac{1}{1 - e^{-sT}}\int_0^T e^{-st} f(t)\,dt$", r"Yes. The transform of a $T$-periodic function integrates over one period and divides by $1 - e^{-sT}$."),
                W(r"$\int_0^T e^{-st} f(t)\,dt$", r"The integral over one period must be divided by a factor accounting for all periods. What divides it?"),
                W(r"$\frac{1}{1 + e^{-sT}}\int_0^T e^{-st} f(t)\,dt$", r"The geometric factor has a minus sign: $1 - e^{-sT}$. What sign is correct?"),
                W(r"$\frac{1}{1 - e^{-sT}}\int_0^{\infty} e^{-st} f(t)\,dt$", r"You integrate over just one period, not to infinity. What is the upper limit?"),
            ],
        ),
        item(
            "mp_GqsYBeKGdgA_2",
            r"In the periodic transform formula, what does $T$ represent?",
            r"It is the defining parameter of a periodic function.",
            [
                C(r"The period of the function", r"Yes. $T$ is the period, the interval after which the function repeats."),
                W(r"The total duration of the signal", r"A periodic signal repeats indefinitely; $T$ is one cycle. What does $T$ measure?"),
                W(r"The transform variable", r"The transform variable is $s$, not $T$. What property of the function is $T$?"),
                W(r"The amplitude", r"$T$ is a time interval, not an amplitude. What does it measure?"),
            ],
        ),
        item(
            "mp_GqsYBeKGdgA_3",
            r"What does the factor $\frac{1}{1 - e^{-sT}}$ accomplish in the periodic transform?",
            r"It packages the contributions of every repeated cycle.",
            [
                C(r"It sums the geometric series of contributions from all the repeated periods", r"Yes. Each period contributes a copy scaled by $e^{-sT}$, and the factor sums that geometric series."),
                W(r"It removes the periodicity", r"The factor encodes the periodicity rather than removing it. What series does it sum?"),
                W(r"It differentiates the function", r"No differentiation is involved. What infinite sum does the factor represent?"),
                W(r"It shifts the function in time", r"It is not a shift but a sum over cycles. What does it collect?"),
            ],
        ),
        item(
            "mp_GqsYBeKGdgA_4",
            r"A practical benefit of the periodic transform formula is what?",
            r"You avoid integrating over the whole infinite time axis.",
            [
                C(r"You only need to integrate over a single period", r"Yes. The formula reduces the work to one period instead of the entire infinite domain."),
                W(r"You never have to integrate at all", r"One integral over a period is still required. What is the reduced range of integration?"),
                W(r"The function becomes nonperiodic", r"The function stays periodic. What integration shortcut does the formula give?"),
                W(r"You integrate over two periods", r"Only a single period is needed. How many periods must you integrate over?"),
            ],
        ),
        item(
            "mp_GqsYBeKGdgA_5",
            r"Which kind of signal is a natural candidate for the periodic transform formula?",
            r"Think of a repeating waveform used in engineering.",
            [
                C(r"A square wave", r"Yes. A repeating square wave is periodic, so the formula applies directly."),
                W(r"A single decaying exponential", r"A lone exponential does not repeat. What repeating waveform suits the formula?"),
                W(r"A one-time impulse", r"A single impulse is not periodic. What repeating signal is a good candidate?"),
                W(r"A constant that never changes", r"A constant is trivially handled without the periodic formula. What genuinely periodic waveform fits?"),
            ],
        ),
    ],
)

# === 12.10 video 1 ==========================================================
add_micro(
    "3gjJDuCAEQQ",
    'Unit 12, Module 12.10, video 1\n           "The Intuition behind Fourier and Laplace Transforms"',
    [
        item(
            "mp_3gjJDuCAEQQ_1",
            r"How do the Fourier and Laplace transforms differ in the frequencies they use?",
            r"Fourier uses pure oscillations; Laplace allows decay as well.",
            [
                C(r"Fourier uses purely imaginary frequencies, while Laplace uses general complex $s$", r"Yes. Fourier lives on the imaginary axis, and Laplace extends to the whole complex plane."),
                W(r"Fourier uses complex $s$, while Laplace uses only real frequencies", r"This reverses the two. Which transform uses purely imaginary frequencies?"),
                W(r"They use exactly the same frequencies", r"Their frequency domains differ. How does Laplace generalize Fourier's frequencies?"),
                W(r"Both use only real frequencies", r"Laplace allows complex $s$ with a real part. Which transform is restricted to the imaginary axis?"),
            ],
        ),
        item(
            "mp_3gjJDuCAEQQ_2",
            r"What does the Laplace transform add to the Fourier kernel that aids convergence?",
            r"The real part of $s$ introduces an extra factor.",
            [
                C(r"A real decaying factor $e^{-\sigma t}$", r"Yes. The real part of $s$ supplies a damping factor that helps the integral converge."),
                W(r"A growing factor $e^{\sigma t}$", r"A growing factor would hurt convergence. What kind of factor helps it?"),
                W(r"A constant offset", r"A constant does not aid convergence. What time-decaying factor does the real part of $s$ provide?"),
                W(r"A second oscillation", r"Extra oscillation does not improve convergence. What damping factor is added?"),
            ],
        ),
        item(
            "mp_3gjJDuCAEQQ_3",
            r"For what kind of analysis is the Fourier transform especially suited?",
            r"Think about steady oscillations and frequency content.",
            [
                C(r"Steady-state frequency content of signals", r"Yes. Fourier analysis decomposes a signal into its steady oscillatory frequency content."),
                W(r"Transient growth of unstable systems", r"Growing transients are better suited to Laplace. What does Fourier emphasize?"),
                W(r"One-time impulse responses with decay", r"Decaying transients favor Laplace. What steady behavior does Fourier capture?"),
                W(r"Discrete counting problems", r"That is unrelated to Fourier analysis. What continuous frequency content does it reveal?"),
            ],
        ),
        item(
            "mp_3gjJDuCAEQQ_4",
            r"Why can the Laplace transform handle functions that the Fourier transform cannot?",
            r"The damping factor controls functions that grow over time.",
            [
                C(r"Its decay factor lets it converge for functions that grow in time", r"Yes. The $e^{-\sigma t}$ factor can overcome growth that would make the Fourier integral diverge."),
                W(r"It ignores the high-frequency content", r"It does not discard frequencies. What lets it converge for growing functions?"),
                W(r"It only works for bounded functions", r"It actually extends to some unbounded ones. What feature enables that?"),
                W(r"It uses a finite integration range", r"Both use an infinite range here. What damping factor aids convergence?"),
            ],
        ),
        item(
            "mp_3gjJDuCAEQQ_5",
            r"The region of convergence of a Laplace transform is described in terms of what?",
            r"It restricts the real part of the transform variable.",
            [
                C(r"A condition on the real part of $s$", r"Yes. The region of convergence is typically a half-plane defined by $\operatorname{Re}(s)$ exceeding some value."),
                W(r"A condition on the imaginary part only", r"Convergence is governed by the real part, which controls decay. Which part of $s$ matters?"),
                W(r"The value of $f(0)$", r"Initial values do not set the convergence region. What part of $s$ does?"),
                W(r"The amplitude of $f$", r"Amplitude does not define convergence. What condition on $s$ describes the region?"),
            ],
        ),
    ],
)

# === 12.10 video 2 ==========================================================
add_micro(
    "7UvtU75NXTg",
    'Unit 12, Module 12.10, video 2\n           "The Laplace Transform: A Generalized Fourier Transform"',
    [
        item(
            "mp_7UvtU75NXTg_1",
            r"Setting $s = i\omega$ in the Laplace transform recovers which transform?",
            r"On the imaginary axis the kernel becomes a pure oscillation.",
            [
                C(r"The Fourier transform", r"Yes. Restricting $s$ to the imaginary axis $i\omega$ reduces Laplace to the Fourier transform."),
                W(r"The inverse Laplace transform", r"Setting $s = i\omega$ does not invert; it specializes the kernel. What transform results?"),
                W(r"The Z-transform", r"The Z-transform is the discrete-time analog, not obtained this way. What continuous transform appears?"),
                W(r"The identity transform", r"The result is a genuine transform, not the identity. Which one is recovered on the imaginary axis?"),
            ],
        ),
        item(
            "mp_7UvtU75NXTg_2",
            r"In what sense is the Laplace transform a generalization of the Fourier transform?",
            r"Compare the set of allowed values of the transform variable.",
            [
                C(r"It evaluates the kernel for complex $s$, not just the imaginary axis", r"Yes. Laplace allows the full complex plane, with Fourier as the special case on the imaginary axis."),
                W(r"It uses a completely different kernel", r"The kernels are closely related exponentials. What does Laplace generalize about the variable?"),
                W(r"It is defined only for periodic functions", r"It applies broadly, not just to periodic functions. How does it extend Fourier?"),
                W(r"It discards the frequency information", r"Frequency content is retained on the imaginary axis. What does it add beyond Fourier?"),
            ],
        ),
        item(
            "mp_7UvtU75NXTg_3",
            r"The one-sided Laplace transform integrates over which interval, compared to the two-sided Fourier transform?",
            r"Recall the lower limit in the Laplace definition.",
            [
                C(r"From $0$ to $\infty$, whereas the Fourier transform runs over all of $\mathbb{R}$", r"Yes. The standard Laplace transform is one-sided, starting at $t = 0$."),
                W(r"From $-\infty$ to $\infty$, the same as Fourier", r"The standard Laplace transform starts at $0$, not $-\infty$. What is its lower limit?"),
                W(r"Over a single period only", r"That is the periodic-function formula, not the general definition. What is the general range?"),
                W(r"Over the negative axis only", r"It covers nonnegative time. What is the integration interval?"),
            ],
        ),
        item(
            "mp_7UvtU75NXTg_4",
            r"Evaluating the Laplace transform on the imaginary axis gives which physical quantity?",
            r"On the imaginary axis the transform reports the response at each frequency.",
            [
                C(r"The frequency response of the system", r"Yes. Evaluating $F(i\omega)$ gives the system's response as a function of frequency."),
                W(r"The transient decay rate", r"Decay rates relate to the real part of poles, not the imaginary axis evaluation. What does $F(i\omega)$ give?"),
                W(r"The initial conditions", r"Initial data are separate. What does the imaginary-axis value represent?"),
                W(r"The total energy", r"That is not what $F(i\omega)$ directly reports. What frequency-domain quantity does it give?"),
            ],
        ),
        item(
            "mp_7UvtU75NXTg_5",
            r"Why might Laplace converge for a signal whose Fourier integral does not?",
            r"Compare a pure oscillatory kernel with one that also decays.",
            [
                C(r"The extra real-part damping in $e^{-st}$ can tame growth the pure oscillation cannot", r"Yes. The Fourier kernel only oscillates, while the Laplace kernel adds decay that absorbs growth."),
                W(r"Laplace uses a shorter integration range in general", r"Both use an infinite range; the difference is the kernel. What does the real part of $s$ add?"),
                W(r"Fourier requires the signal to be complex", r"That is not the issue. What damping does Laplace provide that Fourier lacks?"),
                W(r"Laplace ignores divergent parts", r"It does not discard parts of the signal. What kernel feature enables convergence?"),
            ],
        ),
    ],
)

# === 12.11 video 1 ==========================================================
add_micro(
    "noycLIZbK_k",
    'Unit 12, Module 12.11, video 1\n           "Control Systems Lectures, Time and Frequency Domain"',
    [
        item(
            "mp_noycLIZbK_k_1",
            r"What distinguishes the time domain from the frequency domain?",
            r"One plots against time; the other against frequency.",
            [
                C(r"The time domain describes a signal versus $t$; the frequency domain describes its content versus frequency", r"Yes. The two domains are complementary views of the same signal, one in time and one in frequency."),
                W(r"They describe two unrelated signals", r"They are two views of the same signal. What variable does each use?"),
                W(r"The frequency domain plots against time", r"That describes the time domain. What does the frequency domain plot against?"),
                W(r"Only the time domain carries real information", r"Both carry the full information. What does the frequency domain represent?"),
            ],
        ),
        item(
            "mp_noycLIZbK_k_2",
            r"What is the role of a transform like Laplace or Fourier in this context?",
            r"It provides the bridge between the two views.",
            [
                C(r"It moves a signal between the time and frequency domains", r"Yes. The transform converts a time-domain signal into its frequency-domain representation and back."),
                W(r"It deletes the frequency information", r"It preserves and exposes that information. What does the transform do between domains?"),
                W(r"It only works in the time domain", r"Its purpose is to cross between domains. Which two domains does it connect?"),
                W(r"It makes the signal constant", r"It does not flatten the signal. What mapping does it perform?"),
            ],
        ),
        item(
            "mp_noycLIZbK_k_3",
            r"Convolution in the time domain corresponds to what operation in the frequency domain?",
            r"Recall the convolution theorem.",
            [
                C(r"Multiplication", r"Yes. Convolution in time becomes simple multiplication of transforms in the frequency domain."),
                W(r"Convolution again", r"The operation simplifies in frequency. What does convolution become there?"),
                W(r"Addition", r"Convolution does not map to addition. What product operation results?"),
                W(r"Differentiation", r"Convolution is not differentiation in frequency. What simpler operation does it become?"),
            ],
        ),
        item(
            "mp_noycLIZbK_k_4",
            r"In control systems, what does the transfer function $H(s)$ describe?",
            r"It relates the transformed output to the transformed input.",
            [
                C(r"How the system maps input transforms to output transforms", r"Yes. The transfer function is the ratio of output to input transforms, characterizing the system."),
                W(r"The system's initial conditions", r"Transfer functions assume zero initial conditions. What input-output relationship do they give?"),
                W(r"The exact time-domain input signal", r"It is a system property, not the input itself. What does it relate?"),
                W(r"The total energy dissipated", r"Energy is not its direct content. What input-to-output map does $H(s)$ encode?"),
            ],
        ),
        item(
            "mp_noycLIZbK_k_5",
            r"Why do engineers often prefer the frequency-domain view for linear systems?",
            r"Hard time-domain operations often simplify after transforming.",
            [
                C(r"Operations like convolution and differentiation become algebraic", r"Yes. The frequency domain turns calculus operations into algebra, simplifying analysis and design."),
                W(r"Signals lose all structure there", r"Structure is preserved and clarified. What simplification does the frequency view offer?"),
                W(r"Time no longer exists", r"Time information is recoverable by inversion. What operational benefit does the frequency domain give?"),
                W(r"It removes the need for any model", r"A model is still needed. What makes computations easier in frequency?"),
            ],
        ),
    ],
)

# === 12.11 video 2 ==========================================================
add_micro(
    "pUFSXhoazY8",
    'Unit 12, Module 12.11, video 2\n           "Pole Diagrams, MIT 18.03SC Differential Equations"',
    [
        item(
            "mp_pUFSXhoazY8_1",
            r"In a pole diagram, what are the poles of a transform $F(s)$?",
            r"Poles are where the function blows up.",
            [
                C(r"The values of $s$ where the denominator is zero", r"Yes. Poles are the roots of the denominator, where $F(s)$ becomes infinite."),
                W(r"The values of $s$ where the numerator is zero", r"Those are the zeros, not the poles. Where does $F(s)$ blow up?"),
                W(r"The values where $F(s) = 0$", r"Where $F$ vanishes are the zeros. Where does $F$ become infinite?"),
                W(r"The initial conditions", r"Poles are determined by the transform's denominator, not initial data. What makes the denominator zero?"),
            ],
        ),
        item(
            "mp_pUFSXhoazY8_2",
            r"A pole located in the left half-plane (negative real part) corresponds to what time behavior?",
            r"The real part of a pole sets the exponential growth or decay rate.",
            [
                C(r"A decaying term", r"Yes. A negative real part produces an exponentially decaying contribution, indicating stability."),
                W(r"A growing term", r"Growth comes from poles with positive real part. What does a negative real part give?"),
                W(r"A constant term", r"A constant corresponds to a pole at the origin. What does a left-half-plane pole give?"),
                W(r"A pure oscillation with no decay", r"Pure oscillation needs a pole on the imaginary axis. What does a strictly negative real part produce?"),
            ],
        ),
        item(
            "mp_pUFSXhoazY8_3",
            r"A pole exactly on the imaginary axis corresponds to what behavior?",
            r"There is no real part, so no growth or decay.",
            [
                C(r"A sustained oscillation with constant amplitude", r"Yes. A purely imaginary pole gives undamped oscillation that neither grows nor decays."),
                W(r"Exponential decay", r"Decay requires a negative real part. What does a zero real part give?"),
                W(r"Exponential growth", r"Growth requires a positive real part. What does a pole with zero real part produce?"),
                W(r"A constant nonzero offset", r"A constant comes from a pole at the origin specifically. What does an imaginary-axis pole give in general?"),
            ],
        ),
        item(
            "mp_pUFSXhoazY8_4",
            r"A pole in the right half-plane (positive real part) signals what?",
            r"A positive real part makes the corresponding exponential grow.",
            [
                C(r"An unstable, growing response", r"Yes. A positive real part yields exponential growth, the signature of instability."),
                W(r"A stable, decaying response", r"Decay comes from the left half-plane. What does a positive real part produce?"),
                W(r"A bounded oscillation", r"Bounded oscillation is the imaginary-axis case. What does a right-half-plane pole indicate?"),
                W(r"No effect on the response", r"Such a pole strongly affects the response. What growing behavior does it cause?"),
            ],
        ),
        item(
            "mp_pUFSXhoazY8_5",
            r"Find the poles of $F(s) = \frac{1}{(s + 1)(s - 2)}$.",
            r"Set each factor of the denominator to zero.",
            [
                C(r"$s = -1$ and $s = 2$", r"Correct. The denominator vanishes at $s = -1$ and $s = 2$."),
                W(r"$s = 1$ and $s = -2$", r"Check the signs: $(s+1) = 0$ gives $s = -1$, and $(s-2) = 0$ gives $s = 2$. What are the roots?"),
                W(r"$s = 0$ only", r"The denominator is not $s$ itself. Where do $(s+1)$ and $(s-2)$ vanish?"),
                W(r"$s = -1$ and $s = -2$", r"The factor $(s - 2)$ vanishes at $s = +2$, not $-2$. What is the second root?"),
            ],
        ),
    ],
)

# === 12.12 video 1 ==========================================================
add_micro(
    "zNnHr1bjC04",
    'Unit 12, Module 12.12, video 1\n           "Deriving Laplace Transforms from First Principles"',
    [
        item(
            "mp_zNnHr1bjC04_1",
            r"The Laplace transform can be motivated as the continuous analog of which discrete object?",
            r"Think of a sum of coefficients times powers of a variable.",
            [
                C(r"A power series, or generating function, $\sum a_n x^n$", r"Yes. The transform is a continuous version of a generating function, with integration replacing summation."),
                W(r"A finite arithmetic sum", r"The analog is an infinite power series, not a finite arithmetic sum. What discrete object does it generalize?"),
                W(r"A determinant", r"Determinants are unrelated to this motivation. What summation object becomes an integral?"),
                W(r"A single derivative", r"A derivative is not the discrete analog. What series motivates the transform?"),
            ],
        ),
        item(
            "mp_zNnHr1bjC04_2",
            r"In passing from a power series to the Laplace transform, the discrete sum is replaced by what?",
            r"A continuous index calls for integration.",
            [
                C(r"An integral over a continuous variable", r"Yes. Summation over a discrete index becomes integration over a continuous time variable."),
                W(r"A larger finite sum", r"The transition is to a continuous integral, not just more terms. What replaces the sum?"),
                W(r"A derivative", r"Differentiation does not replace the sum. What continuous operation does?"),
                W(r"A matrix product", r"No matrix appears. What continuous analog of summation is used?"),
            ],
        ),
        item(
            "mp_zNnHr1bjC04_3",
            r"In the Laplace transform, the discrete coefficients $a_n$ correspond to which continuous object?",
            r"The coefficients become values of a function of time.",
            [
                C(r"The function $f(t)$ evaluated along $t$", r"Yes. The discrete coefficients become the continuous function $f(t)$."),
                W(r"The transform variable $s$", r"The variable $s$ plays the role of the series variable, not the coefficients. What becomes the coefficients?"),
                W(r"A constant of integration", r"The coefficients map to the whole function, not a single constant. What continuous object are they?"),
                W(r"The poles of the transform", r"Poles are a feature of the result, not the coefficients. What does $a_n$ become?"),
            ],
        ),
        item(
            "mp_zNnHr1bjC04_4",
            r"What is the role of the weighting factor $e^{-st}$ in this derivation?",
            r"It plays the part of the variable raised to a power in the series.",
            [
                C(r"It is the continuous analog of $x^n$, weighting each time", r"Yes. The factor $e^{-st}$ takes the place of the power $x^n$ from the generating function."),
                W(r"It is the function being transformed", r"The transformed function is $f(t)$; the kernel is separate. What series role does $e^{-st}$ play?"),
                W(r"It is an arbitrary constant", r"It is a structured kernel, not a constant. What discrete factor does it generalize?"),
                W(r"It removes time dependence", r"It weights the time variable rather than removing it. What power-like role does it serve?"),
            ],
        ),
        item(
            "mp_zNnHr1bjC04_5",
            r"What does this first-principles view reveal about the definition of the transform?",
            r"The definition is motivated, not arbitrary.",
            [
                C(r"The integral definition arises naturally from generalizing a power series", r"Yes. The kernel and integral emerge from taking a continuous limit of a generating function."),
                W(r"The definition is an unmotivated convention", r"The derivation shows it is well motivated. Where does the integral come from?"),
                W(r"The transform has no connection to series", r"The whole point is the series connection. What discrete idea does it generalize?"),
                W(r"The kernel could be any function", r"The kernel $e^{-st}$ arises specifically from the power-series analogy. What motivates it?"),
            ],
        ),
    ],
)

# === 12.12 video 2 ==========================================================
add_micro(
    "zvbdoSeGAgI",
    'Unit 12, Module 12.12, video 2\n           "Where the Laplace Transform Comes From, Arthur Mattuck, MIT"',
    [
        item(
            "mp_zvbdoSeGAgI_1",
            r"In Mattuck's derivation, a power series $\sum a_n x^n$ is connected to the Laplace transform by which substitution?",
            r"A particular choice of $x$ in terms of $s$ produces the exponential kernel.",
            [
                C(r"$x = e^{-s}$", r"Yes. Substituting $x = e^{-s}$ turns the power-series variable into the exponential kernel."),
                W(r"$x = s$", r"Setting $x = s$ does not produce the exponential kernel. What substitution gives $e^{-st}$?"),
                W(r"$x = 1/s$", r"That does not yield the exponential form. What value of $x$ produces $e^{-s}$?"),
                W(r"$x = \ln s$", r"This is not the substitution used. What choice of $x$ leads to $e^{-st}$?"),
            ],
        ),
        item(
            "mp_zvbdoSeGAgI_2",
            r"With the substitution $x = e^{-s}$, the term $x^n$ becomes what?",
            r"Replace $x$ with $e^{-s}$ in $x^n$.",
            [
                C(r"$e^{-sn}$", r"Yes. The power $x^n$ becomes $e^{-sn}$, the discrete analog of the kernel $e^{-st}$."),
                W(r"$e^{-s/n}$", r"The exponent multiplies by $n$, it does not divide. What is $(e^{-s})^n$?"),
                W(r"$n e^{-s}$", r"Raising to the power $n$ is not multiplying by $n$. What is $(e^{-s})^n$?"),
                W(r"$e^{-s} + n$", r"Exponentiation is not addition. What does $(e^{-s})^n$ equal?"),
            ],
        ),
        item(
            "mp_zvbdoSeGAgI_3",
            r"As the discrete index $n$ becomes a continuous variable $t$, the sum $\sum a_n e^{-sn}$ becomes which expression?",
            r"Summation over a continuum is integration.",
            [
                C(r"$\int_0^{\infty} f(t)\,e^{-st}\,dt$", r"Yes. The discrete sum passes to the Laplace integral as the index becomes continuous."),
                W(r"$\sum f(t)\,e^{-st}$", r"A continuous index requires an integral, not a sum. What replaces the summation?"),
                W(r"$\frac{d}{dt}\left[f(t)e^{-st}\right]$", r"Differentiation is not the continuous limit of a sum. What integral results?"),
                W(r"$f(t)\,e^{-st}$", r"The continuum limit integrates over $t$ rather than leaving a single term. What is the full expression?"),
            ],
        ),
        item(
            "mp_zvbdoSeGAgI_4",
            r"What insight does Mattuck's derivation give about the kernel $e^{-st}$?",
            r"The kernel is not arbitrary but inherited from the series variable.",
            [
                C(r"It arises naturally from the power-series variable under $x = e^{-s}$", r"Yes. The kernel comes directly from substituting $x = e^{-s}$ into the generating function."),
                W(r"It is chosen purely for convenience", r"The derivation shows it is structurally motivated. Where does $e^{-st}$ come from?"),
                W(r"It has no relation to the series variable", r"It is exactly the continuous form of that variable. How does it arise?"),
                W(r"It only works for polynomials", r"The construction is general. What gives rise to the kernel?"),
            ],
        ),
        item(
            "mp_zvbdoSeGAgI_5",
            r"What is the broad takeaway of viewing the Laplace transform as a continuous generating function?",
            r"It frames the transform as a familiar idea extended to the continuum.",
            [
                C(r"It shows the transform is a continuous extension of the generating-function idea", r"Yes. The transform generalizes generating functions from discrete sequences to continuous functions."),
                W(r"It proves the transform is unrelated to series", r"The connection to series is the whole insight. What does the transform extend?"),
                W(r"It shows the transform applies only to integer sequences", r"The continuous view applies to functions, not just integer sequences. What does it generalize?"),
                W(r"It eliminates the need for the kernel", r"The kernel is central and explained, not removed. What familiar idea does the transform extend?"),
            ],
        ),
    ],
)

# ============================================================================
# UNIT 11 MASTERY
# ============================================================================

m11(
    "um_11_1",
    r"Hooke's law for an ideal spring states the restoring force is which expression?",
    r"The force opposes displacement and is proportional to it.",
    [
        C(r"$F = -kx$", r"Yes. The restoring force is proportional to displacement and points back toward equilibrium."),
        W(r"$F = kx$", r"That force points the same way as the displacement. Which direction must a restoring force act?"),
        W(r"$F = -kx^2$", r"Hooke's law is linear in $x$. What power of $x$ appears?"),
        W(r"$F = -k\dot{x}$", r"A velocity-dependent force is damping, not the spring force. What variable does the spring force depend on?"),
    ],
)

m11(
    "um_11_2",
    r"For $m x'' + k x = 0$, what is the natural angular frequency $\omega_0$?",
    r"Normalize to $x'' + \omega_0^2 x = 0$ by dividing by $m$.",
    [
        C(r"$\omega_0 = \sqrt{k/m}$", r"Yes. Dividing by $m$ gives $\omega_0^2 = k/m$."),
        W(r"$\omega_0 = k/m$", r"That is $\omega_0^2$, not $\omega_0$. What is the square root of $k/m$?"),
        W(r"$\omega_0 = \sqrt{m/k}$", r"The ratio is inverted. Is the frequency $\sqrt{k/m}$ or $\sqrt{m/k}$?"),
        W(r"$\omega_0 = mk$", r"The frequency is a square root of a ratio, not a product. What is $\sqrt{k/m}$?"),
    ],
)

m11(
    "um_11_3",
    r"The period of a simple harmonic oscillator with angular frequency $\omega_0$ is which expression?",
    r"Recall the relationship $T = 2\pi/\omega_0$.",
    [
        C(r"$T = \frac{2\pi}{\omega_0}$", r"Yes. The period is $2\pi$ divided by the angular frequency."),
        W(r"$T = 2\pi\omega_0$", r"This multiplies rather than divides. How does $T$ depend on $\omega_0$?"),
        W(r"$T = \frac{\omega_0}{2\pi}$", r"That expression is the ordinary frequency $f$, not the period. What is the period?"),
        W(r"$T = \omega_0^2$", r"The period is not the square of the frequency. What formula relates $T$ and $\omega_0$?"),
    ],
)

m11(
    "um_11_4",
    r"In $F = -kx$, the minus sign tells you the force is what?",
    r"Consider the direction of the force when the mass is displaced.",
    [
        C(r"Restoring, always directed back toward equilibrium", r"Yes. The sign ensures the force opposes the displacement, producing oscillation."),
        W(r"Repelling, pushing the mass away from equilibrium", r"A repelling force would not oscillate. Which way does the sign point the force?"),
        W(r"Constant in magnitude", r"The magnitude scales with $x$. What does the sign say about direction?"),
        W(r"Always zero", r"The force is generally nonzero. What does the minus sign encode about its direction?"),
    ],
)

m11(
    "um_11_5",
    r"What is the general solution of $x'' + \omega_0^2 x = 0$?",
    r"The roots are $\pm i\omega_0$.",
    [
        C(r"$x = c_1\cos\omega_0 t + c_2\sin\omega_0 t$", r"Yes. Imaginary roots give undamped oscillation at frequency $\omega_0$."),
        W(r"$x = c_1 e^{\omega_0 t} + c_2 e^{-\omega_0 t}$", r"Real exponentials solve $x'' - \omega_0^2 x = 0$. What roots does the $+\omega_0^2$ term give?"),
        W(r"$x = c_1 + c_2 t$", r"That solves $x'' = 0$. What oscillatory form does $x'' + \omega_0^2 x = 0$ give?"),
        W(r"$x = c_1 e^{-\omega_0 t}\cos\omega_0 t$", r"A decaying factor requires damping, which is absent. What is the undamped form?"),
    ],
)

m11(
    "um_11_6",
    r"Which equation models free undamped vibration?",
    r"Free means unforced; undamped means no velocity term.",
    [
        C(r"$m x'' + k x = 0$", r"Yes. No forcing and no $x'$ term means free and undamped."),
        W(r"$m x'' + c x' + k x = 0$", r"The $c x'$ term is damping. Which term must be absent for undamped motion?"),
        W(r"$m x'' + k x = F_0\cos\omega t$", r"A nonzero right side is forcing. What must the right side equal for free motion?"),
        W(r"$m x' + k x = 0$", r"That is first order, not a vibration equation. What order governs oscillation?"),
    ],
)

m11(
    "um_11_7",
    r"Solve the IVP $x'' + 9x = 0$, $x(0) = 0$, $x'(0) = 6$.",
    r"Use $x = c_1\cos 3t + c_2\sin 3t$; the derivative brings a factor of $3$.",
    [
        C(r"$x = 2\sin 3t$", r"Correct. $x(0) = 0$ removes the cosine, and $3c_2 = 6$ gives $c_2 = 2$."),
        W(r"$x = 6\sin 3t$", r"The derivative introduces a factor of $3$, so $3c_2 = 6$. What is $c_2$?"),
        W(r"$x = 2\cos 3t$", r"Cosine has $x(0) = 2 \neq 0$. Which function vanishes at $t = 0$?"),
        W(r"$x = 6\cos 3t$", r"This violates both conditions. Which function matches $x(0) = 0$, and what coefficient fits $x'(0) = 6$?"),
    ],
)

m11(
    "um_11_8",
    r"Express $x = 3\cos\omega_0 t + 4\sin\omega_0 t$ in the form $C\cos(\omega_0 t - \phi)$. What is $C$?",
    r"The amplitude is $C = \sqrt{c_1^2 + c_2^2}$.",
    [
        C(r"$C = 5$", r"Correct. $\sqrt{3^2 + 4^2} = 5$."),
        W(r"$C = 7$", r"The amplitude is not the sum $3 + 4$. How do the coefficients combine?"),
        W(r"$C = 12$", r"That is the product $3 \cdot 4$. What is $\sqrt{c_1^2 + c_2^2}$?"),
        W(r"$C = 1$", r"That is the difference $4 - 3$. What does $\sqrt{3^2 + 4^2}$ give?"),
    ],
)

m11(
    "um_11_9",
    r"A system $m x'' + k x = 0$ has $m = 1$ and $k = 16$. What is the period of oscillation?",
    r"Compute $\omega_0 = \sqrt{k/m}$, then $T = 2\pi/\omega_0$.",
    [
        C(r"$T = \frac{\pi}{2}$", r"Correct. $\omega_0 = 4$, so $T = 2\pi/4 = \pi/2$."),
        W(r"$T = 2\pi$", r"This uses $\omega_0 = 1$. What is $\sqrt{16}$?"),
        W(r"$T = 8\pi$", r"That divides by a frequency below one. What is $2\pi/4$?"),
        W(r"$T = 4$", r"That is $\omega_0$, not the period. What is $2\pi/\omega_0$?"),
    ],
)

m11(
    "um_11_10",
    r"The angular frequency of a free undamped oscillator depends on which quantities?",
    r"Recall $\omega_0 = \sqrt{k/m}$.",
    [
        C(r"Only the mass and the spring constant", r"Yes. $\omega_0 = \sqrt{k/m}$ depends solely on the physical constants, not on how the motion starts."),
        W(r"The initial position and velocity", r"Those set amplitude and phase, not frequency. What physical constants set $\omega_0$?"),
        W(r"The amplitude of the motion", r"Amplitude does not affect the linear oscillator's frequency. What determines $\omega_0$?"),
        W(r"The phase angle", r"Phase does not change the frequency. Which constants set $\omega_0$?"),
    ],
)

m11(
    "um_11_11",
    r"In $m x'' + c x' + k x = 0$, which term represents damping?",
    r"Damping is proportional to velocity.",
    [
        C(r"$c x'$", r"Yes. The damping force opposes motion and is proportional to velocity."),
        W(r"$k x$", r"That is the spring restoring force. Which term uses the velocity?"),
        W(r"$m x''$", r"That is the inertial term. Which term involves $x'$?"),
        W(r"All three terms equally", r"Only one term is the damping. Which one is proportional to $x'$?"),
    ],
)

m11(
    "um_11_12",
    r"The damping cases are set by the discriminant $c^2 - 4mk$. Which sign gives underdamping?",
    r"Underdamping means complex roots and oscillation.",
    [
        C(r"$c^2 - 4mk < 0$", r"Yes. A negative discriminant gives complex roots and decaying oscillation."),
        W(r"$c^2 - 4mk > 0$", r"A positive discriminant gives overdamping with no oscillation. Which sign produces complex roots?"),
        W(r"$c^2 - 4mk = 0$", r"A zero discriminant is the critically damped boundary. Which sign gives oscillation?"),
        W(r"$c^2 - 4mk = 4$", r"Only the sign relative to zero matters, and a positive value is overdamped. Which sign is underdamped?"),
    ],
)

m11(
    "um_11_13",
    r"For $m = 1$ and $k = 25$, what damping coefficient $c$ gives critical damping?",
    r"Critical damping requires $c = 2\sqrt{mk}$.",
    [
        C(r"$c = 10$", r"Correct. $c = 2\sqrt{mk} = 2\sqrt{25} = 10$."),
        W(r"$c = 5$", r"That is $\sqrt{k}$, missing the factor of $2$. What is $2\sqrt{25}$?"),
        W(r"$c = 25$", r"That is $k$ itself. Critical damping needs $c = 2\sqrt{mk}$. What is it here?"),
        W(r"$c = 50$", r"That is $2k$, not $2\sqrt{mk}$. With $m = 1$, what is $2\sqrt{25}$?"),
    ],
)

m11(
    "um_11_14",
    r"Solve $x'' + 5x' + 6x = 0$ and classify the damping.",
    r"Factor $r^2 + 5r + 6 = (r+2)(r+3)$.",
    [
        C(r"$x = c_1 e^{-2t} + c_2 e^{-3t}$, overdamped", r"Correct. Distinct negative real roots give pure decay, the overdamped case."),
        W(r"$x = (c_1 + c_2 t)e^{-2t}$, critically damped", r"Equal roots are needed for that form, but $-2$ and $-3$ differ. Which case has distinct real roots?"),
        W(r"$x = e^{-t}(c_1\cos t + c_2\sin t)$, underdamped", r"The discriminant here is positive, so the roots are real. What case results?"),
        W(r"$x = c_1 e^{2t} + c_2 e^{3t}$, unstable", r"Check the signs of the roots of $(r+2)(r+3)$. Are they positive or negative?"),
    ],
)

m11(
    "um_11_15",
    r"Solve $x'' + 2x' + 5x = 0$.",
    r"The roots of $r^2 + 2r + 5 = 0$ are $-1 \pm 2i$.",
    [
        C(r"$x = e^{-t}(c_1\cos 2t + c_2\sin 2t)$", r"Correct. The complex roots $-1 \pm 2i$ give a decaying envelope and oscillation at frequency $2$."),
        W(r"$x = e^{t}(c_1\cos 2t + c_2\sin 2t)$", r"Check the real part of the roots. Is it $+1$ or $-1$?"),
        W(r"$x = e^{-t}(c_1\cos t + c_2\sin t)$", r"The oscillation frequency is the imaginary part. Is it $1$ or $2$?"),
        W(r"$x = c_1 e^{-t} + c_2 e^{-5t}$", r"The discriminant is negative, so the roots are complex. What oscillatory form results?"),
    ],
)

m11(
    "um_11_16",
    r"Which damping case returns to equilibrium fastest without oscillating?",
    r"It is the boundary between oscillatory and sluggish decay.",
    [
        C(r"Critically damped", r"Yes. Critical damping gives the quickest non-oscillatory return."),
        W(r"Overdamped", r"Overdamping is sluggish due to strong resistance. Which case is the fast boundary?"),
        W(r"Underdamped", r"Underdamping overshoots and oscillates. Which case avoids oscillation yet is fastest?"),
        W(r"Undamped", r"Undamped motion never settles. Which damped case settles fastest without oscillating?"),
    ],
)

m11(
    "um_11_17",
    r"For undamped forced motion $m x'' + k x = F_0\cos\omega t$, pure resonance occurs when which condition holds?",
    r"The driving frequency must match the natural frequency.",
    [
        C(r"$\omega = \omega_0$", r"Yes. Driving at the natural frequency causes resonance in the undamped system."),
        W(r"$\omega = 0$", r"Zero forcing frequency is a constant push. What frequency match produces resonance?"),
        W(r"$F_0$ is large", r"A large amplitude alone is not resonance. Which frequencies must coincide?"),
        W(r"$\omega = 2\omega_0$", r"Resonance requires an exact match, not a doubling. What must $\omega$ equal?"),
    ],
)

m11(
    "um_11_18",
    r"At pure resonance in an undamped system, the response amplitude does what?",
    r"With no damping, energy keeps being added at the natural frequency.",
    [
        C(r"Grows without bound, increasing linearly in $t$", r"Yes. The resonant particular solution carries a factor of $t$, so the amplitude grows without limit."),
        W(r"Stays constant", r"Constant amplitude occurs off resonance. What does matching frequencies do without damping?"),
        W(r"Decays to zero", r"Decay needs damping, which is absent. What happens when energy keeps accumulating?"),
        W(r"Remains bounded between fixed limits", r"Bounded oscillation is the off-resonance case. What does the resonant $t$ factor cause?"),
    ],
)

m11(
    "um_11_19",
    r"When the forcing frequency equals the natural frequency, the particular-solution trial must be modified how?",
    r"The plain trial already solves the homogeneous equation.",
    [
        C(r"Multiply by $t$, giving $x_p = t(A\cos\omega_0 t + B\sin\omega_0 t)$", r"Yes. Because the forcing duplicates a homogeneous solution, a factor of $t$ is required."),
        W(r"Leave the trial unchanged", r"The plain trial fails because it solves the homogeneous equation. What factor must be added?"),
        W(r"Use an exponential trial", r"Exponentials do not match cosine forcing. What modification handles the overlap?"),
        W(r"Multiply by $t^2$", r"One overlap needs only a single factor of $t$. How many powers of $t$ are required?"),
    ],
)

m11(
    "um_11_20",
    r"For $x'' + 25x = \cos\omega t$, at which forcing frequency does resonance occur?",
    r"Find $\omega_0 = \sqrt{25}$, then set $\omega = \omega_0$.",
    [
        C(r"$\omega = 5$", r"Correct. The natural frequency is $\sqrt{25} = 5$, so resonance occurs at $\omega = 5$."),
        W(r"$\omega = 25$", r"That is $\omega_0^2$, not $\omega_0$. What is $\sqrt{25}$?"),
        W(r"$\omega = 0$", r"Zero is a constant push, not resonance. What is the natural frequency?"),
        W(r"$\omega = \sqrt{5}$", r"The natural frequency is $\sqrt{25} = 5$, not $\sqrt{5}$. What is $\sqrt{25}$?"),
    ],
)

m11(
    "um_11_21",
    r"Beats occur in an undamped forced system when the forcing frequency $\omega$ satisfies which condition?",
    r"Beats are distinct from resonance; the frequencies are close but unequal.",
    [
        C(r"$\omega$ is close to but not equal to $\omega_0$", r"Yes. Two nearby frequencies interfere to produce the slow amplitude modulation called beats."),
        W(r"$\omega = \omega_0$ exactly", r"Exact equality gives resonance. What near-match produces beats?"),
        W(r"$\omega = 0$", r"Zero forcing frequency is a constant push. What relationship between $\omega$ and $\omega_0$ gives beats?"),
        W(r"$\omega \gg \omega_0$", r"Beats need the frequencies to be close. How close must $\omega$ be to $\omega_0$?"),
    ],
)

m11(
    "um_11_22",
    r"Off resonance, the steady amplitude is proportional to $\frac{1}{m(\omega_0^2 - \omega^2)}$. As $\omega \to \omega_0$, the amplitude does what?",
    r"Look at the denominator as the frequencies converge.",
    [
        C(r"Grows without bound, since the denominator approaches zero", r"Yes. The factor $\omega_0^2 - \omega^2$ vanishes, so the amplitude blows up, signaling resonance."),
        W(r"Approaches zero", r"A vanishing denominator makes the fraction large, not small. What happens to the amplitude?"),
        W(r"Stays constant", r"The denominator is changing. What does it approach, and what does that do to the fraction?"),
        W(r"Becomes exactly $F_0$", r"The magnitude diverges rather than settling at $F_0$. What does the vanishing denominator do?"),
    ],
)

m11(
    "um_11_23",
    r"What defines a system of coupled oscillators?",
    r"Coupling links the equations of motion together.",
    [
        C(r"Each mass's acceleration depends on the positions of the others", r"Yes. The coupling springs make the equations of motion interdependent."),
        W(r"Each mass moves independently of the others", r"Independence is the uncoupled case. What does coupling do to the equations?"),
        W(r"There is only a single mass", r"Coupled systems have multiple masses. What links their equations?"),
        W(r"The masses are all at rest", r"Coupled oscillators move and exchange energy. How are their equations related?"),
    ],
)

m11(
    "um_11_24",
    r"What is a normal mode of a coupled oscillator system?",
    r"In a normal mode the whole system shares one rhythm.",
    [
        C(r"A motion in which all masses oscillate at a single common frequency", r"Yes. In a normal mode every part moves sinusoidally at one shared frequency."),
        W(r"A motion in which each mass uses a different frequency", r"That is general motion, not a single mode. What frequency structure defines a mode?"),
        W(r"A state of rest", r"A normal mode is an active oscillation. What do all masses share in a mode?"),
        W(r"The decay of the system to equilibrium", r"Normal modes are sustained oscillations. What common feature defines them?"),
    ],
)

m11(
    "um_11_25",
    r"How many normal modes does a coupled system with two degrees of freedom have?",
    r"The count equals the number of degrees of freedom.",
    [
        C(r"Two", r"Yes. Two degrees of freedom give two independent normal modes."),
        W(r"One", r"One mode cannot span two degrees of freedom. How many modes match two degrees?"),
        W(r"Four", r"That doubles the degrees of freedom. How many independent modes are there?"),
        W(r"Infinitely many", r"A finite system has finitely many modes. How many degrees of freedom are there?"),
    ],
)

m11(
    "um_11_26",
    r"The coupled system $\mathbf{x}'' = A\mathbf{x}$ has a matrix $A$ with eigenvalues $-1$ and $-4$. What are the normal-mode angular frequencies?",
    r"Each eigenvalue equals $-\omega^2$, so $\omega = \sqrt{-\lambda}$.",
    [
        C(r"$\omega = 1$ and $\omega = 2$", r"Correct. From $-\omega^2 = -1$ and $-\omega^2 = -4$ we get $\omega = 1$ and $\omega = 2$."),
        W(r"$\omega = -1$ and $\omega = -4$", r"Frequencies are positive square roots. What are $\sqrt{1}$ and $\sqrt{4}$?"),
        W(r"$\omega = 1$ and $\omega = 4$", r"The second eigenvalue is $-4$, so $\omega = \sqrt{4} = 2$, not $4$. Recompute."),
        W(r"$\omega = \sqrt{5}$", r"The modes have separate frequencies from each eigenvalue, not a combined one. What are $\sqrt{1}$ and $\sqrt{4}$?"),
    ],
)

m11(
    "um_11_27",
    r"How is the general motion of a coupled system related to its normal modes?",
    r"Linearity allows the modes to be combined.",
    [
        C(r"It is a superposition of the normal modes", r"Yes. Any motion is a linear combination of the normal-mode oscillations."),
        W(r"It must be a single normal mode", r"General motion can mix modes. How do the modes combine?"),
        W(r"It is the product of the modes", r"Linear systems superpose by addition, not multiplication. How are modes combined?"),
        W(r"It is unrelated to the modes", r"The modes form a basis for all motion. How does the general solution use them?"),
    ],
)

m11(
    "um_11_28",
    r"Substituting $x = e^{rt}$ into $x'' + \omega_0^2 x = 0$ gives which characteristic roots?",
    r"Solve $r^2 + \omega_0^2 = 0$.",
    [
        C(r"$r = \pm i\omega_0$", r"Yes. The roots are purely imaginary, giving undamped oscillation."),
        W(r"$r = \pm\omega_0$", r"Those real roots come from $x'' - \omega_0^2 x = 0$. What does $r^2 = -\omega_0^2$ give?"),
        W(r"$r = 0$ (double)", r"A double zero needs $r^2 = 0$. What does $r^2 + \omega_0^2 = 0$ give?"),
        W(r"$r = \omega_0^2$", r"The roots solve a quadratic, not equal $\omega_0^2$. What is $\sqrt{-\omega_0^2}$?"),
    ],
)

m11(
    "um_11_29",
    r"Multiplying $x'' + \omega_0^2 x = 0$ by $x'$ and integrating yields what?",
    r"The result is a sum of squares that stays constant.",
    [
        C(r"A conserved energy, $\tfrac{1}{2}(x')^2 + \tfrac{1}{2}\omega_0^2 x^2 = \text{const}$", r"Yes. This is the conserved mechanical energy of the oscillator."),
        W(r"The characteristic equation", r"That comes from the exponential trial, not integration. What conserved expression results?"),
        W(r"A first-order linear equation", r"The result is a conservation law, not a linear ODE. What invariant appears?"),
        W(r"A forcing term", r"The equation is homogeneous with no forcing. What invariant does integration reveal?"),
    ],
)

m11(
    "um_11_30",
    r"An ideal LC circuit obeys $L q'' + \frac{1}{C}q = 0$. What does this illustrate about the harmonic oscillator?",
    r"Compare the equation's form to $x'' + \omega_0^2 x = 0$.",
    [
        C(r"The same oscillator equation governs systems far beyond mechanical springs", r"Yes. The LC circuit obeys the identical form, with $\omega_0 = 1/\sqrt{LC}$, showing the oscillator's universality."),
        W(r"Only mechanical systems can oscillate harmonically", r"The LC circuit is electrical, yet oscillates the same way. What does that show about the oscillator?"),
        W(r"Electrical systems never oscillate", r"The LC circuit clearly oscillates. What does its matching form demonstrate?"),
        W(r"The equation has no natural frequency here", r"Its frequency is $1/\sqrt{LC}$. What broad lesson does the shared form teach?"),
    ],
)

# ============================================================================
# UNIT 12 MASTERY
# ============================================================================

m12(
    "um_12_1",
    r"The Laplace transform of $f(t)$ is defined by which integral?",
    r"It weights $f$ by a decaying exponential over all positive time.",
    [
        C(r"$F(s) = \int_0^{\infty} e^{-st} f(t)\,dt$", r"Yes. The transform integrates $f$ against $e^{-st}$ from $0$ to infinity."),
        W(r"$F(s) = \int_0^{\infty} e^{st} f(t)\,dt$", r"A positive exponent diverges in general. What sign does the kernel carry?"),
        W(r"$F(s) = \int_{-\infty}^{\infty} e^{-st} f(t)\,dt$", r"The one-sided transform starts at $0$. What is the lower limit?"),
        W(r"$F(s) = \int_0^{\infty} f'(t)\,dt$", r"The definition transforms $f$ with the kernel, not $f'$ alone. What is the integrand?"),
    ],
)

m12(
    "um_12_2",
    r"In the $s$-domain, what do the pole locations of a system reveal?",
    r"Poles encode the natural exponential behaviors of the system.",
    [
        C(r"The natural frequencies and growth or decay rates", r"Yes. Pole positions show how the system oscillates and whether it grows or decays."),
        W(r"The exact initial conditions", r"Initial data affect numerators, not pole locations. What dynamic behavior do poles encode?"),
        W(r"The amplitude of the input", r"Amplitude is not read from poles. What do they reveal?"),
        W(r"The units of the signal", r"Poles are not about units. What system behavior do they describe?"),
    ],
)

m12(
    "um_12_3",
    r"Compute $\mathcal{L}\{1\}$.",
    r"Integrate the kernel $e^{-st}$ from $0$ to infinity for $s > 0$.",
    [
        C(r"$\frac{1}{s}$", r"Correct. $\int_0^{\infty} e^{-st}\,dt = 1/s$ for $s > 0$."),
        W(r"$1$", r"The integral of the kernel is not just one. What is $\int_0^{\infty} e^{-st}\,dt$?"),
        W(r"$s$", r"The transform of a constant is a reciprocal, not $s$. What is $1/s$?"),
        W(r"$\frac{1}{s^2}$", r"That is the transform of $t$. What does integrating $e^{-st}$ once give?"),
    ],
)

m12(
    "um_12_4",
    r"Compute $\mathcal{L}\{e^{at}\}$.",
    r"The integrand becomes $e^{-(s-a)t}$; integrate for $s > a$.",
    [
        C(r"$\frac{1}{s - a}$", r"Correct. $\int_0^{\infty} e^{-(s-a)t}\,dt = 1/(s-a)$."),
        W(r"$\frac{1}{s + a}$", r"Check the sign: the exponent is $-(s-a)t$. What denominator results?"),
        W(r"$\frac{1}{s}$", r"That is the transform of $1$. How does $at$ shift the denominator?"),
        W(r"$\frac{a}{s}$", r"The transform is not a multiple of $1/s$. What is $\int_0^{\infty} e^{-(s-a)t}\,dt$?"),
    ],
)

m12(
    "um_12_5",
    r"What is $\mathcal{L}\{t^n\}$ for a nonnegative integer $n$?",
    r"Each power of $t$ raises the denominator power and brings a factorial.",
    [
        C(r"$\frac{n!}{s^{n+1}}$", r"Yes. The transform of $t^n$ is $n!/s^{n+1}$."),
        W(r"$\frac{n}{s^n}$", r"The numerator is a factorial and the power is $n+1$. What is the correct form?"),
        W(r"$\frac{n!}{s^n}$", r"The denominator power is $n+1$, not $n$. What exponent appears?"),
        W(r"$\frac{1}{s^{n+1}}$", r"The numerator should be $n!$. What factor does $t^n$ contribute?"),
    ],
)

m12(
    "um_12_6",
    r"The linearity of the Laplace transform gives $\mathcal{L}\{a f + b g\}$ equal to what?",
    r"A linear operator distributes over sums and pulls out constants.",
    [
        C(r"$a\,\mathcal{L}\{f\} + b\,\mathcal{L}\{g\}$", r"Yes. The transform distributes and factors out the constants."),
        W(r"$\mathcal{L}\{f\}\,\mathcal{L}\{g\}$", r"Linearity gives a sum, not a product. How does it act on a scaled sum?"),
        W(r"$ab\,\mathcal{L}\{f + g\}$", r"The constants attach to each term separately. Where do $a$ and $b$ go?"),
        W(r"$\mathcal{L}\{f\} + \mathcal{L}\{g\}$", r"The constants must be retained. What multiplies each transform?"),
    ],
)

m12(
    "um_12_7",
    r"Which conditions guarantee the Laplace transform of $f$ exists?",
    r"There is a continuity condition and a growth condition.",
    [
        C(r"$f$ is piecewise continuous and of exponential order", r"Yes. Piecewise continuity plus exponential order is the standard sufficient condition."),
        W(r"$f$ is differentiable everywhere", r"Jumps are allowed, so differentiability is too strong. What two conditions suffice?"),
        W(r"$f$ is bounded for all $t$", r"Exponential growth is permitted. What is the actual growth condition?"),
        W(r"$f$ is periodic", r"Periodicity is not required. What conditions guarantee existence?"),
    ],
)

m12(
    "um_12_8",
    r"Find $\mathcal{L}^{-1}\!\left\{\frac{1}{s - 2}\right\}$.",
    r"Recall $\mathcal{L}\{e^{at}\} = 1/(s-a)$.",
    [
        C(r"$e^{2t}$", r"Correct. With $a = 2$, the inverse of $1/(s-2)$ is $e^{2t}$."),
        W(r"$e^{-2t}$", r"The denominator $s - 2$ gives $a = +2$. What sign does the exponent carry?"),
        W(r"$2e^{t}$", r"The $2$ is the shift in the denominator, not a coefficient. What inverts $1/(s-2)$?"),
        W(r"$\frac{1}{2}e^{2t}$", r"No extra factor is needed. What is $\mathcal{L}^{-1}\{1/(s-a)\}$?"),
    ],
)

m12(
    "um_12_9",
    r"With $Y = \mathcal{L}\{y\}$, what is $\mathcal{L}\{y'\}$?",
    r"The derivative rule multiplies by $s$ and subtracts the initial value.",
    [
        C(r"$sY - y(0)$", r"Yes. The first-derivative rule is $sY - y(0)$."),
        W(r"$sY$", r"An initial-value term is missing. What is subtracted?"),
        W(r"$sY + y(0)$", r"The initial value is subtracted, not added. What sign is correct?"),
        W(r"$Y/s$", r"Dividing by $s$ is integration. What does differentiation give?"),
    ],
)

m12(
    "um_12_10",
    r"What is $\mathcal{L}\{y''\}$ in terms of $Y$?",
    r"Apply the derivative rule twice, picking up both initial values.",
    [
        C(r"$s^2 Y - s\,y(0) - y'(0)$", r"Yes. The second-derivative rule carries two powers of $s$ and both initial values."),
        W(r"$s^2 Y - y'(0)$", r"The term $s\,y(0)$ is also present. What two initial terms appear?"),
        W(r"$s^2 Y + s\,y(0) + y'(0)$", r"Both initial terms are subtracted. What signs are correct?"),
        W(r"$s^2 Y$", r"Two initial-condition terms are missing. What does applying the rule twice give?"),
    ],
)

m12(
    "um_12_11",
    r"What is $\mathcal{L}\!\left\{\int_0^t f(\tau)\,d\tau\right\}$ in terms of $F(s)$?",
    r"Integration in time corresponds to division by $s$.",
    [
        C(r"$\frac{F(s)}{s}$", r"Yes. Integrating from $0$ to $t$ divides the transform by $s$."),
        W(r"$s\,F(s)$", r"Multiplying by $s$ is differentiation. What matches integration?"),
        W(r"$F(s) - f(0)$", r"That resembles a derivative rule. What does integration correspond to?"),
        W(r"$\frac{F(s)}{s^2}$", r"A single integration divides by $s$ once. What is the correct factor?"),
    ],
)

m12(
    "um_12_12",
    r"Why are partial fractions used to invert a rational $F(s)$?",
    r"Each simple piece should match a transform-table entry.",
    [
        C(r"They split $F(s)$ into simple terms with known inverse transforms", r"Yes. Decomposition lets you invert each piece from the table."),
        W(r"They multiply the fractions together", r"Decomposition splits into a sum. What is the goal?"),
        W(r"They eliminate the variable $s$", r"The variable $s$ remains until inversion. What do partial fractions do?"),
        W(r"They turn $F(s)$ into a polynomial", r"The result is a sum of simple fractions. Why split $F(s)$ up?"),
    ],
)

m12(
    "um_12_13",
    r"Find $\mathcal{L}^{-1}\!\left\{\frac{1}{s^2 + 4}\right\}$.",
    r"Match to $\mathcal{L}\{\sin bt\} = b/(s^2 + b^2)$ with $b = 2$.",
    [
        C(r"$\frac{1}{2}\sin 2t$", r"Correct. Since $\mathcal{L}\{\sin 2t\} = 2/(s^2+4)$, the inverse of $1/(s^2+4)$ carries the factor $1/2$."),
        W(r"$\sin 2t$", r"The table form has a $2$ on top, so a factor of $1/2$ is needed. What corrects it?"),
        W(r"$\cos 2t$", r"Cosine corresponds to an $s$ on top. What matches a constant numerator?"),
        W(r"$\frac{1}{2}\sin 4t$", r"The frequency is $\sqrt{4} = 2$, not $4$. What frequency does $s^2 + 4$ give?"),
    ],
)

m12(
    "um_12_14",
    r"Find $\mathcal{L}^{-1}\!\left\{\frac{1}{(s-1)^2}\right\}$.",
    r"A repeated linear factor pairs with $t$ times an exponential.",
    [
        C(r"$t e^{t}$", r"Correct. $\mathcal{L}\{t e^{at}\} = 1/(s-a)^2$, so with $a = 1$ the inverse is $t e^t$."),
        W(r"$e^{t}$", r"A single power $1/(s-1)$ gives $e^t$, but the square adds a factor. What factor of $t$ appears?"),
        W(r"$t e^{-t}$", r"The factor $(s-1)$ gives $a = +1$. What sign does the exponent take?"),
        W(r"$\frac{1}{2}t^2 e^{t}$", r"A squared denominator gives one factor of $t$, not $t^2$. What is $\mathcal{L}^{-1}\{1/(s-a)^2\}$?"),
    ],
)

m12(
    "um_12_15",
    r"What are the three stages of solving an IVP with Laplace transforms?",
    r"Move to the $s$-domain, do algebra, and come back.",
    [
        C(r"Transform the equation, solve algebraically for $Y(s)$, then invert", r"Yes. Transform, solve for $Y(s)$, and invert to recover $y(t)$."),
        W(r"Guess, substitute, and adjust constants", r"That is undetermined coefficients. What are the transform stages?"),
        W(r"Separate, integrate, and apply conditions", r"That is a first-order technique. What is the transform sequence?"),
        W(r"Factor, differentiate, and integrate", r"This does not describe the method. What are its three stages?"),
    ],
)

m12(
    "um_12_16",
    r"Solve $y' + 2y = 0$ with $y(0) = 3$ using transforms. What is $y(t)$?",
    r"Transform to $(s+2)Y = 3$, solve, and invert.",
    [
        C(r"$y = 3e^{-2t}$", r"Correct. $Y = 3/(s+2)$ inverts to $3e^{-2t}$."),
        W(r"$y = 3e^{2t}$", r"The denominator $s + 2$ gives $a = -2$. What sign does the exponent take?"),
        W(r"$y = 3t$", r"The transform $3/(s+2)$ is exponential, not $3/s^2$. What function matches it?"),
        W(r"$y = 3$", r"A constant transforms to $3/s$, not $3/(s+2)$. What gives $3/(s+2)$?"),
    ],
)

m12(
    "um_12_17",
    r"How is the Heaviside step $u(t - a)$ defined?",
    r"It switches from off to on at $t = a$.",
    [
        C(r"$0$ for $t < a$ and $1$ for $t \ge a$", r"Yes. The step is zero before $t = a$ and one afterward."),
        W(r"$1$ for $t < a$ and $0$ for $t \ge a$", r"That is a switch turning off. Which value does it take after $t = a$?"),
        W(r"$t$ for all $t$", r"The step is constant on each side. What two values does it take?"),
        W(r"$a$ for all $t$", r"It does not equal the shift $a$. What are its two values?"),
    ],
)

m12(
    "um_12_18",
    r"What is $\mathcal{L}\{u(t - a)\}$?",
    r"Integrate $e^{-st}$ from $a$ to infinity.",
    [
        C(r"$\frac{e^{-as}}{s}$", r"Correct. $\int_a^{\infty} e^{-st}\,dt = e^{-as}/s$."),
        W(r"$\frac{1}{s}$", r"That is the transform of $u(t)$ with $a = 0$. What factor does the delay add?"),
        W(r"$e^{-as}$", r"That is the transform of $\delta(t-a)$, not a step. What extra factor of $1/s$ appears?"),
        W(r"$\frac{e^{as}}{s}$", r"The delay gives a decaying $e^{-as}$. What sign is in the exponent?"),
    ],
)

m12(
    "um_12_19",
    r"The second shifting theorem states that $\mathcal{L}\{u(t-a)f(t-a)\}$ equals what?",
    r"A time delay multiplies the transform by an exponential factor.",
    [
        C(r"$e^{-as} F(s)$", r"Yes. Delaying by $a$ multiplies $F(s)$ by $e^{-as}$."),
        W(r"$e^{as} F(s)$", r"The shift gives a decaying $e^{-as}$. What sign appears?"),
        W(r"$F(s - a)$", r"Shifting in $s$ is the other theorem. What does a time delay give?"),
        W(r"$F(s)/s$", r"Dividing by $s$ is integration. What factor encodes the delay?"),
    ],
)

m12(
    "um_12_20",
    r"The sifting property states that $\int_{-\infty}^{\infty} f(t)\,\delta(t - a)\,dt$ equals what?",
    r"The spike at $t = a$ samples $f$ there.",
    [
        C(r"$f(a)$", r"Yes. The delta picks out the value of $f$ at $t = a$."),
        W(r"$f(0)$", r"The spike is at $t = a$, not the origin. What value is sampled?"),
        W(r"$\int f(t)\,dt$", r"The delta extracts a single value. What is it?"),
        W(r"$a$", r"The result is the function value, not the location. What is $f(a)$?"),
    ],
)

m12(
    "um_12_21",
    r"What is $\mathcal{L}\{\delta(t - a)\}$?",
    r"Apply the sifting property to $\int_0^{\infty} e^{-st}\delta(t-a)\,dt$.",
    [
        C(r"$e^{-as}$", r"Correct. Sifting samples the kernel at $t = a$, giving $e^{-as}$."),
        W(r"$\frac{e^{-as}}{s}$", r"That is the transform of a step, not an impulse. What does sifting the kernel give?"),
        W(r"$\frac{1}{s}$", r"That is the transform of $1$. What does $\int e^{-st}\delta(t-a)\,dt$ evaluate to?"),
        W(r"$a e^{-as}$", r"No extra factor of $a$ appears. What is $e^{-st}$ at $t = a$?"),
    ],
)

m12(
    "um_12_22",
    r"How is the Dirac delta related to the Heaviside step?",
    r"Consider the rate of change of a function that jumps from $0$ to $1$.",
    [
        C(r"The delta is the derivative of the step", r"Yes. The instantaneous jump of the step has the delta as its derivative."),
        W(r"The delta is the integral of the step", r"Integrating the step gives a ramp, not the delta. What derivative relation holds?"),
        W(r"They are identical", r"They are different objects. How is the delta obtained from the step?"),
        W(r"The delta is the square of the step", r"Squaring is not the relationship. What operation links them?"),
    ],
)

m12(
    "um_12_23",
    r"How is the convolution $(f * g)(t)$ defined?",
    r"Integrate $f(\tau)$ against a shifted $g(t - \tau)$ from $0$ to $t$.",
    [
        C(r"$\int_0^t f(\tau)\,g(t - \tau)\,d\tau$", r"Yes. Convolution integrates $f(\tau)g(t-\tau)$ over $\tau$ from $0$ to $t$."),
        W(r"$\int_0^t f(\tau)\,g(\tau)\,d\tau$", r"The second factor must be shifted to $t - \tau$. What argument does $g$ take?"),
        W(r"$f(t)\,g(t)$", r"Convolution is an integral, not a pointwise product. What integral defines it?"),
        W(r"$f(t) + g(t)$", r"Convolution is not addition. What integral form is correct?"),
    ],
)

m12(
    "um_12_24",
    r"The convolution theorem states that $\mathcal{L}\{f * g\}$ equals what?",
    r"Convolution in time corresponds to a simple operation in the $s$-domain.",
    [
        C(r"$F(s)\,G(s)$", r"Yes. Convolution in time becomes multiplication of transforms."),
        W(r"$F(s) + G(s)$", r"Convolution maps to a product, not a sum. What results?"),
        W(r"$F(s)/G(s)$", r"It is a product, not a quotient. What do the transforms do together?"),
        W(r"$F(s)\,G(s)/s$", r"No extra factor of $1/s$ appears. What simple product results?"),
    ],
)

m12(
    "um_12_25",
    r"For a function periodic with period $T$, the Laplace transform is given by which formula?",
    r"Integrate over one period and divide by a geometric factor.",
    [
        C(r"$\frac{1}{1 - e^{-sT}}\int_0^T e^{-st} f(t)\,dt$", r"Yes. Integrate over one period and divide by $1 - e^{-sT}$."),
        W(r"$\int_0^T e^{-st} f(t)\,dt$", r"The period integral must be divided by a factor for all periods. What divides it?"),
        W(r"$\frac{1}{1 + e^{-sT}}\int_0^T e^{-st} f(t)\,dt$", r"The factor has a minus sign: $1 - e^{-sT}$. What sign is correct?"),
        W(r"$\frac{1}{1 - e^{-sT}}\int_0^{\infty} e^{-st} f(t)\,dt$", r"You integrate over one period, not to infinity. What is the upper limit?"),
    ],
)

m12(
    "um_12_26",
    r"How do the Fourier and Laplace transforms differ in the frequencies they use?",
    r"Fourier uses pure oscillations; Laplace allows decay too.",
    [
        C(r"Fourier uses purely imaginary frequencies, Laplace uses general complex $s$", r"Yes. Fourier lives on the imaginary axis; Laplace extends to the whole complex plane."),
        W(r"Fourier uses complex $s$, Laplace only real frequencies", r"This reverses the two. Which transform uses purely imaginary frequencies?"),
        W(r"They use exactly the same frequencies", r"Their domains differ. How does Laplace generalize Fourier?"),
        W(r"Both use only real frequencies", r"Laplace allows complex $s$. Which transform is on the imaginary axis?"),
    ],
)

m12(
    "um_12_27",
    r"Setting $s = i\omega$ in the Laplace transform recovers which transform?",
    r"On the imaginary axis the kernel becomes a pure oscillation.",
    [
        C(r"The Fourier transform", r"Yes. Restricting $s$ to $i\omega$ reduces Laplace to the Fourier transform."),
        W(r"The inverse Laplace transform", r"Setting $s = i\omega$ specializes the kernel, it does not invert. What results?"),
        W(r"The Z-transform", r"That is the discrete-time analog. What continuous transform appears?"),
        W(r"The identity transform", r"The result is a genuine transform. Which one appears on the imaginary axis?"),
    ],
)

m12(
    "um_12_28",
    r"In a pole diagram, what are the poles of $F(s)$?",
    r"Poles are where the function blows up.",
    [
        C(r"The values of $s$ where the denominator is zero", r"Yes. Poles are the roots of the denominator, where $F(s)$ becomes infinite."),
        W(r"The values where the numerator is zero", r"Those are the zeros. Where does $F(s)$ blow up?"),
        W(r"The values where $F(s) = 0$", r"Where $F$ vanishes are the zeros. Where does $F$ become infinite?"),
        W(r"The initial conditions", r"Poles come from the denominator, not initial data. What makes the denominator zero?"),
    ],
)

m12(
    "um_12_29",
    r"A pole in the right half-plane (positive real part) signals what time behavior?",
    r"A positive real part makes the corresponding exponential grow.",
    [
        C(r"An unstable, growing response", r"Yes. A positive real part gives exponential growth, the signature of instability."),
        W(r"A stable, decaying response", r"Decay comes from the left half-plane. What does a positive real part give?"),
        W(r"A bounded oscillation", r"That is the imaginary-axis case. What does a right-half-plane pole indicate?"),
        W(r"No effect on the response", r"Such a pole strongly affects the response. What growing behavior does it cause?"),
    ],
)

m12(
    "um_12_30",
    r"Viewing the Laplace transform as the continuous analog of a generating function $\sum a_n x^n$ shows what?",
    r"The kernel and integral arise from a continuous limit of the series.",
    [
        C(r"The integral definition arises naturally from generalizing a power series", r"Yes. Substituting $x = e^{-s}$ and letting the index become continuous yields the Laplace integral."),
        W(r"The transform is an unmotivated convention", r"The derivation shows it is well motivated. Where does the integral come from?"),
        W(r"The transform has no relation to series", r"The series connection is the whole insight. What does it generalize?"),
        W(r"The kernel could be any function", r"The kernel $e^{-st}$ arises specifically from the power-series analogy. What motivates it?"),
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
    unit_new = (emit_unit_block(UNIT11_TITLE, MASTERY_11) + ",\n\n"
                + emit_unit_block(UNIT12_TITLE, MASTERY_12))
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
    data["unit_mastery"][UNIT11_TITLE] = [strip_item(it) for it in MASTERY_11]
    data["unit_mastery"][UNIT12_TITLE] = [strip_item(it) for it in MASTERY_12]

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
    for it in MASTERY_11 + MASTERY_12:
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
    assert len(MICRO) == 37, "expected 37 micro videos, got %d" % len(MICRO)
    assert len(MASTERY_11) == 30, "Unit 11 mastery not 30 items, got %d" % len(MASTERY_11)
    assert len(MASTERY_12) == 30, "Unit 12 mastery not 30 items, got %d" % len(MASTERY_12)
    one_correct(MASTERY_11, "mastery11")
    one_correct(MASTERY_12, "mastery12")
    for it in MASTERY_11 + MASTERY_12:
        assert it["id"] not in seen_ids, "duplicate id %s" % it["id"]
        seen_ids.add(it["id"])

    if bad:
        for where, s in bad:
            print("[!] FORBIDDEN CHAR in", where, "->", s)
        raise SystemExit("Validation failed: forbidden characters present")
    print("[+] validation passed: %d micro videos, %d + %d mastery items, copy rules OK"
          % (len(MICRO), len(MASTERY_11), len(MASTERY_12)))


if __name__ == "__main__":
    validate()
    update_js()
    update_json()
    print("[+] Unit 11 and Unit 12 quiz generation complete")
