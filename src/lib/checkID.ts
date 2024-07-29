export const checkId = (taskN: string, Task: Array<object>) => {
  const index = parseInt(taskN);
  const testID = Task.some((element: any) => element.Id == index);
  if (!taskN || !testID) {
    console.log("Please provide a valid task number");
    return false
  }
  return true
};
