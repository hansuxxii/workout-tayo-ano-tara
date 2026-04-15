import React, { useEffect, useMemo, useState } from "react";
  }, [isRunning, secondsLeft]);

  const workoutProgress = useMemo(() => (completedStepIds.length / activeFlow.steps.length) * 100, [completedStepIds.length, activeFlow.steps.length]);
  const requiredDailyCount = [today.steps, today.plank, today.posture, today.deskFix].filter(Boolean).length;
  const dailyPercent = (requiredDailyCount / 4) * 100;
  const daysSinceStart = getDayDifference(startDate);
  const weekNumber = getWeekNumber(startDate);
  const weeklyPattern = getWeeklyPattern(weekNumber);
  const statusText = requiredDailyCount === 4 ? "You finished today’s basics. That’s a really nice win." : requiredDailyCount >= 3 ? "You’re building momentum. Soft and steady still counts." : "Start with one gentle task. One small check mark is still progress.";
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

  function toggleDaily(key: string) { setToday((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] })); }
  function updateSelectedFlowProgress(updater: any) { setFlowProgress((prev) => ({ ...prev, [selectedFlow]: updater(prev[selectedFlow as keyof typeof prev] || { currentStep: 0, completedStepIds: [], isFinished: false }) })); }
  function markCurrentStepDone() { if (!currentStep) return; updateSelectedFlowProgress((prev: any) => ({ ...prev, completedStepIds: prev.completedStepIds.includes(currentStep.id) ? prev.completedStepIds : [...prev.completedStepIds, currentStep.id] })); }
  function nextStep() { if (!currentStep) return; updateSelectedFlowProgress((prev: any) => { const updatedCompleted = prev.completedStepIds.includes(currentStep.id) ? prev.completedStepIds : [...prev.completedStepIds, currentStep.id]; const nextIndex = prev.currentStep + 1; const finished = nextIndex >= activeFlow.steps.length; return { ...prev, completedStepIds: updatedCompleted, currentStep: finished ? activeFlow.steps.length : nextIndex, isFinished: finished }; }); }
  function resetSelectedFlow() { setFlowProgress((prev) => ({ ...prev, [selectedFlow]: { currentStep: 0, completedStepIds: [], isFinished: false } })); }
  function handleProgressFormChange(key: string, value: string) { setProgressForm((prev) => ({ ...prev, [key]: value })); }
  function saveProgressEntry() { const entry = { ...progressForm, id: `${Date.now()}` }; setProgressEntries((prev) => [entry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())); setProgressForm(emptyProgressEntry()); }
  async function copySummary() { const summary = buildProgressSummary(progressEntries, startDate); try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } }
  function formatTime(total: number) { const mins = Math.floor(total / 60); const secs = total % 60; return `${mins}:${secs.toString().padStart(2, "0")}`; }

  return (
    <div className="min-h-screen bg-[#fff9fb] text-black p-4 md:p-8" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <PixelCard className="bg-[#febdcd]">
            <CardContent className="p-5 md:p-7">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3"><Sparkles className="w-5 h-5" /><Badge className="bg-white text-black border-2 border-black rounded-full">Cozy workout mode</Badge></div>
                  <h1 className="text-lg md:text-2xl leading-relaxed">Workout tayo, ano tara?!</h1>
                  <p className="mt-3 text-[10px] md:text-xs leading-6 font-sans" style={{ fontFamily: "ui-sans-serif, system-ui" }}>A visual home workout buddy built to feel like parang naglalaro ka lang (mindset ba mindset ba)</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  <Button onClick={() => setTab("home")} className="h-auto py-3 rounded-2xl border-2 border-black bg-white text-black hover:bg-[#c8e3f4]"><div className="flex flex-col items-center gap-2"><Home className="w-4 h-4" /><span className="text-[9px]">Home</span></div></Button>
                  <Button onClick={() => setTab("workout")} className="h-auto py-3 rounded-2xl border-2 border-black bg-white text-black hover:bg-[#c8e3f4]"><div className="flex flex-col items-center gap-2"><Dumbbell className="w-4 h-4" /><span className="text-[9px]">Workout</span></div></Button>
                  <Button onClick={() => setTab("timer")} className="h-auto py-3 rounded-2xl border-2 border-black bg-white text-black hover:bg-[#c8e3f4]"><div className="flex flex-col items-center gap-2"><TimerReset className="w-4 h-4" /><span className="text-[9px]">Timer</span></div></Button>
                  <Button onClick={() => setTab("progress")} className="h-auto py-3 rounded-2xl border-2 border-black bg-white text-black hover:bg-[#c8e3f4]"><div className="flex flex-col items-center gap-2"><ScrollText className="w-4 h-4" /><span className="text-[9px]">Progress</span></div></Button>
                </div>
              </div>
            </CardContent>
          </PixelCard>
        </motion.div>

        {tab === "home" && <HomeTab today={today} toggleDaily={toggleDaily} dailyPercent={dailyPercent} requiredDailyCount={requiredDailyCount} weeklyPattern={weeklyPattern} activeFlow={activeFlow} todaysPlanText={todaysPlanText} selectedFlow={selectedFlow} statusText={statusText} workoutProgress={workoutProgress} completedStepIds={completedStepIds} resetSelectedFlow={resetSelectedFlow} setTab={setTab} startDate={startDate} setStartDate={setStartDate} daysSinceStart={daysSinceStart} weekNumber={weekNumber} />}
        {tab === "workout" && <WorkoutTab selectedFlow={selectedFlow} setSelectedFlow={setSelectedFlow} activeFlow={activeFlow} activeProgress={activeProgress} currentStepIndex={currentStepIndex} currentStep={currentStep} completedStepIds={completedStepIds} workoutProgress={workoutProgress} finishMessageMap={finishMessageMap} resetSelectedFlow={resetSelectedFlow} setTab={setTab} markCurrentStepDone={markCurrentStepDone} nextStep={nextStep} />}
        {tab === "timer" && <TimerTab secondsLeft={secondsLeft} setSecondsLeft={setSecondsLeft} isRunning={isRunning} setIsRunning={setIsRunning} formatTime={formatTime} />}
        {tab === "progress" && <ProgressTab progressForm={progressForm} handleProgressFormChange={handleProgressFormChange} saveProgressEntry={saveProgressEntry} copySummary={copySummary} copied={copied} progressEntries={progressEntries} daysSinceStart={daysSinceStart} weekNumber={weekNumber} weeklyPattern={weeklyPattern} />}
      </div>
    </div>
  );
}
