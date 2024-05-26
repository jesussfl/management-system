export default function getGuideCode(id: number) {
  //Explanation: If the id only has one digit, add two zeros in front of it but if it has two digits, add one zero in front of it
  return `00${id}`.slice(-3)
}
