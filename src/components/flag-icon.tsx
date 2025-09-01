import Image from "next/image";

interface FlagIconProps {
  countryCode: string;
  className?: string;
  width: number;
  height: number;
}

export default function FlagIcon({
  countryCode,
  className,
  width,
  height,
}: FlagIconProps) {
  const imgPath = `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`;

  return (
    <Image
      className={className}
      src={imgPath}
      alt={`${countryCode} flag`}
      width={width}
      height={height}
    />
  );
}
