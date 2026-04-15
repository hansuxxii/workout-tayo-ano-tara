import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Home, Dumbbell, TimerReset, Sparkles, ScrollText } from "lucide-react";
import {
  buildProgressSummary,
  emptyProgressEntry,
  getDayDifference,
  getWeekNumber,
  getWeeklyPattern,
} from "./helpers";
import { dailyDefaults, workoutFlows } from "./workoutFlows";
import {
  HomeTab,
  PixelCard,
  ProgressTab,
  TimerTab,
  WorkoutTab,
  Button,
  Badge,
  CardContent,
} from "./tabs";

function getDefaultFlowProgress() {
  return Object.fromEntries(
    Object.keys(workoutFlows).map((key) => [
      key,
      { currentStep: 0, completedStepIds: [], isFinished: false },
    ])
  );
}

export default function WorkoutTayoAnoTaraApp() {
  const [tab, setTab] = useState("home");
  const [today, setToday] = useState(dailyDefaults);
  const [selectedFlow, setSelectedFlow] = useState("dayA");
  const [flowProgress, setFlowProgress] = useState(getDefaultFlowProgress());
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [progressEntries, setProgressEntries] = useState<any[]>([]);
  const [progressForm, setProgressForm] = useState(emptyProgressEntry());
  const [copied, setCopied] = useState(false);

  const activeFlow = workoutFlows[selectedFlow as keyof typeof workoutFlows];
  const activeProgress =
    flowProgress[selectedFlow as keyof typeof flowProgress] ||
    getDefaultFlowProgress()[selectedFlow as keyof typeof flowProgress];
  const currentStepIndex = Math.min(activeProgress.currentStep, activeFlow.steps.length - 1);
  const currentStep = activeFlow.steps[currentStepIndex];
  const completedStepIds = activeProgress.completedStepIds || [];

  useEffect(() => {
    const savedChecklist = localStorage.getItem("workout-tayo-daily");
    const savedSelectedFlow = localStorage.getItem("workout-tayo-selected-flow");
    const savedFlowProgress = localStorage.getItem("workout-tayo-flow-progress");
    const savedExercise = localStorage.getItem("workout-tayo-current-exercise");
    const savedCompleted = localStorage.getItem("workout-tayo-completed");
    const savedStartDate = localStorage.getItem("workout-tayo-start-date");
    const savedProgressEntries = localStorage.getItem("workout-tayo-progress-entries");

    if (savedChecklist) {
      try {
        setToday({ ...dailyDefaults, ...JSON.parse(savedChecklist) });
      } catch {}
    }

    if (savedSelectedFlow && workoutFlows[savedSelectedFlow as keyof typeof workoutFlows]) {
      setSelectedFlow(savedSelectedFlow);
    }

    if (savedFlowProgress) {
      try {
        setFlowProgress({ ...getDefaultFlowProgress(), ...JSON.parse(savedFlowProgress) });
      } catch {}
    } else if (savedExercise || savedCompleted) {
      const legacyCurrent = savedExercise ? Number(savedExercise) : 0;
      const legacyCompleted = savedCompleted ? JSON.parse(savedCompleted) : [];
      setFlowProgress((prev) => ({
        ...prev,
        dayA: {
          currentStep: Number.isFinite(legacyCurrent) ? legacyCurrent : 0,
          completedStepIds: Array.isArray(legacyCompleted) ? legacyCompleted : [],
          isFinished: false,
        },
      }));
    }

    setStartDate(savedStartDate || new Date().toISOString().slice(0, 10));

    if (savedProgressEntries) {
      try {
        setProgressEntries(JSON.parse(savedProgressEntries));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("workout-tayo-daily", JSON.stringify(today));
  }, [today]);

  useEffect(() => {
    localStorage.setItem("workout-tayo-selected-flow", selectedFlow);
  }, [selectedFlow]);

  useEffect(() => {
    localStorage.setItem("workout-tayo-flow-progress", JSON.stringify(flowProgress));
    const active =
      flowProgress[selectedFlow as keyof typeof flowProgress] || {
        currentStep: 0,
        completedStepIds: [],
        isFinished: false,
      };
    localStorage.setItem("workout-tayo-current-exercise", String(active.currentStep));
    localStorage.setItem("workout-tayo-completed", JSON.stringify(active.completedStepIds));
  }, [flowProgress, selectedFlow]);

  useEffect(() => {
    if (startDate) localStorage.setItem("workout-tayo-start-date", startDate);
  }, [startDate]);

  useEffect(() => {
    localStorage.setItem("workout-tayo-progress-entries", JSON.stringify(progressEntries));
  }, [progressEntries]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const workoutProgress = useMemo(
    () => (completedStepIds.length / activeFlow.steps.length) * 100,
    [completedStepIds.length, activeFlow.steps.length]
  );

  const requiredDailyCount = [today.steps, today.plank, today.posture, today.deskFix].filter(Boolean).length;
  const dailyPercent = (requiredDailyCount / 4) * 100;
  const daysSinceStart = getDayDifference(startDate);
  const weekNumber = getWeekNumber(startDate);
  const weeklyPattern = getWeeklyPattern(weekNumber);

  const statusText =
    requiredDailyCount === 4
      ? "You finished today’s basics. That’s a really nice win."
      : requiredDailyCount >= 3
      ? "You’re building momentum. Soft and steady still counts."
      : "Start with one gentle task. One small check mark is still progress.";

  const todaysPlanText = {
    dayA: "A nice pick for shoulder width, chest support, and a broader-looking upper body.",
    dayB: "A nice pick for back strength, posture support, and arm definition.",
    dailyAddon: "A small bonus quest when you want an extra accomplishment.",
    postureCheck: "A low-pressure guided reset that can help your upper body feel more structured.",
    deskJobFix: "A quick body reset for sitting days, stiffness, and posture.",
  };

  const finishMessageMap = {
    dayA: "Nice work. You gave your shoulders and chest a really solid session.",
    dayB: "Nice work. Your back and arms got a full, supportive session today.",
    dailyAddon: "Tiny bonus quests still count. That was a real accomplishment.",
    postureCheck: "That kind of gentle alignment work can make a real difference over time.",
    deskJobFix: "That reset can help your body feel more open and less stuck.",
  };

  function toggleDaily(key: string) {
    setToday((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  }

  function updateSelectedFlowProgress(updater: any) {
    setFlowProgress((prev) => ({
      ...prev,
      [selectedFlow]: updater(
        prev[selectedFlow as keyof typeof prev] || {
          currentStep: 0,
          completedStepIds: [],
          isFinished: false,
        }
      ),
    }));
  }

  function markCurrentStepDone() {
    if (!currentStep) return;
    updateSelectedFlowProgress((prev: any) => ({
      ...prev,
      completedStepIds: prev.completedStepIds.includes(currentStep.id)
        ? prev.completedStepIds
        : [...prev.completedStepIds, currentStep.id],
    }));
  }

  function nextStep() {
    if (!currentStep) return;
    updateSelectedFlowProgress((prev: any) => {
      const updatedCompleted = prev.completedStepIds.includes(currentStep.id)
        ? prev.completedStepIds
        : [...prev.completedStepIds, currentStep.id];
      const nextIndex = prev.currentStep + 1;
      const finished = nextIndex >= activeFlow.steps.length;

      return {
        ...prev,
        completedStepIds: updatedCompleted,
        currentStep: finished ? activeFlow.steps.length : nextIndex,
        isFinished: finished,
      };
    });
  }

  function resetSelectedFlow() {
    setFlowProgress((prev) => ({
      ...prev,
      [selectedFlow]: { currentStep: 0, completedStepIds: [], isFinished: false },
    }));
  }

  function handleProgressFormChange(key: string, value: string) {
    setProgressForm((prev) => ({ ...prev, [key]: value }));
  }

  function saveProgressEntry() {
    const entry = { ...progressForm, id: `${Date.now()}` };
    setProgressEntries((prev) =>
      [entry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    setProgressForm(emptyProgressEntry());
  }

  async function copySummary() {
    const summary = buildProgressSummary(progressEntries, startDate);
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function formatTime(total: number) {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div
      className="min-h-screen bg-[#fff9fb] p-4 text-black md:p-8"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <PixelCard className="bg-[#febdcd]">
            <CardContent className="p-5 md:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <Badge className="border-black bg-white text-black">Cozy workout mode</Badge>
                  </div>
                  <h1 className="text-lg leading-relaxed md:text-2xl">Workout tayo, ano tara?!</h1>
                  <p
                    className="mt-3 font-sans text-[10px] leading-6 md:text-xs"
                    style={{ fontFamily: "ui-sans-serif, system-ui" }}
                  >
                    A visual home workout buddy built to feel like parang naglalaro ka lang (mindset ba mindset ba)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                    <Button
                      onClick={() => setTab("home")}
                      variant="outline"
                      className="h-auto min-h-[72px] flex-col gap-2 bg-white text-black"
                    >
                      <Home className="h-5 w-5 text-black" />
                      <span className="text-[10px] text-black">Home</span>
                     </Button>
                  
                     <Button
                        onClick={() => setTab("workout")}
                        variant="outline"
                        className="h-auto min-h-[72px] flex-col gap-2 bg-white text-black"
                      >
                        <Dumbbell className="h-5 w-5 text-black" />
                        <span className="text-[10px] text-black">Workout</span>
                     </Button>
                  
                     <Button
                        onClick={() => setTab("timer")}
                        variant="outline"
                        className="h-auto min-h-[72px] flex-col gap-2 bg-white text-black"
                      >
                        <TimerReset className="h-5 w-5 text-black" />
                        <span className="text-[10px] text-black">Timer</span>
                      </Button>
                  
                     <Button
                        onClick={() => setTab("progress")}
                        variant="outline"
                        className="h-auto min-h-[72px] flex-col gap-2 bg-white text-black"
                     >
                        <ScrollText className="h-5 w-5 text-black" />
                        <span className="text-[10px] text-black">Progress</span>
                      </Button>
                </div>
              </div>
            </CardContent>
          </PixelCard>
        </motion.div>

        {tab === "home" && (
          <HomeTab
            today={today}
            toggleDaily={toggleDaily}
            dailyPercent={dailyPercent}
            requiredDailyCount={requiredDailyCount}
            weeklyPattern={weeklyPattern}
            activeFlow={activeFlow}
            todaysPlanText={todaysPlanText}
            selectedFlow={selectedFlow}
            statusText={statusText}
            workoutProgress={workoutProgress}
            completedStepIds={completedStepIds}
            resetSelectedFlow={resetSelectedFlow}
            setTab={setTab}
            startDate={startDate}
            setStartDate={setStartDate}
            daysSinceStart={daysSinceStart}
            weekNumber={weekNumber}
          />
        )}

        {tab === "workout" && (
          <WorkoutTab
            selectedFlow={selectedFlow}
            setSelectedFlow={setSelectedFlow}
            activeFlow={activeFlow}
            activeProgress={activeProgress}
            currentStepIndex={currentStepIndex}
            currentStep={currentStep}
            completedStepIds={completedStepIds}
            workoutProgress={workoutProgress}
            finishMessageMap={finishMessageMap}
            resetSelectedFlow={resetSelectedFlow}
            setTab={setTab}
            markCurrentStepDone={markCurrentStepDone}
            nextStep={nextStep}
          />
        )}

        {tab === "timer" && (
          <TimerTab
            secondsLeft={secondsLeft}
            setSecondsLeft={setSecondsLeft}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            formatTime={formatTime}
          />
        )}

        {tab === "progress" && (
          <ProgressTab
            progressForm={progressForm}
            handleProgressFormChange={handleProgressFormChange}
            saveProgressEntry={saveProgressEntry}
            copySummary={copySummary}
            copied={copied}
            progressEntries={progressEntries}
            daysSinceStart={daysSinceStart}
            weekNumber={weekNumber}
            weeklyPattern={weeklyPattern}
          />
        )}
      </div>
    </div>
  );
}
