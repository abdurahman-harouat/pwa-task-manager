import React from "react";
import { cn } from "../../lib/utils";
import { AlertTriangle, X } from "lucide-react";

const Dialog = ({ isOpen, onClose, title, description, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div
        className={cn(
          "w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-lg mx-4 animate-in fade-in zoom-in duration-200",
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-muted-foreground text-sm mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

const DialogFooter = ({ children }) => (
  <div className="flex justify-end gap-3 mt-6">{children}</div>
);

export { Dialog, DialogContent, DialogFooter };
