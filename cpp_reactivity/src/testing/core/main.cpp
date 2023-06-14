#include "../../core/main.cpp"

int main()
{
    Memo<int> *owner = NULL;
    Memo<int> *A = new Memo<int>([&owner]()
                                 { owner = getOwner<int>();return 0; });
    Memo<int> *B = new Memo<int>([&A]()
                                 { std::cout << "B updating" << std::endl;return A->get() + 1; });
    Memo<int> *C = new Memo<int>([&A]()
                                 { std::cout << "C updating" << std::endl;return A->get() + 2; });
    Memo<int> *D = new Memo<int>([&B, &C]()
                                 { return B->get() + C->get(); });
    Memo<int> *E = new Memo<int>([&D]()
                                 { std::cout << "E updating" << std::endl;return D->get() + 5; });
    std::cout << E->get() << std::endl;
    A->set(2);
    std::cout << E->get() << std::endl;
    // This is functionally the same as A->set(3)
    owner->set(3);
    std::cout << E->get() << std::endl;
    return 0;
}