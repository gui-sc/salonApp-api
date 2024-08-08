import dayjs from "dayjs";

export function getAllSchedules(): string[] {
    const availableSchedules: string[] = [];
    const initialDate = dayjs().set("hour", 8).set("minute", 0);
    const finalDate = dayjs().set("hour", 20).set("minute", 0);
    const currentDate = initialDate;
    while (currentDate.isBefore(finalDate)) {
        availableSchedules.push(currentDate.format("HH:mm"));
        currentDate.add(30, "minute");
    }
    return availableSchedules;
}