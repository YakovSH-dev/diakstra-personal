import clsx from "clsx";
import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { makeTimeString } from "@/shared/utils/timeUtils";
import { useClickOutside } from "@/shared/utils/hooks";

import type { ScheduleItem } from "@/entities/course/types";
import { useToggleSelectedSectionMO } from "@/entities/user-course/hooks";

import {
  darkenHsl,
  makeGradientBackground,
} from "@/features/course-customization/colors";
import { useCourseColor } from "@/features/course-customization/hooks";
import WeeklySessionTypeProgressCard from "@/features/course-progress/WeeklySessionTypeProgressCard";
import { useWeeklySessionTypeProgressQO } from "@/features/course-progress/hooks";
import SectionSelectCard from "@/features/course-section-select/SectionSelectCard";
import AddResourcePopover from "@/features/resources/components/AddResourceForm";
import { useGetResourceForCourseQO } from "@/features/resources/hooks";
import ResourceCarousel from "@/features/resources/components/ScrollList";

type ScheduleCardProps = {
  className?: string;
  isSelected: boolean;
  item: ScheduleItem;
  courseName: string;
  weekNumber: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
};

function ScheduleCard({
  item,
  isSelected,
  courseName,
  className,
  weekNumber,
  onMouseEnter,
  onMouseLeave,
}: ScheduleCardProps) {
  const courseColor = useCourseColor(item.courseId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHeightAuto, setsHeightAuto] = useState(false);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const { data: resources } = useQuery(
    useGetResourceForCourseQO(item.courseId),
  );
  const { data: completionPercent } = useQuery(
    useWeeklySessionTypeProgressQO(
      item.courseId,
      item.sessionType,
      weekNumber,
      item.timeSlots,
    ),
  );
  useClickOutside(containerRef, () => {
    onMouseLeave?.();
    setsHeightAuto(false);
  });

  const textShadow = `0px 1px ${darkenHsl(courseColor, 30)}`;
  const res = resources?.filter(
    (r) => r.sessionType === item.sessionType && r.week === weekNumber,
  );
  return (
    <div
      ref={containerRef}
      className={clsx(
        !isSelected && "opacity-50 relative",
        "rounded-sm  shadow-md",
        "flex flex-col justify-start items-center",
        "-translate-y-[2px] -translate-x-[1px]",
        "min-w-full min-h-full ",
        className,
        isHeightAuto ? "h-auto w-fit z-20 scale-110" : "h-full",
      )}
      style={{
        background: makeGradientBackground(
          completionPercent === 100 ? darkenHsl(courseColor, 20) : courseColor,
        ),
        boxShadow: `1px 3px 0px 0px ${darkenHsl(courseColor, completionPercent === 100 ? 50 : 20)}`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setsHeightAuto(true);
      }}
      onFocus={() => {
        onMouseEnter?.();
        setsHeightAuto(true);
      }}
      onBlur={() => {
        onMouseLeave?.();
        setsHeightAuto(false);
      }}
      onMouseEnter={() => {
        onMouseEnter?.();
        setsHeightAuto(true);
      }}
      onMouseLeave={() => {
        onMouseLeave?.();
        setsHeightAuto(false);
      }}
    >
      <div className="flex gap-2">
        <div>
          <WeeklySessionTypeProgressCard
            className="mb-1 mt-1 border-b text-truncate"
            textStyles={{
              textShadow: textShadow,
              opacity: completionPercent === 100 ? "0.6" : "1",
            }}
            courseId={item.courseId}
            sessionType={item.sessionType}
            slotIndices={item.timeSlots}
            weekNumber={weekNumber}
            courseName={courseName}
          >
            {isSelected && <WeeklySessionTypeProgressCard.CompleteButton />}
          </WeeklySessionTypeProgressCard>
          <SectionSelectCard
            className="mb-0.5"
            textStyles={{
              textShadow: textShadow,
              opacity: completionPercent === 100 ? "0.6" : "1",
            }}
            courseId={item.courseId}
            sessionType={item.sessionType}
            sectionId={item.sectionId}
            instructorName={item.instructor}
            groupNum={0}
            selectButton={
              isSelected ? <SectionSelectCard.SelectButton /> : null
            }
          />
          <ExtraInfo
            item={item}
            textShadow={textShadow}
            opacity={completionPercent === 100 ? "0.6" : "1"}
          />
        </div>
        {(isAddingResource || (isSelected && isHeightAuto)) && (
          <div className="h-30 w-30 outline ouline-red-500 absolute top-0 left-full">
            <AddResourcePopover
              courseId={item.courseId}
              resourceMeta={{ week: weekNumber, sessionType: item.sessionType }}
              onToggle={() => setIsAddingResource(!isAddingResource)}
            />
            <ResourceCarousel resources={res} />
          </div>
        )}
        {!isSelected && <SelectOverlay item={item} />}
      </div>
    </div>
  );
}

function SelectOverlay({ item }: { item: ScheduleItem }) {
  const toggleSelectionTrigger = useMutation(useToggleSelectedSectionMO());
  return (
    <button
      className="absolute inset-0 cursor-pointer"
      onClick={() =>
        toggleSelectionTrigger.mutate({
          courseId: item.courseId,
          sessionType: item.sessionType,
          sectionId: item.sectionId,
        })
      }
    ></button>
  );
}

function ExtraInfo({
  item,
  textShadow,
  opacity,
}: {
  item: ScheduleItem;
  textShadow: string;
  opacity?: string;
}) {
  const timeString = makeTimeString(item.startMinute, item.endMinute);
  return (
    <div className="text-center ">
      <div
        className="text-[0.6rem]"
        style={{ textShadow: textShadow, opacity: opacity }}
      >
        {timeString}
      </div>
    </div>
  );
}

export default ScheduleCard;
