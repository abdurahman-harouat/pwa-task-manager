import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Button } from "./Button";
import { cn } from "../../lib/utils";
import "react-day-picker/dist/style.css";

const DatePicker = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const date = value ? new Date(value) : null;

  const handleSelect = (selectedDate) => {
    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      onChange(dateString);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: ar }) : "اختر تاريخاً"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={handleSelect}
          locale={ar}
          disabled={(date) => date > new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
