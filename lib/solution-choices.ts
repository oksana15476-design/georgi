import type {Copy} from './content';
const c=(s:string)=>s.split('|') as Copy;
// Options for the lead form on the solutions page. Kept apart from page-profiles so the client
// bundle does not pull every page profile.
export const solutionChoices:Copy[]=[c('Обучить команду|Train the team|გუნდის სწავლება'),c('Внедрить готовые инструменты|Implement existing tools|მზა ინსტრუმენტების დანერგვა'),c('Разработать своё решение|Build a custom solution|საკუთარი გადაწყვეტის შექმნა'),c('Нужна консультация по выбору|Help me choose|დამეხმარეთ არჩევაში')];
