import React from "react";
  );
}

export function WorkoutTab(props: any) {
  const { selectedFlow, setSelectedFlow, activeFlow, activeProgress, currentStepIndex, currentStep, completedStepIds, workoutProgress, finishMessageMap, resetSelectedFlow, setTab, markCurrentStepDone, nextStep } = props;
  return (
    <div className="space-y-6">
      <PixelCard>
        <CardHeader><CardTitle className="text-sm md:text-base">Choose Your Flow</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {flowOrder.map((flowKey) => {
            const flow = workoutFlows[flowKey];
            const isActive = selectedFlow === flowKey;
            return <Button key={flowKey} onClick={() => setSelectedFlow(flowKey)} className={`h-auto min-h-[120px] rounded-2xl border-2 border-black px-4 py-4 flex flex-col items-start text-left whitespace-normal ${isActive ? "bg-[#febdcd] text-black" : "bg-white text-black hover:bg-[#c8e3f4]"}`}><span className="text-[11px] font-bold">{flow.shortTitle}</span><span className="mt-2 text-[10px] leading-5">{flow.title}</span></Button>;
          })}
        </CardContent>
      </PixelCard>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
        <PixelCard>
          <CardHeader><CardTitle className="text-sm md:text-base">Follow Along</CardTitle></CardHeader>
          <CardContent>
            {activeProgress.isFinished ? (
              <div className="bg-[#fff9fb] border-2 border-black rounded-3xl p-4 md:p-6">
                <div className="bg-[#d9f7e6] border-2 border-black rounded-2xl p-5 mb-5"><p className="text-sm font-semibold mb-2">Flow complete</p><h2 className="text-2xl md:text-3xl font-bold">You finished this flow!</h2><p className="mt-3 text-base">Total steps completed: {completedStepIds.length}</p><p className="mt-3 text-sm text-slate-700">{finishMessageMap[selectedFlow]}</p></div>
                <div className="flex flex-wrap gap-3"><Button onClick={resetSelectedFlow} className="rounded-2xl border-2 border-black bg-[#febdcd] text-black hover:opacity-90">Restart flow</Button><Button onClick={() => setTab("home")} className="rounded-2xl border-2 border-black bg-black text-white hover:opacity-90">Go home</Button><Button onClick={() => setSelectedFlow("dayA")} variant="outline" className="rounded-2xl border-2 border-black bg-white text-black">Choose another flow</Button></div>
              </div>
            ) : (
              <div className={`border-2 border-black rounded-3xl p-4 md:p-6 ${currentStep.label === "rest" ? "bg-[#eaf6ff]" : "bg-[#fff9fb]"}`}>
                <div className="flex items-start justify-between gap-4 mb-4"><div><p className="text-sm font-semibold">Step {currentStepIndex + 1} of {activeFlow.steps.length}</p><h2 className="text-2xl md:text-3xl font-bold mt-2">{currentStep.name}</h2><p className="mt-2 text-lg">{currentStep.detail}</p></div><div className="flex flex-col items-end gap-2"><Badge className={`border rounded-full ${getLabelClasses(currentStep.label)}`}>{currentStep.label}</Badge>{completedStepIds.includes(currentStep.id) && <CheckCircle2 className="w-8 h-8" />}</div></div>
                {currentStep.label === "rest" && <div className="flex items-center gap-2 bg-white border-2 border-black rounded-2xl p-4 mb-4"><Coffee className="w-5 h-5" /><p className="font-semibold">Rest step — breathe and reset.</p></div>}
                <div className="overflow-hidden rounded-3xl border-4 border-black bg-white mb-4"><img src={currentStep.visual || PLACEHOLDER_GIF} alt={currentStep.name} className="w-full h-[280px] md:h-[360px] object-cover" /></div>
                <StepInfo step={currentStep} />
                {!currentStep.instruction && <div className="bg-white border-2 border-black rounded-2xl p-4 mb-5"><p className="font-semibold mb-1">{currentStep.label === "rest" ? "Rest note" : "Tip"}</p><p>{currentStep.tip}</p></div>}
                <div className="flex flex-wrap gap-3"><Button onClick={markCurrentStepDone} className="rounded-2xl border-2 border-black bg-[#febdcd] text-black hover:opacity-90">Mark done</Button><Button onClick={nextStep} className="rounded-2xl border-2 border-black bg-black text-white hover:opacity-90">Next step <ChevronRight className="w-4 h-4 ml-2" /></Button><Button onClick={resetSelectedFlow} variant="outline" className="rounded-2xl border-2 border-black bg-white text-black"><RotateCcw className="w-4 h-4 mr-2" />Reset flow</Button></div>
              </div>
            )}
          </CardContent>
        </PixelCard>

        <div className="space-y-6">
          <PixelCard className="bg-[#c8e3f4]"><CardHeader><CardTitle className="text-sm md:text-base">Flow Progress</CardTitle></CardHeader><CardContent><div className="bg-white border-2 border-black rounded-2xl p-4 mb-4"><p className="font-semibold">{activeFlow.title}</p><p className="text-sm text-slate-700 mt-2">{activeFlow.goal}</p></div><Progress value={workoutProgress} className="h-4 border border-black" /><p className="mt-3 text-sm">{completedStepIds.length} / {activeFlow.steps.length} finished</p></CardContent></PixelCard>
          <PixelCard><CardHeader><CardTitle className="text-sm md:text-base">Step List</CardTitle></CardHeader><CardContent className="space-y-3">{activeFlow.steps.map((step: any, index: number) => { const done = completedStepIds.includes(step.id); const active = index === currentStepIndex && !activeProgress.isFinished; return <div key={step.id} className={`border-2 border-black rounded-2xl p-3 ${active ? "bg-[#febdcd]" : step.label === "rest" ? "bg-[#eef8ff]" : "bg-white"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{step.name}</p><p className="text-sm text-slate-700">{step.detail}</p><p className="mt-2"><Badge className={`border rounded-full ${getLabelClasses(step.label)}`}>{step.label}</Badge></p></div>{done ? <Badge className="bg-black text-white rounded-full">Done</Badge> : active ? <Badge className="bg-white text-black border border-black rounded-full">Current</Badge> : <Badge className="bg-white text-black border border-black rounded-full">Pending</Badge>}</div></div>; })}</CardContent></PixelCard>
          {selectedFlow === "postureCheck" && <PixelCard><CardHeader><CardTitle className="text-sm md:text-base">Why posture matters</CardTitle></CardHeader><CardContent><div className="flex items-start gap-3 bg-[#fff9fb] border-2 border-black rounded-2xl p-4"><Info className="w-5 h-5 mt-0.5 shrink-0" /><div className="space-y-2 text-sm"><p>• Can make the upper body look more structured.</p><p>• Can improve comfort.</p><p>• Helps support a broader-looking silhouette.</p></div></div></CardContent></PixelCard>}
        </div>
      </div>
    </div>
  );
}

export function TimerTab(props: any) {
  const { secondsLeft, setSecondsLeft, isRunning, setIsRunning, formatTime } = props;
  return <div className="max-w-2xl mx-auto"><PixelCard className="bg-[#c8e3f4]"><CardHeader><CardTitle className="text-sm md:text-base">Focus Timer</CardTitle></CardHeader><CardContent className="text-center"><div className="bg-white border-4 border-black rounded-3xl py-10 px-4 mb-5"><p className="text-5xl md:text-6xl font-bold tracking-tight">{formatTime(secondsLeft)}</p><p className="mt-3 text-sm text-slate-600">Use this for rests, planks, stretches, or mini challenges.</p></div><div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">{timerPresets.map((preset) => <Button key={preset} onClick={() => { setSecondsLeft(preset); setIsRunning(false); }} className="rounded-2xl border-2 border-black bg-white text-black hover:bg-[#febdcd]">{preset >= 60 ? `${preset / 60} min` : `${preset} sec`}</Button>)}</div><div className="flex flex-wrap justify-center gap-3"><Button onClick={() => setIsRunning(true)} className="rounded-2xl border-2 border-black bg-black text-white"><Play className="w-4 h-4 mr-2" />Start</Button><Button onClick={() => setIsRunning(false)} className="rounded-2xl border-2 border-black bg-white text-black"><Pause className="w-4 h-4 mr-2" />Pause</Button><Button onClick={() => { setIsRunning(false); setSecondsLeft(60); }} className="rounded-2xl border-2 border-black bg-[#febdcd] text-black"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button></div></CardContent></PixelCard></div>;
}

export function ProgressTab(props: any) {
  const { progressForm, handleProgressFormChange, saveProgressEntry, copySummary, copied, progressEntries, daysSinceStart, weekNumber, weeklyPattern } = props;
  return (
    <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
      <PixelCard>
        <CardHeader><CardTitle className="text-sm md:text-base">Progress Log</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="block text-sm font-semibold mb-2">Date</label><input type="date" value={progressForm.date} onChange={(e) => handleProgressFormChange("date", e.target.value)} className="w-full rounded-2xl border-2 border-black px-4 py-3 bg-white" /></div>
          <div><label className="block text-sm font-semibold mb-2">Workout type</label><select value={progressForm.workoutType} onChange={(e) => handleProgressFormChange("workoutType", e.target.value)} className="w-full rounded-2xl border-2 border-black px-4 py-3 bg-white"><option>Day A</option><option>Day B</option></select></div>
          <div><label className="block text-sm font-semibold mb-2">Push-ups max reps</label><input type="number" min="0" value={progressForm.pushupsMax} onChange={(e) => handleProgressFormChange("pushupsMax", e.target.value)} className="w-full rounded-2xl border-2 border-black px-4 py-3 bg-white" placeholder="Example: 8" /></div>
          {[ ["rowsDifficulty", "Rows difficulty"], ["lateralRaisesDifficulty", "Lateral raises difficulty"], ["overallDifficulty", "Overall workout difficulty"] ].map(([key, label]) => <div key={key}><label className="block text-sm font-semibold mb-2">{label}</label><select value={progressForm[key]} onChange={(e) => handleProgressFormChange(key, e.target.value)} className="w-full rounded-2xl border-2 border-black px-4 py-3 bg-white"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>)}
          <div><label className="block text-sm font-semibold mb-2">Notes</label><textarea value={progressForm.notes} onChange={(e) => handleProgressFormChange("notes", e.target.value)} className="w-full min-h-[120px] rounded-2xl border-2 border-black px-4 py-3 bg-white" placeholder="Example: arms sore but manageable" /></div>
          <div className="flex flex-wrap gap-3"><Button onClick={saveProgressEntry} className="rounded-2xl border-2 border-black bg-[#febdcd] text-black hover:opacity-90">Save entry</Button><Button onClick={copySummary} className="rounded-2xl border-2 border-black bg-black text-white hover:opacity-90"><Copy className="w-4 h-4 mr-2" />Copy Summary</Button></div>
          {copied && <p className="text-sm">Summary copied to clipboard.</p>}
        </CardContent>
      </PixelCard>

      <div className="space-y-6">
        <PixelCard className="bg-[#c8e3f4]"><CardHeader><CardTitle className="text-sm md:text-base">Progress Snapshot</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid sm:grid-cols-2 gap-4"><div className="bg-white border-2 border-black rounded-2xl p-4"><p className="text-sm font-semibold">Days since start</p><p className="text-3xl font-bold mt-3">{daysSinceStart || 0}</p></div><div className="bg-white border-2 border-black rounded-2xl p-4"><p className="text-sm font-semibold">Current week</p><p className="text-3xl font-bold mt-3">{weekNumber || 0}</p></div></div><div className="bg-white border-2 border-black rounded-2xl p-4"><p className="text-sm font-semibold mb-2">Weekly pattern</p><p className="text-sm">{weeklyPattern}</p></div></CardContent></PixelCard>
        <PixelCard><CardHeader><CardTitle className="text-sm md:text-base">Saved Entries</CardTitle></CardHeader><CardContent className="space-y-4">{progressEntries.length === 0 ? <div className="bg-[#fff9fb] border-2 border-black rounded-2xl p-4 text-sm">No entries yet. Your first saved workout log will show up here.</div> : progressEntries.slice().sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry: any) => <div key={entry.id} className="bg-white border-2 border-black rounded-2xl p-4"><div className="flex flex-wrap items-center justify-between gap-3 mb-3"><div><p className="font-semibold">{entry.workoutType}</p><p className="text-sm text-slate-700">{entry.date}</p></div><Badge className="bg-[#febdcd] text-black border border-black rounded-full">{entry.overallDifficulty}</Badge></div><div className="grid sm:grid-cols-2 gap-3 text-sm"><p><span className="font-semibold">Push-ups max:</span> {entry.pushupsMax || "—"}</p><p><span className="font-semibold">Rows:</span> {entry.rowsDifficulty}</p><p><span className="font-semibold">Lateral raises:</span> {entry.lateralRaisesDifficulty}</p><p><span className="font-semibold">Overall:</span> {entry.overallDifficulty}</p></div><div className="mt-3 bg-[#fff9fb] border border-black rounded-xl p-3 text-sm"><span className="font-semibold">Notes:</span> {entry.notes || "No notes yet"}</div></div>)}</CardContent></PixelCard>
      </div>
    </div>
  );
}
