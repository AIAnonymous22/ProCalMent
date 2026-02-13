"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassAvatar } from "@/components/ui/glass-avatar";
import { GlassModal } from "@/components/ui/glass-modal";
import { GlassInput } from "@/components/ui/glass-input";
import { mockDocuments, mockFolders } from "@/lib/mock-data";
import { format } from "date-fns";

const fileTypeIcons: Record<string, string> = {
  "application/pdf": "📄",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "📊",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "📝",
  "image/png": "🖼️",
  "image/jpeg": "🖼️",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function LibraryPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<typeof mockDocuments[0] | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockDocuments.forEach((d) => d.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const filteredDocs = useMemo(() => {
    let result = mockDocuments;
    if (selectedFolder) {
      result = result.filter((d) => d.folder === selectedFolder);
    }
    if (selectedTag) {
      result = result.filter((d) => d.tags.includes(selectedTag));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [selectedFolder, selectedTag, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Document Library</h1>
          <p className="text-white/50 mt-1">Secure document management with role-based access</p>
        </div>
        <GlassButton onClick={() => setShowUpload(true)}>+ Upload Document</GlassButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <GlassCard className="p-4">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 px-1">
              Folders
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                  selectedFolder === null ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">📁 All Documents</span>
                <span className="text-xs text-white/30">{mockDocuments.length}</span>
              </button>
              {mockFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                    selectedFolder === folder.name ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">📂 {folder.name}</span>
                  <span className="text-xs text-white/30">{folder.documentCount}</span>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 px-1">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    selectedTag === tag
                      ? "bg-indigo-500/30 border-indigo-400/40 text-indigo-300"
                      : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Documents area */}
        <div className="lg:col-span-9">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full max-w-sm rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-white/15 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  viewMode === "grid" ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  viewMode === "list" ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-white/40 mb-4">
            {filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""}
            {selectedFolder && ` in ${selectedFolder}`}
            {selectedTag && ` tagged "${selectedTag}"`}
          </p>

          {/* Grid View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <GlassCard key={doc.id} hover className="p-5" onClick={() => setSelectedDoc(doc)}>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{fileTypeIcons[doc.mimeType] || "📄"}</span>
                    <GlassBadge>{doc.folder}</GlassBadge>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-3 line-clamp-2">{doc.title}</h3>
                  <p className="text-xs text-white/40 mt-1 line-clamp-2">{doc.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {doc.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <GlassAvatar name={doc.uploadedBy} size="sm" />
                      <span className="text-xs text-white/50">{doc.uploadedBy}</span>
                    </div>
                    <span className="text-xs text-white/30">{formatFileSize(doc.fileSize)}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            /* List View */
            <GlassCard className="divide-y divide-white/10">
              {filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-2xl">{fileTypeIcons[doc.mimeType] || "📄"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{doc.title}</p>
                    <p className="text-xs text-white/40 truncate">{doc.description}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/30 flex-shrink-0">
                    <span>{doc.folder}</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>{format(doc.createdAt, "MMM d")}</span>
                    <GlassAvatar name={doc.uploadedBy} size="sm" />
                  </div>
                </button>
              ))}
            </GlassCard>
          )}
        </div>
      </div>

      {/* Document detail modal */}
      <GlassModal
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title}
        maxWidth="max-w-md"
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{fileTypeIcons[selectedDoc.mimeType] || "📄"}</span>
              <div>
                <p className="text-sm text-white/50">{selectedDoc.mimeType}</p>
                <p className="text-sm text-white/50">{formatFileSize(selectedDoc.fileSize)}</p>
              </div>
            </div>
            {selectedDoc.description && (
              <p className="text-sm text-white/60">{selectedDoc.description}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/40 mb-1">Folder</p>
                <GlassBadge>{selectedDoc.folder}</GlassBadge>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Uploaded</p>
                <p className="text-sm text-white/70">{format(selectedDoc.createdAt, "MMM d, yyyy")}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {selectedDoc.tags.map((tag) => (
                  <GlassBadge key={tag} variant="info">{tag}</GlassBadge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-2">Uploaded by</p>
              <div className="flex items-center gap-2">
                <GlassAvatar name={selectedDoc.uploadedBy} size="sm" />
                <span className="text-sm text-white/70">{selectedDoc.uploadedBy}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <GlassButton variant="ghost" onClick={() => setSelectedDoc(null)}>Close</GlassButton>
              <GlassButton>Download</GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Upload modal */}
      <GlassModal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Document">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowUpload(false); }}>
          <GlassInput label="Title" placeholder="Document title" required />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">Description</label>
            <textarea
              rows={2}
              placeholder="Brief description..."
              className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">File</label>
            <div className="rounded-xl border-2 border-dashed border-white/20 p-8 text-center hover:border-white/30 transition-colors">
              <p className="text-3xl mb-2">📎</p>
              <p className="text-sm text-white/50">Drag & drop or click to browse</p>
              <p className="text-xs text-white/30 mt-1">PDF, XLSX, DOCX up to 50 MB</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/70">Folder</label>
              <select className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50">
                {mockFolders.map((f) => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>
            <GlassInput label="Tags" placeholder="Comma separated" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <GlassButton variant="ghost" type="button" onClick={() => setShowUpload(false)}>Cancel</GlassButton>
            <GlassButton type="submit">Upload</GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
