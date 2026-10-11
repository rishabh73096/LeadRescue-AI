import type { AuthHeroData } from "@/types/content";

export function AuthHeadline({ headline, headlineAccent, description }: Pick<AuthHeroData, "headline" | "headlineAccent" | "description">) {
  return (
    <div>
      <h2 className="font-inter text-[31px] leading-[36px] font-extrabold tracking-[-0.8px] text-ink sm:text-[41px] sm:leading-[46px] xl:text-[47px] xl:leading-[50px] min-[1440px]:text-[53px] min-[1440px]:leading-[54px] min-[1440px]:tracking-[-1.35px]">
        <span className="block xl:whitespace-nowrap">{headline}</span>
        <span className="block bg-linear-to-r from-[#0f9d75] to-[#2dd4a8] bg-clip-text text-transparent xl:whitespace-nowrap">{headlineAccent}</span>
      </h2>
      <p className="font-inter mt-6 w-full max-w-[650px] text-base leading-6 font-normal tracking-normal text-slate-500">{description}</p>
    </div>
  );
}
