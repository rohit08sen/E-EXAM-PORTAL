#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
int main(){
	int pid=fork();
	if(pid<0){
		printf("Error");
		exit(-1);
	}
	else if(pid==0){
		printf("child starts");
		for(int i=1;i<=10;i++){
			printf("%d ",i);
		}
		printf("child ends\n");
	}
	else{
		wait();
		printf("parent ends");
	}
}
