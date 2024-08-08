import dayjs from "dayjs";

export function getAllSchedules(): string[] {
    const availableSchedules: string[] = [];
    const initialDate = dayjs().set("hour", 7).set("minute", 30);
    const finalDate = dayjs().set("hour", 20).set("minute", 0);
    let currentDate = initialDate;
    
    while (currentDate.isBefore(finalDate)) {
        currentDate = currentDate.add(30, "minute");
        availableSchedules.push(currentDate.format("HH:mm"));
    }
    return availableSchedules;
}