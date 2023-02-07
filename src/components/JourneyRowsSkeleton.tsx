const JourneyRowSkeleton: React.FC<{ index: number }> = ({ index }) => {
  const widths = {
    large: ["4rem", "6rem", "7rem"],
    small: ["2.5rem", "3rem", "4rem"],
  };

  return (
    <tr>
      <td className="whitespace-nowrap">
        <span
          className="skeleton my-1 h-3"
          style={{ width: widths.small[index % 3] }}
        ></span>
      </td>
      <td className="w-2/3">
        <span
          className="skeleton my-1 ml-auto h-3"
          style={{ width: widths.large[(index + 1) % 3] }}
        ></span>
      </td>
      <td className="w-1/3">
        <span
          className="skeleton my-1 ml-auto h-3"
          style={{ width: widths.small[index % 3] }}
        ></span>
      </td>
    </tr>
  );
};

export default JourneyRowSkeleton;
