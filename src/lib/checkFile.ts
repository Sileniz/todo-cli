export const checkFile = (data: string, err: NodeJS.ErrnoException | null) => {
  if(data == null || err || data.length == 0){
    console.log("There are no tasks at the moment");
    return false
  }
  try {
    const parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      return true;
    } else {
      console.log("There are no tasks at the moment");
      return false;
    }
  } catch (e) {
    console.error("Error parsing file data:", e);
    return false;
  }
}