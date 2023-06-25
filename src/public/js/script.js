function showPass(t){
	var passwordDiv = document.querySelector('.password-div');
	if(t.checked){
		passwordDiv.classList.remove('hide');
	}else{
		passwordDiv.classList.add('hide');
	}
}