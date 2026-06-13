# 📘 Ordinary Differential Equations — Solution Methods Cheat Sheet

A first-principles reference for four foundational first-order ODE techniques.

> **Color convention:** In every *Worked Example*, the live mathematical solution steps are rendered in $\color{purple}{\textbf{purple}}$ using the LaTeX `\color{purple}` command inside math blocks (and inline HTML where a table is used). Explanatory prose stays black.

A general first-order ODE can be written as

$$\frac{dy}{dx} = f(x,y).$$

The four methods below are simply four different "shapes" that $f(x,y)$ can take — each shape unlocks a different integration strategy.

---

# 1. Separable Equations

## ⚙️ The Core Logic

An equation is **separable** when the right-hand side factors into a function of $x$ alone times a function of $y$ alone:

$$\frac{dy}{dx} = g(x)\,h(y).$$

The "trick" of moving $dx$ and $dy$ to opposite sides looks like algebra on fractions, but it is really the **substitution rule (reverse chain rule)** in disguise. Rewrite the equation as

$$\frac{1}{h(y)}\frac{dy}{dx} = g(x),$$

then integrate **both sides with respect to $x$**:

$$\int \frac{1}{h(y)}\frac{dy}{dx}\,dx = \int g(x)\,dx.$$

On the left, $\frac{dy}{dx}\,dx = dy$, so the integral collapses to $\int \frac{1}{h(y)}\,dy$. That is *why* we are allowed to "split the differential": it is a legitimate $u$-substitution, not a fudge.

## 🧩 All Possible Cases / Variations

- **Explicit vs. implicit solutions.** Sometimes you can isolate $y$ at the end (explicit, $y = \dots$); other times the cleanest answer is left as a relation $F(x,y) = C$ (implicit).
- **Equilibrium / lost solutions.** Dividing by $h(y)$ is illegal wherever $h(y) = 0$. Each root $y = c$ of $h(y)=0$ is a **constant (equilibrium) solution** that may be "lost" in the division — always check separately.
- **Disguised separability.** The factoring may be hidden until you do algebra: e.g. $\frac{dy}{dx} = x + xy = x(1+y)$, or $\frac{dy}{dx} = e^{x+y} = e^x e^y$.
- **Non-elementary integrals.** After separating, one side may not have a closed-form antiderivative; the correct "answer" is then left as an integral.
- **Initial Value Problem (IVP).** A condition $y(x_0)=y_0$ pins down the constant $C$.

## 📋 Step-by-Step Methodology

1. Write the equation in the form $\dfrac{dy}{dx} = g(x)\,h(y)$.
2. Find the **equilibrium solutions** by solving $h(y)=0$; set them aside.
3. **Separate**: $\dfrac{dy}{h(y)} = g(x)\,dx$.
4. **Integrate both sides**: $\displaystyle\int \frac{dy}{h(y)} = \int g(x)\,dx$.
5. Add **one** constant $C$ (combine the two integration constants into one).
6. Solve for $y$ explicitly if possible; otherwise leave implicit.
7. Apply the initial condition to determine $C$.
8. State any equilibrium solutions and the domain of validity.

## ✏️ Worked Example A — Explicit IVP

**Solve** $\dfrac{dy}{dx} = 2xy,\quad y(0)=1.$

$$
\color{purple}
\begin{aligned}
\frac{dy}{dx} &= 2xy \qquad\text{(note: } y=0 \text{ is an equilibrium solution)}\\[4pt]
\frac{1}{y}\,dy &= 2x\,dx \qquad\text{(separate variables)}\\[4pt]
\int \frac{1}{y}\,dy &= \int 2x\,dx \qquad\text{(integrate both sides)}\\[4pt]
\ln|y| &= x^2 + C_1\\[4pt]
|y| &= e^{x^2 + C_1} = e^{C_1}\,e^{x^2}\\[4pt]
y &= C e^{x^2} \qquad\text{(let } C = \pm e^{C_1}\text{)}
\end{aligned}
$$

Apply the initial condition $y(0)=1$:

$$
\color{purple}
\begin{aligned}
1 &= C e^{0} = C\\[4pt]
\Longrightarrow\quad y &= e^{x^2}
\end{aligned}
$$

## ✏️ Worked Example B — Implicit Solution

**Solve** $\dfrac{dy}{dx} = \dfrac{3x^2 + 4x + 2}{2(y-1)},\quad y(0) = -1.$

$$
\color{purple}
\begin{aligned}
2(y-1)\,dy &= (3x^2 + 4x + 2)\,dx \qquad\text{(separate)}\\[4pt]
\int 2(y-1)\,dy &= \int (3x^2 + 4x + 2)\,dx \qquad\text{(integrate)}\\[4pt]
y^2 - 2y &= x^3 + 2x^2 + 2x + C
\end{aligned}
$$

Apply $y(0) = -1$:

$$
\color{purple}
\begin{aligned}
(-1)^2 - 2(-1) &= 0 + 0 + 0 + C\\[4pt]
1 + 2 &= C \;\Longrightarrow\; C = 3\\[6pt]
\boxed{\,y^2 - 2y &= x^3 + 2x^2 + 2x + 3\,} \quad\text{(implicit solution)}
\end{aligned}
$$

If an explicit form is needed, complete the square / use the quadratic formula on $y^2 - 2y - (\dots) = 0$:

$$
\color{purple}
\begin{aligned}
y &= 1 \pm \sqrt{\,x^3 + 2x^2 + 2x + 4\,}\\[4pt]
y &= 1 - \sqrt{\,x^3 + 2x^2 + 2x + 4\,} \quad\text{(} - \text{ branch, to match } y(0)=-1\text{)}
\end{aligned}
$$

---

# 2. Linear First-Order Equations (Integrating Factors)

## ⚙️ The Core Logic

A linear first-order ODE has the **standard form**

$$\frac{dy}{dx} + P(x)\,y = Q(x).$$

The left side is *almost* the derivative of a product, but not quite. The idea: multiply the whole equation by a cleverly chosen function $\mu(x)$, the **integrating factor**, so that the left side becomes an exact product-rule derivative.

We want

$$\mu\frac{dy}{dx} + \mu P\,y \;=\; \frac{d}{dx}\big(\mu y\big) = \mu\frac{dy}{dx} + \frac{d\mu}{dx}\,y.$$

Matching the $y$-terms forces $\dfrac{d\mu}{dx} = \mu P$, which is itself separable and gives

$$\mu(x) = e^{\int P(x)\,dx}.$$

Once the left side is $\frac{d}{dx}(\mu y)$, we just integrate once. That is *why* the integrating factor works — it manufactures a perfect product-rule derivative.

## 🧩 All Possible Cases / Variations

- **Not in standard form.** If the coefficient of $y'$ isn't $1$, divide through by it first. Watch for points where that coefficient is zero (singular points where the solution may break down).
- **Homogeneous case $Q(x)=0$.** Then the equation is *also* separable — either method works.
- **Constant coefficients.** If $P$ is constant, $\mu = e^{Px}$.
- **Drop the constant & absolute value.** When computing $\mu = e^{\int P\,dx}$, omit the $+C$ and the absolute value bars — any valid integrating factor works.
- **Linear in $x$, not $y$.** If the equation isn't linear in $y$ but *is* linear when you treat $x$ as a function of $y$, rewrite as $\dfrac{dx}{dy} + P(y)\,x = Q(y)$ and use $\mu(y)$.
- **Bernoulli equations.** $y' + P(x)y = Q(x)y^n$ is *not* linear, but the substitution $v = y^{1-n}$ converts it into a linear equation.

## 📋 Step-by-Step Methodology

1. Put the equation in standard form $y' + P(x)y = Q(x)$ (divide by the leading coefficient).
2. Compute the integrating factor $\mu(x) = e^{\int P(x)\,dx}$ (drop the constant).
3. Multiply every term by $\mu(x)$.
4. Recognize the left side as $\dfrac{d}{dx}\big[\mu(x)\,y\big]$.
5. Integrate both sides: $\mu y = \displaystyle\int \mu\,Q\,dx + C$.
6. Solve for $y$: $\;y = \dfrac{1}{\mu}\left[\displaystyle\int \mu\,Q\,dx + C\right]$.
7. Apply the initial condition for $C$.

## ✏️ Worked Example — IVP

**Solve** $x\dfrac{dy}{dx} + 2y = 4x^2,\quad y(1)=2.$

**Step 1 — Standard form** (divide by $x$):

$$
\color{purple}
\frac{dy}{dx} + \frac{2}{x}\,y = 4x
$$

So $P(x) = \dfrac{2}{x}$ and $Q(x) = 4x$.

**Step 2 — Integrating factor:**

$$
\color{purple}
\begin{aligned}
\mu(x) &= e^{\int P\,dx} = e^{\int \frac{2}{x}\,dx}\\[4pt]
&= e^{2\ln|x|} = e^{\ln x^2} = x^2
\end{aligned}
$$

**Step 3–4 — Multiply by $\mu = x^2$ and collapse the left side:**

$$
\color{purple}
\begin{aligned}
x^2\frac{dy}{dx} + 2x\,y &= 4x^3\\[4pt]
\frac{d}{dx}\big(x^2 y\big) &= 4x^3 \qquad\text{(left side is now an exact product-rule derivative)}
\end{aligned}
$$

**Step 5 — Integrate both sides:**

$$
\color{purple}
\begin{aligned}
\int \frac{d}{dx}\big(x^2 y\big)\,dx &= \int 4x^3\,dx\\[4pt]
x^2 y &= x^4 + C
\end{aligned}
$$

**Step 6 — Solve for $y$:**

$$
\color{purple}
y = x^2 + \frac{C}{x^2}
$$

**Step 7 — Apply $y(1)=2$:**

$$
\color{purple}
\begin{aligned}
2 &= (1)^2 + \frac{C}{(1)^2} = 1 + C\\[4pt]
C &= 1 \;\Longrightarrow\; \boxed{\,y = x^2 + \dfrac{1}{x^2}\,}
\end{aligned}
$$

---

# 3. Exact Equations

## ⚙️ The Core Logic

Write the equation in **differential form**:

$$M(x,y)\,dx + N(x,y)\,dy = 0.$$

This is called **exact** when the left side is the *total differential* of some hidden "potential" function $F(x,y)$:

$$dF = \frac{\partial F}{\partial x}\,dx + \frac{\partial F}{\partial y}\,dy = 0.$$

If such an $F$ exists with $F_x = M$ and $F_y = N$, then $dF=0$ means $F(x,y) = C$ along every solution curve — that single relation *is* the solution.

How do we know $F$ exists? By **Clairaut's theorem** (equality of mixed partials, $F_{xy}=F_{yx}$):

$$\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x} \quad\Longleftrightarrow\quad \text{the equation is exact.}$$

## 🧩 All Possible Cases / Variations

- **Exactness test.** Compute $M_y$ and $N_x$.
  - If $M_y = N_x$ → exact; integrate directly.
  - If $M_y \neq N_x$ → **not exact**; seek an integrating factor (below).
- **Integrating factor for non-exact equations.**
  - If $\dfrac{M_y - N_x}{N}$ is a function of $x$ **only**, then $\mu(x) = e^{\int \frac{M_y - N_x}{N}\,dx}$.
  - If $\dfrac{N_x - M_y}{M}$ is a function of $y$ **only**, then $\mu(y) = e^{\int \frac{N_x - M_y}{M}\,dy}$.
  - Multiply through by $\mu$ to make the equation exact, then proceed.
- **Implicit answers are normal.** The solution $F(x,y)=C$ usually cannot (and need not) be solved explicitly for $y$.
- **Requires rearrangement.** You may need to move terms so it reads cleanly as $M\,dx + N\,dy = 0$.
- **IVP.** Use $y(x_0)=y_0$ to evaluate $C$.

## 📋 Step-by-Step Methodology

1. Arrange as $M\,dx + N\,dy = 0$ and identify $M$ and $N$.
2. Test exactness: is $M_y = N_x$? *(If not, find an integrating factor and restart.)*
3. Integrate $M$ with respect to $x$: $\;F = \displaystyle\int M\,dx + g(y)$ (the "constant" is a function of $y$).
4. Differentiate this $F$ with respect to $y$ and set it equal to $N$ to solve for $g'(y)$.
5. Integrate $g'(y)$ to recover $g(y)$.
6. Write the solution $F(x,y) = C$.
7. Apply the initial condition for $C$.

## ✏️ Worked Example A — Directly Exact

**Solve** $(2xy + 3)\,dx + (x^2 - 1)\,dy = 0.$

**Step 1–2 — Identify and test:**

$$
\color{purple}
\begin{aligned}
M &= 2xy + 3, & N &= x^2 - 1\\[4pt]
M_y &= 2x, & N_x &= 2x\\[4pt]
M_y &= N_x \;\Longrightarrow\; \text{the equation is exact.}
\end{aligned}
$$

**Step 3 — Integrate $M$ in $x$:**

$$
\color{purple}
\begin{aligned}
F(x,y) &= \int (2xy + 3)\,dx + g(y)\\[4pt]
&= x^2 y + 3x + g(y)
\end{aligned}
$$

**Step 4 — Match $F_y$ to $N$:**

$$
\color{purple}
\begin{aligned}
F_y &= x^2 + g'(y) \stackrel{!}{=} N = x^2 - 1\\[4pt]
g'(y) &= -1
\end{aligned}
$$

**Step 5–6 — Recover $g(y)$ and write the solution:**

$$
\color{purple}
\begin{aligned}
g(y) &= -y\\[4pt]
\boxed{\,x^2 y + 3x - y &= C\,}
\end{aligned}
$$

## ✏️ Worked Example B — Non-Exact, Needs an Integrating Factor

**Solve** $(3xy + y^2)\,dx + (x^2 + xy)\,dy = 0.$

**Step 1–2 — Test exactness:**

$$
\color{purple}
\begin{aligned}
M &= 3xy + y^2, & N &= x^2 + xy\\[4pt]
M_y &= 3x + 2y, & N_x &= 2x + y\\[4pt]
M_y &\neq N_x \;\Longrightarrow\; \text{NOT exact.}
\end{aligned}
$$

**Find an integrating factor.** Test the $x$-only criterion:

$$
\color{purple}
\begin{aligned}
\frac{M_y - N_x}{N} &= \frac{(3x + 2y) - (2x + y)}{x^2 + xy}
= \frac{x + y}{x(x + y)} = \frac{1}{x}
\end{aligned}
$$

This depends on $x$ only, so:

$$
\color{purple}
\mu(x) = e^{\int \frac{1}{x}\,dx} = e^{\ln x} = x
$$

**Multiply through by $\mu = x$:**

$$
\color{purple}
(3x^2 y + xy^2)\,dx + (x^3 + x^2 y)\,dy = 0
$$

**Re-test exactness on the new $M^*, N^*$:**

$$
\color{purple}
\begin{aligned}
M^* &= 3x^2 y + xy^2, & N^* &= x^3 + x^2 y\\[4pt]
M^*_y &= 3x^2 + 2xy, & N^*_x &= 3x^2 + 2xy \;\checkmark \;\text{(now exact)}
\end{aligned}
$$

**Integrate $M^*$ in $x$ and match $N^*$:**

$$
\color{purple}
\begin{aligned}
F &= \int (3x^2 y + xy^2)\,dx + g(y) = x^3 y + \tfrac{1}{2}x^2 y^2 + g(y)\\[4pt]
F_y &= x^3 + x^2 y + g'(y) \stackrel{!}{=} N^* = x^3 + x^2 y\\[4pt]
g'(y) &= 0 \;\Longrightarrow\; g(y) = \text{const}\\[6pt]
\boxed{\,x^3 y + \tfrac{1}{2}x^2 y^2 &= C\,}
\end{aligned}
$$

---

# 4. Numerical Approximation — Euler's Method

## ⚙️ The Core Logic

Many IVPs $\;y' = f(x,y),\; y(x_0)=y_0\;$ have no closed-form solution. Euler's method approximates the solution by **walking along tangent lines**.

The derivative gives the *instantaneous slope* of the solution curve. The first-order **Taylor expansion** says that, for a small step $h$,

$$y(x+h) \approx y(x) + h\,y'(x) = y(x) + h\,f\big(x, y(x)\big).$$

So we stand at a known point, read off the slope $f(x,y)$ from the equation itself, take a short straight step in that direction, and repeat. Each step trades a tiny bit of accuracy (the curve bends away from the tangent) for the ability to march forward without integrating. This is *why* it works — and why smaller $h$ gives better accuracy.

## 🧩 All Possible Cases / Variations

- **Step size given directly ($h$)** vs. **number of steps $n$ over an interval $[a,b]$**, in which case $h = \dfrac{b-a}{n}$.
- **Forward (explicit) Euler** is the standard form used here; it only needs values already known.
- **Error behavior.** Local error per step is $O(h^2)$; accumulated (global) error is $O(h)$ — so halving $h$ roughly halves the total error.
- **Comparison to the exact solution.** When an exact solution exists, tabulate it alongside to report the error.
- **More accurate cousins.** *Improved Euler / Heun's method* (a predictor–corrector that averages slopes) and *Runge–Kutta (RK4)* dramatically reduce error for the same $h$.

## 📋 Step-by-Step Methodology

1. Identify $f(x,y)$, the starting point $(x_0, y_0)$, the step size $h$, and the target $x$.
2. Use the iteration formulas:
$$x_{n+1} = x_n + h, \qquad y_{n+1} = y_n + h\,f(x_n, y_n).$$
3. Evaluate the slope $f(x_n, y_n)$ at the **current** point.
4. Step forward to get the next $(x_{n+1}, y_{n+1})$; record it in a table.
5. Repeat until you reach the target $x$-value.
6. *(Optional)* Compare to the exact solution to compute the error.

## ✏️ Worked Example

**Approximate** $y(0.3)$ for $\;\dfrac{dy}{dx} = x + y,\quad y(0)=1,\;$ using $h = 0.1$.

Here $f(x,y) = x + y$, $\;x_0 = 0$, $\;y_0 = 1$. Iterate $y_{n+1} = y_n + h\,(x_n + y_n)$:

**Step 1** $(n=0)$:

$$
\color{purple}
\begin{aligned}
f(x_0, y_0) &= 0 + 1 = 1\\[4pt]
y_1 &= y_0 + h\,f(x_0,y_0) = 1 + (0.1)(1) = 1.100\\[4pt]
x_1 &= 0 + 0.1 = 0.1
\end{aligned}
$$

**Step 2** $(n=1)$:

$$
\color{purple}
\begin{aligned}
f(x_1, y_1) &= 0.1 + 1.100 = 1.200\\[4pt]
y_2 &= 1.100 + (0.1)(1.200) = 1.220\\[4pt]
x_2 &= 0.1 + 0.1 = 0.2
\end{aligned}
$$

**Step 3** $(n=2)$:

$$
\color{purple}
\begin{aligned}
f(x_2, y_2) &= 0.2 + 1.220 = 1.420\\[4pt]
y_3 &= 1.220 + (0.1)(1.420) = 1.362\\[4pt]
x_3 &= 0.2 + 0.1 = 0.3
\end{aligned}
$$

**Result:** $\quad\color{purple}{\boxed{\,y(0.3) \approx 1.362\,}}$

**Iteration summary table:**

<table>
  <thead>
    <tr style="color: purple;">
      <th>$n$</th><th>$x_n$</th><th>$y_n$</th><th>slope $f(x_n,y_n)=x_n+y_n$</th><th>$y_{n+1}=y_n+h\,f$</th>
    </tr>
  </thead>
  <tbody style="color: purple;">
    <tr><td>0</td><td>0.0</td><td>1.000</td><td>1.000</td><td>1.100</td></tr>
    <tr><td>1</td><td>0.1</td><td>1.100</td><td>1.200</td><td>1.220</td></tr>
    <tr><td>2</td><td>0.2</td><td>1.220</td><td>1.420</td><td>1.362</td></tr>
    <tr><td>3</td><td>0.3</td><td>1.362</td><td>—</td><td>—</td></tr>
  </tbody>
</table>

**Accuracy check.** This IVP *does* have an exact solution, $y = 2e^{x} - x - 1$. At $x=0.3$:

$$
\color{purple}
\begin{aligned}
y_{\text{exact}}(0.3) &= 2e^{0.3} - 0.3 - 1 \approx 2(1.349859) - 1.3 \approx 1.39972\\[4pt]
\text{Error} &= |\,1.39972 - 1.362\,| \approx 0.038
\end{aligned}
$$

The approximation undershoots because the true solution is concave up — the tangent lines consistently fall below the curve. Using a smaller $h$ (or Heun/RK4) would shrink this gap.

---

## 🗺️ Quick-Reference Decision Map

Given $\dfrac{dy}{dx} = f(x,y)$ — or $M\,dx + N\,dy = 0$ — ask in order:

1. **Does $f$ factor as $g(x)\,h(y)$?** → **Separable** (separate & integrate).
2. **Can it be written $y' + P(x)y = Q(x)$?** → **Linear** (integrating factor $\mu = e^{\int P\,dx}$).
3. **In form $M\,dx + N\,dy = 0$ with $M_y = N_x$?** → **Exact** (find potential $F$, set $F=C$).
   - If $M_y \neq N_x$, try an integrating factor $\mu(x)$ or $\mu(y)$ to *make* it exact.
4. **No closed form / need a numerical value?** → **Euler's Method** (step along tangents).

> Many equations fit more than one category (e.g., a homogeneous linear equation is also separable) — pick whichever path is cleanest.
