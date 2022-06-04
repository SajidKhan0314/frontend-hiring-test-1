import sprite from "./sprite.svg";

const Icons = ({ name, height = 2, width = 2 }) => {
  return (
    <svg style={{ height: `${height}rem`, width: `${width}rem` }}>
      <use href={`${sprite}#icon-${name}`} />
    </svg>
  );
};

export default Icons;
