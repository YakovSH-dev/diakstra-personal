import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";

import type { ResourceMeta } from "@/entities/user-course/types";

type ScrollListProps = {
  resources: ResourceMeta[];
};

function ResourceCarousel(props: ScrollListProps) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full max-w-xs"
    >
      <CarouselContent className="-mt-1 h-[200px]">
        {props.resources.map((r) => (
          <CarouselItem key={r.url} className="pt-1 md:basis-1/2">
            <div className="p-1"></div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default ResourceCarousel;
