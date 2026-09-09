import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type EntranceVariant = "collage" | "process" | "split";

interface SectionPlan {
  variant: EntranceVariant;
  selectors: readonly string[];
}

const SECTION_PLANS: Readonly<Record<string, SectionPlan>> = {
  jewelry: {
    variant: "collage",
    selectors: [
      ":scope > div.mx-auto > div > header",
      ":scope > div.mx-auto > div > header + div",
      ":scope > div.mx-auto > div > div:nth-child(3) figure",
    ],
  },
  hechuras: {
    variant: "process",
    selectors: [
      ":scope > div.mx-auto > div > header",
      ":scope > div.mx-auto > div > header + div",
      ":scope > div.mx-auto > div > ol > li",
    ],
  },
  "work-gallery": {
    variant: "split",
    selectors: [
      ":scope > div.mx-auto > div > header",
      ":scope > div.mx-auto > div > header + div",
    ],
  },
  repairs: {
    variant: "split",
    selectors: [
      ":scope > div.mx-auto > div > div:first-child > header",
      ":scope > div.mx-auto > div > div:first-child > div.mt-8",
      ":scope > div.mx-auto > div > figure",
    ],
  },
  questions: {
    variant: "split",
    selectors: [
      ":scope > div.mx-auto > header",
      ":scope > div.mx-auto > [data-faq-root] > div",
    ],
  },
  visit: {
    variant: "split",
    selectors: [
      ":scope > div.mx-auto > div > div:first-child > header",
      ":scope > div.mx-auto > div > div:first-child > address",
      ":scope > div.mx-auto > div > div:first-child > div.mt-10",
      ":scope > div.mx-auto > footer",
    ],
  },
};

const initializedSections = new Map<HTMLElement, () => void>();

const getTargetGroups = (
  section: HTMLElement,
  selectors: readonly string[],
): HTMLElement[][] =>
  selectors
    .map((selector) =>
      Array.from(section.querySelectorAll<HTMLElement>(selector)),
    )
    .filter((group) => group.length > 0);

const addCollageEntrance = (
  timeline: gsap.core.Timeline,
  groups: HTMLElement[][],
  distance: number,
): void => {
  groups.forEach((group, index) => {
    const isMediaGroup = index === groups.length - 1;

    timeline.fromTo(
      group,
      {
        autoAlpha: 0,
        x: isMediaGroup ? 0 : index % 2 === 0 ? -distance : distance,
        y: isMediaGroup ? distance : 0,
        scale: isMediaGroup ? 0.985 : 1,
        clipPath: isMediaGroup ? "inset(7% 0 7% 0)" : "inset(0% 0 0% 0)",
      },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: isMediaGroup ? 0.72 : 0.58,
        stagger: isMediaGroup ? 0.09 : 0.04,
        ease: "power3.out",
      },
      index === 0 ? 0 : "<+=0.12",
    );
  });
};

const addProcessEntrance = (
  timeline: gsap.core.Timeline,
  groups: HTMLElement[][],
  distance: number,
): void => {
  groups.forEach((group, index) => {
    timeline.fromTo(
      group,
      { autoAlpha: 0, y: index === groups.length - 1 ? distance : distance / 2 },
      {
        autoAlpha: 1,
        y: 0,
        duration: index === groups.length - 1 ? 0.62 : 0.5,
        stagger: index === groups.length - 1 ? 0.1 : 0.04,
        ease: "power3.out",
      },
      index === 0 ? 0 : "<+=0.1",
    );
  });
};

const addSplitEntrance = (
  timeline: gsap.core.Timeline,
  groups: HTMLElement[][],
  distance: number,
): void => {
  groups.forEach((group, index) => {
    timeline.fromTo(
      group,
      {
        autoAlpha: 0,
        x: index % 2 === 0 ? -distance : distance,
        y: distance / 3,
      },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: 0.58,
        stagger: 0.08,
        ease: "power3.out",
      },
      index === 0 ? 0 : "<+=0.11",
    );
  });
};

const mountSectionEntrances = (): void => {
  Object.entries(SECTION_PLANS).forEach(([sectionId, plan]) => {
    const section = document.getElementById(sectionId);

    if (!(section instanceof HTMLElement) || initializedSections.has(section)) {
      return;
    }

    const groups = getTargetGroups(section, plan.selectors);
    if (groups.length === 0) {
      return;
    }

    const media = gsap.matchMedia();

    media.add(
      {
        desktop: "(min-width: 1024px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
        fullMotion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (context.conditions?.reduceMotion === true) {
          return;
        }

        const distance = context.conditions?.desktop === true ? 20 : 12;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });

        if (plan.variant === "collage") {
          addCollageEntrance(timeline, groups, distance);
        } else if (plan.variant === "process") {
          addProcessEntrance(timeline, groups, distance);
        } else {
          addSplitEntrance(timeline, groups, distance);
        }

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.revert();
        };
      },
    );

    initializedSections.set(section, () => {
      media.revert();
      initializedSections.delete(section);
    });
  });
};

const cleanupSectionEntrances = (): void => {
  initializedSections.forEach((cleanup) => cleanup());
  initializedSections.clear();
};

mountSectionEntrances();
document.addEventListener("astro:page-load", mountSectionEntrances);
document.addEventListener("astro:before-swap", cleanupSectionEntrances);
