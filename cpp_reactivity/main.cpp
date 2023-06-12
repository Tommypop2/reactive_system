#include <iostream>
#include <vector>
#include <functional>
#include <set>
using namespace std;
void *current_memo = NULL;
template <typename T>
class Memo
{
public:
    T value;
    std::set<Memo *> subscribers;
    std::set<Memo *> dependencies;
    function<T()> computation_ptr = NULL;
    bool dirty = false;
    int depsDirtyCount = 0;
    Memo(function<T()> computation_ptr)
    {
        this->computation_ptr = computation_ptr;
        this->update();
    }
    ~Memo()
    {
        // Remove the pointer to this instance from all subscribers and dependencies
        for (auto dep : this->dependencies)
        {
            dep->subscribers.erase(this);
        }
        for (auto sub : this->subscribers)
        {
            sub->dependencies.erase(this);
        }
    }
    update()
    {
        void *prevMemo = current_memo;
        current_memo = this;
        auto newValue = this->computation_ptr();
        current_memo = prevMemo;
        this->value = newValue;
        // Mark children as dirty
        for (auto sub : this->subscribers)
        {
            sub->dirty = true;
        }
        this->dirty = false;
        return 0;
    }
    track()
    {
        if (current_memo == NULL)
        {
            return 0;
        }
        Memo *currentMemoPtr = (Memo *)current_memo;
        this->subscribers.insert(currentMemoPtr);
        currentMemoPtr->dependencies.insert(this);
        return 0;
    }
    get()
    {
        this->track();
        return this->value;
    }
    set(int newValue)
    {
        if (this->value == newValue)
        {
            return 0;
        }
        this->value = newValue;
        this->notifySubscribers();
        return 0;
    }

private:
    increment()
    {
        this->depsDirtyCount++;
        if (this->depsDirtyCount == 1)
        {
            for (auto sub : this->subscribers)
            {
                // Update all children as this node has updated
                sub->increment();
            }
        }
        return 0;
    }
    decrement()
    {
        this->depsDirtyCount--;
        if (this->depsDirtyCount == 0)
        {
            if (this->dirty)
            {
                this->update();
            }
            for (auto sub : this->subscribers)
            {
                // Update all children as this node has updated
                sub->decrement();
            }
        }
        return 0;
    }
    notifySubscribers()
    {
        for (auto sub : this->subscribers)
        {
            sub->dirty = true;
            sub->increment();
        }
        for (auto sub : this->subscribers)
        {
            sub->decrement();
        }
        return 0;
    }
};
int main()
{
    Memo<int> *A = new Memo<int>([]()
                                 { return 0; });
    Memo<int> *B = new Memo<int>([&A]()
                                 { cout << "B updating" << endl;return A->get() + 1; });
    Memo<int> *C = new Memo<int>([&A]()
                                 { cout << "C updating" << endl;return A->get() + 2; });
    Memo<int> *D = new Memo<int>([&B, &C]()
                                 { return B->get() + C->get(); });
    Memo<int> *E = new Memo<int>([&D]()
                                 { return D->get() + 5; });
    cout << E->get() << endl;
    A->set(2);
    cout << E->get() << endl;
    A->set(3);
    cout << E->get() << endl;
    return 0;
}