export enum Department {
    Dept1 = 'DEPT_1',
    Dept2 = 'DEPT_2',
    Pdp = 'PDP',
    Zrw = 'ZRW',
}

export const DepartmentLabels: Record<Department, string> = {
    [Department.Dept1]: 'Oddział 1 (kl. 1–3)',
    [Department.Dept2]: 'Oddział 2 (kl. 4–8)',
    [Department.Pdp]: 'PDP',
    [Department.Zrw]: 'ZRW',
};
