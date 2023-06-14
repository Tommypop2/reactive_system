#include "../../api/main.cpp"
int main()
{
    auto A = createMemo<int>([]()
                             { return 0; });
    // auto B = createMemo<int>([&A]()
    //                          { return A() + 1; });
    // auto C = createMemo<int>([&A]()
    //                          { return A() + 2; });
    // auto D = createMemo<int>([&B, &C]()
    //                          { return B() + C(); });
    std::cout << A.get();
    return 0;
}