#Write a shell script to find the largest and smallest among three numbers accepted from the user.
#-------------------------------------------------------------------------------------------------
echo "Enter Three number: "
read num1 num2 num3

largest=$num1
smallest=$num1

if [ $num2 -gt $largest ]; then
    largest=$num2
fi

if [ $num3 -gt $largest ]; then
    largest=$num3
fi

if [ $num2 -lt $smallest ]; then
    smallest=$num2
fi

if [ $num3 -lt $smallest ]; then
    smallest=$num3
fi

echo "Largest number is: $largest"
echo "Smallest number is: $smallest"

