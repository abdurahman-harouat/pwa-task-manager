import React from "react";
import { X, Calendar as CalendarIcon, Tag, AlertCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select"; // Assuming this handles native select
// FIX: Removed DialogHeader and DialogTitle since they are not exported by ./ui/Dialog
import { Dialog, DialogContent, DialogFooter } from "./ui/Dialog";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../constants/taskConstants";

// --- Empty State ---
export const EmptyState = () => (
  <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center animate-in fade-in zoom-in duration-300">
    <div className="mb-4 rounded-full bg-primary/10 p-4">
      <div className="h-8 w-8 text-primary">✨</div>
    </div>
    <h3 className="text-lg font-semibold">كل شيء هادئ هنا</h3>
    <p className="mt-1 text-sm text-muted-foreground max-w-xs">
      قائمتك فارغة. هذا هو الوقت المثالي للتخطيط ليومك وإضافة مهام جديدة.
    </p>
  </div>
);

// --- Add Task Dialog ---
export const AddTaskDialog = ({
  isOpen, onClose, onSubmit,
  title, setTitle, description, setDescription,
  status, setStatus, priority, setPriority,
  date, setDate,
  tags, selectedTag, setSelectedTag, isCreatingTag, setIsCreatingTag, newTagName, setNewTagName, onCreateTag
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {/* Replacement for DialogHeader and DialogTitle */}
        <div className="flex flex-col space-y-1.5 text-center sm:text-right p-4 pb-0">
          <h2 className="text-lg font-semibold leading-none tracking-tight">مهمة جديدة</h2>
        </div>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4 p-4 pt-0">
          {/* Title Input - Large & Clean */}
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ما الذي يجب فعله؟"
            className="w-full bg-transparent text-lg font-semibold placeholder:text-muted-foreground/50 focus:outline-none"
          />

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="إضافة تفاصيل..."
            className="w-full resize-none bg-transparent text-sm min-h-[80px] focus:outline-none text-muted-foreground"
          />

          <div className="h-px bg-border/50" />

          {/* Controls Grid */}
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground">الأولوية</label>
                <Select value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} className="w-full text-xs h-9" />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground">القائمة</label>
                <Select value={status} onChange={setStatus} options={STATUS_OPTIONS} className="w-full text-xs h-9" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Tag Logic */}
            <div className="space-y-1">
                 <label className="text-[10px] font-medium text-muted-foreground">الوسم</label>
                 <Select
                    value={isCreatingTag ? "__new" : selectedTag}
                    onChange={(val) => val === "__new" ? (setIsCreatingTag(true), setSelectedTag("")) : (setIsCreatingTag(false), setSelectedTag(val))}
                    options={[{ value: "", label: "بدون" }, ...(tags || []).map(t => ({ value: t, label: t })), { value: "__new", label: "+ جديد" }]}
                    className="w-full text-xs h-9"
                  />
            </div>
             {/* Date Logic */}
             <div className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground">الموعد</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                />
             </div>
          </div>

          {/* Inline New Tag Input */}
          {isCreatingTag && (
             <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <Input 
                    value={newTagName} 
                    onChange={(e) => setNewTagName(e.target.value)} 
                    placeholder="اسم الوسم الجديد..." 
                    className="h-8 text-xs"
                />
                <Button type="button" size="sm" onClick={onCreateTag} className="h-8 px-3 text-xs">حفظ</Button>
             </div>
          )}

          <DialogFooter className="mt-4 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
            <Button type="submit" disabled={!title.trim()}>إنشاء المهمة</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- Edit Task Dialog ---
export const EditTaskDialog = ({
  isOpen, onClose, onSubmit,
  title, setTitle, description, setDescription,
  status, setStatus, priority, setPriority,
  date, setDate, tags, tag, setTag
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent className="sm:max-w-[425px]">
         {/* Replacement for DialogHeader and DialogTitle */}
         <div className="flex flex-col space-y-1.5 text-center sm:text-right p-4 pb-0">
          <h2 className="text-lg font-semibold leading-none tracking-tight">تعديل المهمة</h2>
        </div>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4 p-4 pt-0">
           <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-semibold"
          />
          <textarea
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-ring"
             placeholder="الوصف..."
          />
          
          <div className="grid grid-cols-2 gap-3">
             <Select value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} label="الأولوية" />
             <Select value={status} onChange={setStatus} options={STATUS_OPTIONS} label="الحالة" />
             <Select value={tag} onChange={setTag} options={[{ value: "", label: "بدون" }, ...(tags || []).map(t => ({ value: t, label: t }))]} label="الوسم" />
             <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors" />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
            <Button type="submit">حفظ التغييرات</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- Delete Confirmation ---
export const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm }) => (
  <Dialog isOpen={isOpen} onClose={onClose}>
    <DialogContent className="sm:max-w-[400px]">
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">حذف المهمة؟</h3>
          <p className="text-sm text-muted-foreground">
            هل أنت متأكد من حذف هذه المهمة؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
        </div>
      </div>
      <DialogFooter className="sm:justify-center">
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">تراجع</Button>
        <Button variant="destructive" onClick={onConfirm} className="w-full sm:w-auto">نعم، احذف</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);