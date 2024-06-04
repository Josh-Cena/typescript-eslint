class A {
  constructor(
    public x1: number,
    private x2: number,
    readonly x3: number,
    public x4 = 1,
    public x5: number = 1,
    public x6?: number,
  ) {}
}

class B extends A {
  constructor(override x1: number) {
    super(x1, 2, 3, 4, 5, 6);
  }
}
