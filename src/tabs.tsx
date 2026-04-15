import React from "react";
import {
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Coffee,
  Info,
  Play,
  Pause,
  Copy,
  TimerReset,
} from "lucide-react";
import { getLabelClasses } from "./helpers";
import {
  PLACEHOLDER_GIF,
  flowOrder,
  timerPresets,
  workoutFlows,
} from "./workoutFlows";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`rounded-3xl border-4 border-black ${className}`}>{children}</div>;
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 md:p-5 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={`font-bold ${className}`}>{children}</h2>;
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 md:p-5 ${className}`}>{children}</div>;
}

export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${className}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  className = "",
  variant,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "default";
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl border-2 border-black px-4 py-3 text-sm font-medium transition-colors";
  const style =
    variant === "outline"
      ? "bg-white text-black hover:bg-[#f3f3f3]"
      : "bg-black text-white hover:opacity-90";

  return (
    <button {...props} className={`${base} ${style} ${className}`}>
      {children}
    </button>
  );
}

export function Progress({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const safe = Math.max(0, Math.min(100, value || 0));
  return (
    <div className={`h-4 overflow-hidden rounded-full bg-white ${className}`}>
      <div
        className="h-full border-r-2 border-black bg-[#febdcd]"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}

export function Checkbox({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange?: () => void;
}) {
  return (
    <input
      type="checkbox"
      checked={!!checked}
      onChange={onCheckedChange}
      className="h-4 w-4 accent-black"
    />
  );
}

export function PixelCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`shadow-[12px_12px_0_0_rgba(0,0,0,1)] ${className}`}>
      {children}
    </Card>
  );
}

export function StepInfo({ step }: { step: any }) {
  if (!step) return null;

  if (step.instruction) {
    return (
      <div className="mb-5 space-y-3 rounded-2xl border-2 border-black bg-white p-4">
        <div>
          <p className="mb-1 font-semibold">Instruction</p>
          <p>{step.instruction}</p>
        </div>
        <div>
          <p className="mb-1 font-semibold">What it should feel like</p>
          <p>{step.feel}</p>
        </div>
        <div>
          <p className="mb-1 font-semibold">Mistake to avoid</p>
          <p>{step.avoid}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-2xl border-2 border-black bg-white p-4">
      <p className="mb-1 font-semibold">
        {step.label === "rest" ? "Rest reminder" : "Helpful tip"}
      </p>
      <p>{step.tip}</p>
    </div>
  );
}

export function HomeTab(props: any) {
  const {
    today,
    toggleDaily,
    dailyPercent,
    requiredDailyCount,
    weeklyPattern,
    activeFlow,
    todaysPlanText,
    selectedFlow,
    statusText,
    workoutProgress,
    completedStepIds,
    resetSelectedFlow,
    setTab,
    startDate,
    setStartDate,
    daysSinceStart,
    weekNumber,
  } = props;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <PixelCard className="bg-[#c8e3f4]">
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Routine Reminder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <p className="mb-2 font-semibold">Every day</p>
              <p className="text-sm">
                Do your daily basics like steps, plank, posture, and quick reset work.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <p className="mb-2 font-semibold">Workout days (3x/week)</p>
              <p className="text-sm">Alternate Day A / Day B / Day A, next week switch.</p>
              <p className="mt-2 text-sm">{weeklyPattern}</p>
            </div>
          </CardContent>
        </PixelCard>

        <PixelCard>
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Daily Quests (basic!!)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["steps", "10k–15k steps"],
              ["plank", "2-minute plank"],
              ["posture", "Posture check"],
              ["deskFix", "Desk job fix"],
              ["addon", "Optional add-on"],
            ].map(([key, label]) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-black p-4 ${
                  key === "addon" ? "border-dashed bg-[#ffd8ef]" : "bg-[#fff9fb]"
                }`}
              >
                <Checkbox checked={today[key]} onCheckedChange={() => toggleDaily(key)} />
                <span className="flex items-center gap-2 font-medium">
                  {label}
                  {key === "addon" && (
                    <Badge className="border-black bg-white text-black">optional</Badge>
                  )}
                </span>
              </label>
            ))}

            <div className="pt-2">
              <p className="mb-2 text-sm font-semibold">Daily progress</p>
              <Progress value={dailyPercent} className="border border-black" />
              <p className="mt-2 text-sm">{requiredDailyCount} / 4 completed</p>
              <p className="mt-2 text-xs text-slate-600">
                Optional add-on does not count toward the basic daily bar.
              </p>
            </div>
          </CardContent>
        </PixelCard>
      </div>

      <div className="space-y-6">
        <PixelCard>
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Workout Flow Helper</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <p className="text-sm font-semibold">Selected flow</p>
              <h2 className="mt-2 text-xl font-bold">{activeFlow.title}</h2>
              <p className="mt-2 text-sm text-slate-700">{activeFlow.description}</p>
              <p className="mt-3 text-sm">{todaysPlanText[selectedFlow]}</p>
            </div>

            <div className="rounded-2xl border-2 border-black bg-[#fff5c4] p-4">
              <p className="mb-2 text-sm font-semibold">Encouraging status</p>
              <p className="text-sm">{statusText}</p>
            </div>

            <Progress value={workoutProgress} className="border border-black" />
            <p className="text-sm">
              {completedStepIds.length} / {activeFlow.steps.length} steps finished in this flow
            </p>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setTab("workout")}>
                Start or continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={resetSelectedFlow} variant="outline">
                Reset selected flow
              </Button>
            </div>
          </CardContent>
        </PixelCard>

        <PixelCard className="bg-[#febdcd]">
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Routine Counter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <label className="mb-2 block text-sm font-semibold">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-black bg-white p-4">
                <p className="text-sm font-semibold">Days since start</p>
                <p className="mt-3 text-3xl font-bold">{daysSinceStart || 0}</p>
              </div>
              <div className="rounded-2xl border-2 border-black bg-white p-4">
                <p className="text-sm font-semibold">Current week</p>
                <p className="mt-3 text-3xl font-bold">{weekNumber || 0}</p>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <p className="mb-2 text-sm font-semibold">Shape change timeline reminder</p>
              <p className="text-sm">2–4 weeks: arms feel tighter, posture improves.</p>
              <p className="mt-2 text-sm">
                4–8 weeks: shoulders may start looking wider, chest looks more like muscle.
              </p>
              <p className="mt-2 text-sm">
                8–12 weeks: more noticeable triangle illusion and stronger upper-body look.
              </p>
            </div>
          </CardContent>
        </PixelCard>
      </div>
    </div>
  );
}

export function WorkoutTab(props: any) {
  const {
    selectedFlow,
    setSelectedFlow,
    activeFlow,
    activeProgress,
    currentStepIndex,
    currentStep,
    completedStepIds,
    workoutProgress,
    finishMessageMap,
    resetSelectedFlow,
    setTab,
    markCurrentStepDone,
    nextStep,
  } = props;

  const [stepSeconds, setStepSeconds] = React.useState(0);
const [isStepRunning, setIsStepRunning] = React.useState(false);

function parseTimeToSeconds(detail: string) {
  if (!detail) return 0;

  const secMatch = detail.match(/(\d+)\s*sec/i);
  if (secMatch) return parseInt(secMatch[1], 10);

  const minMatch = detail.match(/(\d+)\s*min/i);
  if (minMatch) return parseInt(minMatch[1], 10) * 60;

  return 0;
}

function formatStepTime(total: number) {
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

React.useEffect(() => {
  const seconds = parseTimeToSeconds(currentStep?.detail || "");
  setStepSeconds(seconds);
  setIsStepRunning(false);
}, [currentStep]);

React.useEffect(() => {
  if (!isStepRunning || stepSeconds <= 0) return;

  const interval = setInterval(() => {
    setStepSeconds((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [isStepRunning, stepSeconds]);

  return (
    <div className="space-y-6">
      <PixelCard>
        <CardHeader>
          <CardTitle className="text-sm md:text-base">Choose Your Flow</CardTitle>
        </CardHeader>
<CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
  {flowOrder.map((flowKey) => {
    const flow = workoutFlows[flowKey];
    const isActive = selectedFlow === flowKey;

    return (
      <Button
        key={flowKey}
        onClick={() => setSelectedFlow(flowKey)}
        variant={isActive ? "default" : "outline"}
        className={`h-auto min-h-[96px] items-start justify-start px-4 py-4 text-left whitespace-normal ${
          isActive ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex flex-col items-start gap-2">
          <span className="text-[11px] font-bold">{flow.shortTitle}</span>
          <span className="text-[10px] leading-4">{flow.title}</span>
        </div>
      </Button>
    );
  })}
</CardContent>
      </PixelCard>

      <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <PixelCard>
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Follow Along</CardTitle>
          </CardHeader>
          <CardContent>
            {activeProgress.isFinished ? (
              <div className="rounded-3xl border-2 border-black bg-[#fff9fb] p-4 md:p-6">
                <div className="mb-5 rounded-2xl border-2 border-black bg-[#d9f7e6] p-5">
                  <p className="mb-2 text-sm font-semibold">Flow complete</p>
                  <h2 className="text-2xl font-bold md:text-3xl">You finished this flow!</h2>
                  <p className="mt-3 text-base">Total steps completed: {completedStepIds.length}</p>
                  <p className="mt-3 text-sm text-slate-700">{finishMessageMap[selectedFlow]}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={resetSelectedFlow} className="bg-[#febdcd] text-black">
                    Restart flow
                  </Button>
                  <Button onClick={() => setTab("home")}>Go home</Button>
                  <Button onClick={() => setSelectedFlow("dayA")} variant="outline">
                    Choose another flow
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-3xl border-2 border-black p-4 md:p-5 ${
                  currentStep.label === "rest" ? "bg-[#eaf6ff]" : "bg-[#fff9fb]"
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Step {currentStepIndex + 1} of {activeFlow.steps.length}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold md:text-3xl">{currentStep.name}</h2>
                    <p className="mt-2 text-lg">{currentStep.detail}</p>
{parseTimeToSeconds(currentStep.detail) > 0 && (
  <div className="mt-4 rounded-3xl border-2 border-black bg-white p-5">
    <p className="mb-3 text-sm font-semibold">Step Timer</p>

    <div className="rounded-3xl border-4 border-black bg-[#fff5fb] px-6 py-8 text-center">
      <div className="text-4xl md:text-6xl font-bold tracking-wide">
        {formatStepTime(stepSeconds)}
      </div>
    </div>

    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
      <Button
        onClick={() => setIsStepRunning(true)}
        className="h-14 w-14 rounded-2xl p-0"
        aria-label="Start timer"
      >
        <Play className="h-5 w-5" />
      </Button>

      <Button
        onClick={() => setIsStepRunning(false)}
        variant="outline"
        className="h-14 w-14 rounded-2xl bg-white p-0 text-black"
        aria-label="Pause timer"
      >
        <Pause className="h-5 w-5" />
      </Button>

      <Button
        onClick={() => {
          setStepSeconds(parseTimeToSeconds(currentStep.detail));
          setIsStepRunning(false);
        }}
        className="h-14 w-14 rounded-2xl bg-[#febdcd] p-0 text-black"
        aria-label="Reset timer"
      >
        <TimerReset className="h-5 w-5" />
      </Button>
    </div>
  </div>
)}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`border ${getLabelClasses(currentStep.label)}`}>
                      {currentStep.label}
                    </Badge>
                    {completedStepIds.includes(currentStep.id) && (
                      <CheckCircle2 className="h-8 w-8" />
                    )}
                  </div>
                </div>

                {currentStep.label === "rest" && (
                  <div className="mb-4 flex items-center gap-2 rounded-2xl border-2 border-black bg-white p-4">
                    <Coffee className="h-5 w-5" />
                    <p className="font-semibold">Rest step — breathe and reset.</p>
                  </div>
                )}

                <div className="mb-4 overflow-hidden rounded-3xl border-4 border-black bg-white">
                  <img
                    src={currentStep.visual || PLACEHOLDER_GIF}
                    alt={currentStep.name}
                    className="h-[280px] w-full object-cover md:h-[360px]"
                  />
                </div>

                <StepInfo step={currentStep} />

                <div className="flex flex-wrap gap-3">
                  <Button onClick={markCurrentStepDone} className="bg-[#febdcd] text-black">
                    Mark done
                  </Button>
                  <Button onClick={nextStep}>
                    Next step
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={resetSelectedFlow} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset flow
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </PixelCard>

        <div className="space-y-6">
          <PixelCard className="bg-[#c8e3f4]">
            <CardHeader>
              <CardTitle className="text-sm md:text-base">Flow Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-2xl border-2 border-black bg-white p-4">
                <p className="font-semibold">{activeFlow.title}</p>
                <p className="mt-2 text-sm text-slate-700">{activeFlow.goal}</p>
              </div>
              <Progress value={workoutProgress} className="border border-black" />
              <p className="mt-3 text-sm">
                {completedStepIds.length} / {activeFlow.steps.length} finished
              </p>
            </CardContent>
          </PixelCard>

<PixelCard>
  <CardHeader>
    <CardTitle className="text-sm md:text-base">Step List</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    {activeFlow.steps.map((step: any, index: number) => {
      const done = completedStepIds.includes(step.id);
      const active = index === currentStepIndex && !activeProgress.isFinished;

      return (
        <div
          key={step.id}
          className={`rounded-2xl border-2 border-black p-3 ${
            active ? "bg-[#febdcd]" : step.label === "rest" ? "bg-[#eef8ff]" : "bg-white"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-5 break-words">{step.name}</p>
              <p className="mt-1 text-xs text-slate-700">{step.detail}</p>
              <div className="mt-2">
                <Badge className={`border ${getLabelClasses(step.label)}`}>{step.label}</Badge>
              </div>
            </div>

            {done ? (
              <Badge className="shrink-0 rounded-full bg-black text-white">Done</Badge>
            ) : active ? (
              <Badge className="shrink-0 rounded-full border-black bg-white text-black">
                Current
              </Badge>
            ) : (
              <Badge className="shrink-0 rounded-full border-black bg-white text-black">
                Pending
              </Badge>
            )}
          </div>
        </div>
      );
    })}
  </CardContent>
</PixelCard>

          {selectedFlow === "postureCheck" && (
            <PixelCard>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Why posture matters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 rounded-2xl border-2 border-black bg-[#fff9fb] p-4">
                  <Info className="mt-0.5 h-5 w-5 shrink-0" />
                  <div className="space-y-2 text-sm">
                    <p>• Can make the upper body look more structured.</p>
                    <p>• Can improve comfort.</p>
                    <p>• Helps support a broader-looking silhouette.</p>
                  </div>
                </div>
              </CardContent>
            </PixelCard>
          )}
        </div>
      </div>
    </div>
  );
}

export function TimerTab(props: any) {
  const { secondsLeft, setSecondsLeft, setIsRunning, formatTime } = props;

  return (
    <div className="mx-auto max-w-2xl">
      <PixelCard className="bg-[#c8e3f4]">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">Focus Timer</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-5 rounded-3xl border-4 border-black bg-white px-4 py-10">
            <p className="text-5xl font-bold tracking-tight md:text-6xl">{formatTime(secondsLeft)}</p>
            <p className="mt-3 text-sm text-slate-600">
              Use this for rests, planks, stretches, or mini challenges.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
            {timerPresets.map((preset) => (
  <Button
    key={preset}
    onClick={() => {
      setSecondsLeft(preset);
      setIsRunning(false);
    }}
    variant="outline"
    className="min-h-[72px] flex-col gap-2 bg-white text-black"
  >
    <span className="text-[11px] font-bold">
      {preset >= 60 ? `${preset / 60} min` : `${preset} sec`}
    </span>
  </Button>
))}
          </div>

          <div className="mt-2 flex flex-wrap justify-center gap-4">
<Button onClick={() => setIsRunning(true)} className="min-w-[160px]">
  <Play className="mr-2 h-4 w-4" />
  Start
</Button>

<Button
  onClick={() => setIsRunning(false)}
  variant="outline"
  className="min-w-[160px] bg-white text-black"
>
  <Pause className="mr-2 h-4 w-4" />
  Pause
</Button>

<Button
  onClick={() => {
    setIsRunning(false);
    setSecondsLeft(60);
  }}
  className="min-w-[160px] bg-[#febdcd] text-black"
>
  <RotateCcw className="mr-2 h-4 w-4" />
  Reset
</Button>
          </div>
        </CardContent>
      </PixelCard>
    </div>
  );
}

export function ProgressTab(props: any) {
  const {
    progressForm,
    handleProgressFormChange,
    saveProgressEntry,
    copySummary,
    copied,
    progressEntries,
    daysSinceStart,
    weekNumber,
    weeklyPattern,
  } = props;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <PixelCard>
        <CardHeader>
          <CardTitle className="text-sm md:text-base">Progress Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold">Date</label>
            <input
              type="date"
              value={progressForm.date}
              onChange={(e) => handleProgressFormChange("date", e.target.value)}
              className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Workout type</label>
            <select
              value={progressForm.workoutType}
              onChange={(e) => handleProgressFormChange("workoutType", e.target.value)}
              className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3"
            >
              <option>Day A</option>
              <option>Day B</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Push-ups max reps</label>
            <input
              type="number"
              min="0"
              value={progressForm.pushupsMax}
              onChange={(e) => handleProgressFormChange("pushupsMax", e.target.value)}
              className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3"
              placeholder="Example: 8"
            />
          </div>

          {[
            ["rowsDifficulty", "Rows difficulty"],
            ["lateralRaisesDifficulty", "Lateral raises difficulty"],
            ["overallDifficulty", "Overall workout difficulty"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="mb-2 block text-sm font-semibold">{label}</label>
              <select
                value={progressForm[key]}
                onChange={(e) => handleProgressFormChange(key, e.target.value)}
                className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          ))}

          <div>
            <label className="mb-2 block text-sm font-semibold">Notes</label>
            <textarea
              value={progressForm.notes}
              onChange={(e) => handleProgressFormChange("notes", e.target.value)}
              className="min-h-[120px] w-full rounded-2xl border-2 border-black bg-white px-4 py-3"
              placeholder="Example: arms sore but manageable"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={saveProgressEntry} className="bg-[#febdcd] text-black">
              Save entry
            </Button>
            <Button onClick={copySummary}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Summary
            </Button>
          </div>

          {copied && <p className="text-sm">Summary copied to clipboard.</p>}
        </CardContent>
      </PixelCard>

      <div className="space-y-6">
        <PixelCard className="bg-[#c8e3f4]">
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Progress Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-black bg-white p-4">
                <p className="text-sm font-semibold">Days since start</p>
                <p className="mt-3 text-3xl font-bold">{daysSinceStart || 0}</p>
              </div>
              <div className="rounded-2xl border-2 border-black bg-white p-4">
                <p className="text-sm font-semibold">Current week</p>
                <p className="mt-3 text-3xl font-bold">{weekNumber || 0}</p>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <p className="mb-2 text-sm font-semibold">Weekly pattern</p>
              <p className="text-sm">{weeklyPattern}</p>
            </div>
          </CardContent>
        </PixelCard>

        <PixelCard>
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Saved Entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressEntries.length === 0 ? (
              <div className="rounded-2xl border-2 border-black bg-[#fff9fb] p-4 text-sm">
                No entries yet. Your first saved workout log will show up here.
              </div>
            ) : (
              progressEntries
                .slice()
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry: any) => (
                  <div key={entry.id} className="rounded-2xl border-2 border-black bg-white p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{entry.workoutType}</p>
                        <p className="text-sm text-slate-700">{entry.date}</p>
                      </div>
                      <Badge className="border-black bg-[#febdcd] text-black">
                        {entry.overallDifficulty}
                      </Badge>
                    </div>

                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <p><span className="font-semibold">Push-ups max:</span> {entry.pushupsMax || "—"}</p>
                      <p><span className="font-semibold">Rows:</span> {entry.rowsDifficulty}</p>
                      <p><span className="font-semibold">Lateral raises:</span> {entry.lateralRaisesDifficulty}</p>
                      <p><span className="font-semibold">Overall:</span> {entry.overallDifficulty}</p>
                    </div>

                    <div className="mt-3 rounded-xl border border-black bg-[#fff9fb] p-3 text-sm">
                      <span className="font-semibold">Notes:</span> {entry.notes || "No notes yet"}
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </PixelCard>
      </div>
    </div>
  );
}
