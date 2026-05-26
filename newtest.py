
numbers = [3, 5, 2, 9, 5, 7, 5, 2, 9, 10]


def print_stats(numbers):
    if not numbers:
        print("The list is empty.")
        return

    # Mean
    mean = sum(numbers) / len(numbers)
    print(f"Mean: {mean}")

    # Median
    sorted_numbers = sorted(numbers)
    n = len(sorted_numbers)
    if n % 2 == 1:
        median = sorted_numbers[n // 2]
    else:
        median = (sorted_numbers[(n // 2) - 1] + sorted_numbers[n // 2]) / 2
    print(f"Median: {median}")

    # Mode
    freq = {}
    for num in numbers:
        freq[num] = freq.get(num, 0) + 1
    max_count = max(freq.values())
    modes = [num for num, count in freq.items() if count == max_count]
    if len(modes) == 1:
        print(f"Mode: {modes[0]}")
    else:
        print(f"Mode: {modes} (multimodal)")

    # Sum
    total = sum(numbers)
    print(f"Sum: {total}")

    # Min
    minimum = min(numbers)
    print(f"Min: {minimum}")

    # Max
    maximum = max(numbers)
    print(f"Max: {maximum}")

print_stats(numbers)