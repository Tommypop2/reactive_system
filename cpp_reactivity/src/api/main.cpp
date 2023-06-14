#include "../core/main.cpp"
#include <functional>
template <typename T>
struct Signal
{
};
/**
 * Creates an effect
 * This function will leak memory unless you get the owner by its reference through the `getOwner` function and deallocate it somewhere else
 */
template <typename T>
void createEffect(std::function<T()> fn)
{
    new Memo<T>(fn);
}
/**
 * Creates a memo
 * You will need to deallocate manually if you don't want to leak memory
 */
template <typename T>
auto createMemo(std::function<T()> fn)
{
    Memo<T> *memo = new Memo<T>(fn);
    return memo->get;
}
/**
 * Creates a signal
 */
// template <typename T>
// SignalReturn<T> createSignal(std::function<T()> fn)
// {
//     Memo<T> *memo = new Memo<T>(fn);
//     auto signal = Signal<T>{memo->get};
// }