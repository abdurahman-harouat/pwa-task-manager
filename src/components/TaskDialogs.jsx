import React from "react";
import { Plus, Zap } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Dialog, DialogContent, DialogFooter } from "./ui/Dialog";
import { DatePicker } from "./ui/DatePicker";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../constants/taskConstants";

export const AddTaskButton = ({ onAdd }) => {
  return (
    <div className="mb-8">
      <Button onClick={onAdd} className="gap-2">
        <Plus size={16} />
        إضافة مهمة
      </Button>
    </div>
  );
};

export const AddTaskDialog = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  status,
  setStatus,
  priority,
  setPriority,
  date,
  setDate,
  tags,
  selectedTag,
  setSelectedTag,
  isCreatingTag,
  setIsCreatingTag,
  newTagName,
  setNewTagName,
  onCreateTag,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="إضافة مهمة"
      description="أدخل تفاصيل المهمة الجديدة"
    >
      <DialogContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان المهمة"
            className="w-full"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف المهمة (اختياري)"
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            rows={4}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              value={priority}
              onChange={setPriority}
              options={PRIORITY_OPTIONS}
              placeholder="الأولوية"
            />

            <Select
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
              placeholder="الحالة"
            />

            <div>
              <Select
                value={isCreatingTag ? "__new" : selectedTag}
                onChange={(val) => {
                  if (val === "__new") {
                    setIsCreatingTag(true);
                    setSelectedTag("");
                  } else {
                    setIsCreatingTag(false);
                    setSelectedTag(val);
                  }
                }}
                options={[{ value: "", label: "بدون وسم" }, ...(tags || []).map((t) => ({ value: t, label: t })), { value: "__new", label: "إنشاء وسم جديد" }]}
                placeholder="الوسم"
              />

              {isCreatingTag && (
                <div className="mt-2 flex gap-2">
                  <Input value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="اسم الوسم" />
                  <Button onClick={onCreateTag}>إضافة</Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DatePicker value={date} onChange={setDate} />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={onClose}>إلغاء</Button>
            <Button onClick={onSubmit}>إنشاء</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const EditTaskDialog = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  status,
  setStatus,
  priority,
  setPriority,
  date,
  setDate,
  tags,
  tag,
  setTag,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="تعديل المهمة"
      description="عدّل تفاصيل المهمة"
    >
      <DialogContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان المهمة"
            className="w-full"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف المهمة (اختياري)"
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            rows={4}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              value={priority}
              onChange={setPriority}
              options={PRIORITY_OPTIONS}
              placeholder="الأولوية"
            />

            <Select
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
              placeholder="الحالة"
            />

            <Select
              value={tag}
              onChange={setTag}
              options={[{ value: "", label: "بدون وسم" }, ...(tags || []).map((t) => ({ value: t, label: t }))]}
              placeholder="الوسم"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DatePicker value={date} onChange={setDate} />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={onClose}>إلغاء</Button>
            <Button onClick={onSubmit}>حفظ التغييرات</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="حذف المهمة"
      description="هل أنت متأكد أنك تريد حذف هذه المهمة؟ لا يمكن التراجع عن هذا الإجراء."
    >
      <DialogContent>
        <div className="space-y-4" />
      </DialogContent>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          إلغاء
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          حذف
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const EmptyState = () => {
  return (
    <div className="mt-16 flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-lg bg-muted/30 p-8">
        <Zap size={48} className="mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold text-foreground">ابدأ بإضافة مهمتك الأولى</h3>
        <p className="mt-2 text-sm text-muted-foreground">نظم مهامك واتبع تقدمك</p>
      </div>
    </div>
  );
};
