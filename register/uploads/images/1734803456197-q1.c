//Write a program to create a child process, and output the PID of the child process and PID of the parent process.
#include<stdio.h>
#include<sys/types.h>
#include<stdlib.h>
#include<unistd.h>
int main(){
	int pid=fork();
	if(pid==0){
		printf("child process with id\n ");
		 printf("child: %d\n",getpid());
	}
	else{
		printf("Parent process with id \n");
		printf("Parent: %d\n",getppid());
	}

}
