"use client";

import React, { useMemo, useState } from "react";
import { Clock3, MessageSquare, Plus, Search, Send, UserCircle } from "lucide-react";

const initialThreads = [
  {
    id: 1,
    title: "How should I revise generated notes before an exam?",
    author: "Aarav",
    course: "Study Strategy",
    replies: 4,
    lastActive: "Today",
    body: "I usually get long notes. What is the best way to turn them into quick revision points?",
  },
  {
    id: 2,
    title: "Quiz answers are confusing for database normalization",
    author: "Meera",
    course: "DBMS",
    replies: 2,
    lastActive: "Yesterday",
    body: "Can someone explain 2NF vs 3NF with a simple student-course example?",
  },
  {
    id: 3,
    title: "Best prompt for Java interview Q&A",
    author: "Dev",
    course: "Java",
    replies: 7,
    lastActive: "2 days ago",
    body: "I want Q&A pairs that include examples and common mistakes. What prompt works well?",
  },
];

function DiscussionsPage() {
  const [threads, setThreads] = useState(initialThreads);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const filteredThreads = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return threads;

    return threads.filter((thread) =>
      [thread.title, thread.body, thread.course, thread.author].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [search, threads]);

  const createThread = (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setThreads((current) => [
      {
        id: Date.now(),
        title: title.trim(),
        body: body.trim(),
        author: "You",
        course: "General",
        replies: 0,
        lastActive: "Just now",
      },
      ...current,
    ]);
    setTitle("");
    setBody("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      <div className="glow-card p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-glow">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Discussions</h1>
              <p className="text-sm text-text-secondary">
                Ask questions, compare answers, and keep course doubts in one place.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-white/[0.06] bg-dark-tertiary/70 py-2.5 pl-10 pr-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
              placeholder="Search discussions"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        <div className="space-y-4">
          {filteredThreads.map((thread) => (
            <article key={thread.id} className="glass-card-static p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-dark-tertiary border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-5 h-5 text-text-secondary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted mb-1">
                    <span>{thread.author}</span>
                    <span className="h-1 w-1 rounded-full bg-text-muted" />
                    <span>{thread.course}</span>
                    <span className="h-1 w-1 rounded-full bg-text-muted" />
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3 w-3" />
                      {thread.lastActive}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-text-primary">{thread.title}</h2>
                  <p className="mt-2 text-sm text-text-secondary">{thread.body}</p>
                  <div className="mt-4 text-xs font-medium text-blue-300">{thread.replies} replies</div>
                </div>
              </div>
            </article>
          ))}

          {filteredThreads.length === 0 && (
            <div className="glass-card-static p-8 text-center">
              <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-secondary">No discussions match your search.</p>
            </div>
          )}
        </div>

        <form onSubmit={createThread} className="glass-card-static p-5 h-fit space-y-4">
          <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-300" />
            New Discussion
          </h2>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-dark-tertiary/70 px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
            placeholder="Question title"
          />
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={6}
            className="w-full rounded-xl border border-white/[0.06] bg-dark-tertiary/70 px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
            placeholder="Describe your doubt or idea"
          />
          <button className="gradient-btn w-full flex items-center justify-center gap-2" type="submit">
            <Send className="w-4 h-4" />
            Post Discussion
          </button>
        </form>
      </div>
    </div>
  );
}

export default DiscussionsPage;
